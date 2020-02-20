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
}