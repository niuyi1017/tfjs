import * as speechCommands from '@tensorflow-models/speech-commands'

const MODEL_PATH = 'http://imooc.niuy.xyz/tfjs/data'

let transferRecognizer;

window.onload = async () => {
  const recognizer = speechCommands.create(
    'BROWSER_FFT',
    null,
    MODEL_PATH + '/speech/model.json',
    MODEL_PATH + '/speech/metadata.json',
  )
  await recognizer.ensureModelLoaded()
  console.log("loaded")
}