const loadImg = (src) => {
  return new Promise(resolve => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src
    img.height = 224
    img.width = 224
    img.onload = () => {
      resolve(img)
    }
  })
}

export const getInputs = async () => {
  const loadImgs = []
  const labels = []
  for (let i = 0; i < 29; i++){
    ['android', 'apple', 'windows'].forEach(label => {
      const imgP = loadImg(`http://imooc.niuy.xyz/tfjs/data/brand/train/${label}-${i}.jpg`)
      loadImgs.push(imgP)
      labels.push([
        label === 'android' ? 1 : 0,
        label === 'apple' ? 1 : 0,
        label === 'windows' ? 1 : 0
      ])
    })
  }
  const inputs = await Promise.all(loadImgs)
  return {
    inputs,
    labels
  }
}