let img
const width = 700
const height = 400
let positions = {}

function preload() {
  img = loadImage(imageLibrary())
}

function imageLibrary() {
  return sample([
    'http://i.imgur.com/Fx6BGlt.jpg',
    'https://i.imgur.com/IwnuBWX.jpg'
  ])
}

function sample(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function step(x, y, yMax) {
  const temp = getPixelArray(x, y)
  let j = y + 1
  while (j <= yMax && hue(getPixelArray(x, j)) > hue(temp)) {
    setPixelArray(x, j - 1, getPixelArray(x, j))
    j++
  }
  setPixelArray(x, j - 1, temp)
}

function setup() {
  pixelDensity(1)
  createCanvas(width, height)
  frameRate(100)

  reset()

  document.getElementById('reset').onclick = function () {
    reset()
  }
  document.getElementById('fullySort').onclick = function () {
    fullySort()
  }
  document.getElementById('slice').onclick = function () {
    slice()
  }
}

function slice() {
  const m = randRangeDouble(-height / width, height / width)
  const b = randRange(0, height)


  const sliceSize = randRange(3, 50)

  for (let x = 0; x < width; x++) {
    const y = int(m * x + b)
    const maximumY = y + sliceSize
    positions[x] = {
      minimumY: y,
      currentY: maximumY,
      maximumY: maximumY
    }
  }
}

function fullySort() {
  for (let x = 0; x < width; x++) {
    positions[x] = {
      minimumY: 0,
      currentY: height,
      maximumY: height
    }
  }
}

function mouseMoved() {
  const x = mouseX
  const y = mouseY

  if (x >= width) {
    return
  }

  if (positions[x]) {
    positions[x] = {
      minimumY: Math.min(y, positions[x].minimumY),
      currentY: positions[x].currentY,
      maximumY: height
    }
  }
  else {
    positions[x] = {
      minimumY: y,
      currentY: height,
      maximumY: height
    }
  }
}

function draw() {
  loadPixels()

  Object.keys(positions).forEach(function (currentX) {
    const p = positions[currentX]

    if (p.currentY > p.minimumY) {
      p.currentY = Math.max(p.currentY - 1, p.minimumY)
      step(int(currentX), p.currentY, p.maximumY)
    }
  })

  updatePixels()
}

function setPixelArray(x, y, o) {
  const idx = 4 * (y * width + x)
  pixels[idx] = o[0]
  pixels[idx + 1] = o[1]
  pixels[idx + 2] = o[2]
  pixels[idx + 3] = o[3]
}

function getPixelArray(x, y) {
  const off = (y * width + x) * 4
  return [
    pixels[off],
    pixels[off + 1],
    pixels[off + 2],
    pixels[off + 3]
  ]
}

function reset() {
  image(img, 0, 0, width, height)
  positions = {}
}

function randRange(min, max) {
  return int(Math.random() * (max - min) + min)
}

function randRangeDouble(min, max) {
  return Math.random() * (max - min) + min
}
