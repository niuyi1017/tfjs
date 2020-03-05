import * as tfvis  from '@tensorflow/tfjs-vis'
import * as tf  from '@tensorflow/tfjs'
import { getInputs } from './data.js'
import { img2x, file2img } from './utils.js'

const MOBILENET_MODEL_PATH = 'http://127.0.0.1:8080/mobilenet/web_model/model.json'
const NUM_CLASSES = 3
const BRAND_CLASSES = ['android', 'apple','windows']

window.onload = async () => {
  const { inputs, labels } = await getInputs()
  const surface = tfvis.visor().surface({ name: "输入示例", styles: { height: 250 } })
  inputs.forEach(imgEl => {
    surface.drawArea.appendChild(imgEl)
  })
  const mobilenet = await tf.loadLayersModel(MOBILENET_MODEL_PATH)
  mobilenet.summary()
  const layer = mobilenet.getLayer('conv_pw_13_relu')
  const truncateMobilenet = tf.model({
    inputs: mobilenet.inputs,
    outputs: layer.output
  })
  const model = tf.sequential()
  model.add(tf.layers.flatten({
    inputShape: layer.outputShape.slice(1)
  }))
  model.add(tf.layers.dense({
    units: 10,
    activation: 'relu'
  }))
  model.add(tf.layers.dense({
    units: NUM_CLASSES,
    activation: 'softmax'
  }))
  model.compile({ loss: 'categoricalCrossentropy', optimizer: tf.train.adam() })
  const { xs, ys } = tf.tidy(() => {
    const xs = tf.concat(inputs.map(imgEl => truncateMobilenet.predict(img2x(imgEl))))
    const ys = tf.tensor(labels)
    return { xs, ys }
  })
  await model.fit(xs, ys, {
    epochs: 20,
    callbacks: tfvis.show.fitCallbacks(
      { name: "训练效果" },
      ['loss'],
      {callbacks: ['onEpochEnd']}
    )
  })

  window.predict = async (file) => {
    const img = await file2img(file)
    document.body.appendChild(img)
    const pred = tf.tidy(() => {
      const x = img2x(img) 
      const input = truncateMobilenet.predict(x)
      return model.predict(input)
    })
    const index = pred.argMax(1).dataSync()[0]
    setTimeout(() => {
      alert(`预测结果是 ${BRAND_CLASSES[index]}`)
    },0)
  }
  window.download = async () => {
    await model.save('downloads://model')
  }

}