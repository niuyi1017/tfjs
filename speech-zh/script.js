import * as speechCommends from "@tensorflow-models/speech-commands"
import * as tfvis from "@tensorflow/tfjs-vis"

const MODEL_PATH = 'http://imooc.niuy.xyz/tfjs/data'
let transferRecognizer
window.onload = async () => {
  const recognizer = speechCommends.create(
    'BROWSER_FFT',
    null,
    MODEL_PATH + '/speech/model.json',
    MODEL_PATH + '/speech/metadata.json'
  )
  await recognizer.ensureModelLoaded()
  transferRecognizer = recognizer.createTransfer("轮播图")
}
window.collect = async (btn) => {
  btn.disabled = true
  let lable = btn.innerText
  await transferRecognizer.collectExample(
    lable = lable === "背景噪音" ? '_background_noise_' : lable
  )
  btn.disabled = false
  document.querySelector('#count').innerHTML = JSON.stringify(transferRecognizer.countExamples(), null, 2)
}

window.train = async () => {
  await transferRecognizer.train({
    epochs: 30,
    callback: tfvis.show.fitCallbacks(
      { name: "训练过程"},
      ['loss', 'acc'],
      {callbacks: ['onEpochEnd']}
    )
  })
}
window.toggle = async (checked) => {
  if (checked) {
    console.log(checked)
    await transferRecognizer.listen(result => {
      const { scores } = result
      const labels = transferRecognizer.wordLabels()
      const index = scores.indexOf(Math.max(...scores))
      console.log(labels[index])
    }, {
        overlapFactor: 0,
      probabilityThreshold: 0.5,
    })
  } else {
    transferRecognizer.stopListening()
  }
}

window.save = () => {
  const arrayBuffer = transferRecognizer.serializeExamples()
  const blob = new Blob([arrayBuffer])
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = "data.bin"
  link.click()
}