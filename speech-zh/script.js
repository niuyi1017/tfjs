import * as speechCommends from "@tensorflow-models/speech-commands"

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
