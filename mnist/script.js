import * as tf from "@tensorflow/tfjs"
import * as tfvis from "@tensorflow/tfjs-vis"
import { getData, MnistData } from "./data"

window.onload = async () => {
  const data = new MnistData()
  await data.load()
  const examples = data.nextTestBatch(20)
  const surface = tfvis.visor().surface({name: "输入示例"})
  for (let i = 0; i < 20; i++){
    const imageTensor = tf.tidy(() => {
      return examples.xs.slice([i, 0], [1, 784]).reshape([28,28,1])
    })
    const canvas = document.createElement('canvas')
    canvas.width = 28
    canvas.height = 28
    canvas.style = 'margin: 4'
    await tf.browser.toPixels(imageTensor, canvas)
    surface.drawArea.appendChild(canvas)
  }

  const model = tf.sequential()
  model.add(tf.layers.conv2d(
    {
      inputShape: [28, 28, 1],
      kernelSize: 5,
      filters: 8,
      strides: 1,
      activation: 'relu',
      kernelInitializer:'varianceScaling'
    }
  ))
  model.add(tf.layers.maxPool2d({
    poolSize: [2, 2],
    strides: [2,2]
  }))
  model.add(tf.layers.conv2d({
    kernelSize: 5,
    filters: 16,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }))
  model.add(tf.layers.maxPool2d({
    poolSize: [2, 2],
    strides: [2,2]
  }))
  model.add(tf.layers.flatten())
  model.add(tf.layers.dense({
    units: 10,
    activation: 'softmax',
    kernelInitializer: 'varianceScaling'
  }))
  model.compile({
    loss: 'categoricalCrossentropy',
    optimizer: tf.train.adam(),
    metrics: 'accuracy'
  })
  const [trainXs, trainYs] = tf.tidy(() => {
    const d = data.nextTrainBatch(1000)
    return [
      d.xs.reshape([1000, 28, 28, 1]),
      d.labels
    ]
  })
  const [testXs, testYs] = tf.tidy(() => {
    const d = data.nextTestBatch(200)
    return [
      d.xs.reshape([200, 28, 28, 1]),
      d.labels
    ]
  })
  await model.fit(trainXs, trainYs, {
    validationData: [testXs, testYs],
    epochs: 50,
    callbacks: tfvis.show.fitCallbacks(
      { name: "训练效果" },
      ['loss', 'val_loss', 'acc', 'val_acc'],
      { callbacks: ['onEpochEnd'] }
      
    )
  })
}