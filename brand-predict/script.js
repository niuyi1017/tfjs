import * as tf  from '@tensorflow/tfjs'
import { img2x, file2img } from './utils.js'

const MOBILENET_MODEL_PATH = 'http://127.0.0.1:8080/mobilenet/web_model/model.json'
const NUM_CLASSES = 3
const BRAND_CLASSES = ['android', 'apple','windows']

window.onload = async () => {
  
  const mobilenet = await tf.loadLayersModel(MOBILENET_MODEL_PATH)
  mobilenet.summary()
  const layer = mobilenet.getLayer('conv_pw_13_relu')
  const truncateMobilenet = tf.model({
    inputs: mobilenet.inputs,
    outputs: layer.output
  })
  const model = await tf.loadLayersModel(MOBILENET_MODEL_PATH.replace('mobilenet','brand'))
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
  
}