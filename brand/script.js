import * as tfvis  from '@tensorflow/tfjs-vis'
import { getInputs } from './data.js'

window.onload = async () => {
  const { inputs, labels } = await getInputs()
  const surface = tfvis.visor().surface({ name: "输入示例", styles: { height: 250 } })
  inputs.forEach(imgEl => {
    surface.drawArea.appendChild(imgEl)
  });
}