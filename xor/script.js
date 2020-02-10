import * as tf from "@tensorflow/tfjs"
import * as tfvis from "@tensorflow/tfjs-vis"
import { getData } from "./data.js"
window.onload = () => {
  const data = getData(400)
  tfvis.render.scatterplot(
    { name: "xor 训练" },
    {
      values: [
        data.filter(p => p.label === 1),
        data.filter(p => p.label === 0)
    ]}
  )
}