import './style.css'
import * as THREE from 'three'
import { Reflector } from 'three/examples/jsm/objects/Reflector'

const canvas = document.querySelector('canvas.webgl')
const container = document.querySelector('#canvasContainer')
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x05070b)

const videos = [
  document.querySelector('#video1'),
  document.querySelector('#video2'),
  document.querySelector('#video3'),
]

videos.forEach((video) => {
  video.muted = true
  video.loop = true
  video.playsInline = true
  void video.play().catch(() => {})
})

const textureLoader = new THREE.TextureLoader()
const buildingTexture = textureLoader.load('/building.jpeg')
buildingTexture.encoding = THREE.sRGBEncoding

const videoTextures = videos.map((video) => {
  const texture = new THREE.VideoTexture(video)
  texture.encoding = THREE.sRGBEncoding
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
})

const floorTexture = textureLoader.load('/floorTexture.jpg')
floorTexture.encoding = THREE.sRGBEncoding
floorTexture.wrapS = THREE.RepeatWrapping
floorTexture.wrapT = THREE.RepeatWrapping
floorTexture.repeat.set(9, 9)

const theatre = new THREE.Group()
scene.add(theatre)

const textures = [
  buildingTexture,
  videoTextures[0],
  videoTextures[1],
  videoTextures[2],
]

const screenArc = Math.PI / 2 - 0.06
const radius = 3.2
const screenHeight = 2.08

textures.forEach((texture, index) => {
  const thetaStart =
    -3 * Math.PI / 4 +
    index * (Math.PI / 2) +
    0.03

  const screen = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(
      radius,
      radius,
      screenHeight,
      96,
      1,
      true,
      thetaStart,
      screenArc
    ),
    new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      toneMapped: false,
    })
  )

  theatre.add(screen)
})

const floor = new THREE.Mesh(
  new THREE.CircleBufferGeometry(3.15, 96),
  new THREE.MeshStandardMaterial({
    map: floorTexture,
    color: 0x8d91a0,
    roughness: 0.58,
    metalness: 0.22,
  })
)
floor.rotation.x = -Math.PI / 2
floor.position.y = -1.08
scene.add(floor)

const mirror = new Reflector(
  new THREE.CircleBufferGeometry(3.12, 96),
  {
    color: 0x4c5262,
    textureWidth: Math.min(window.innerWidth * window.devicePixelRatio, 1600),
    textureHeight: Math.min(window.innerHeight * window.devicePixelRatio, 1600),
    clipBias: 0.003,
  }
)
mirror.rotation.x = -Math.PI / 2
mirror.position.y = -1.07
mirror.material.transparent = true
mirror.material.opacity = 0.2
scene.add(mirror)

scene.add(new THREE.AmbientLight(0xffffff, 0.18))

const lavenderLight = new THREE.PointLight(0xc1b5eb, 1.4, 14)
lavenderLight.position.set(0, 2.8, 1.5)
scene.add(lavenderLight)

const cobaltLight = new THREE.PointLight(0x1847ff, 0.9, 12)
cobaltLight.position.set(-2.5, 0.8, 1.6)
scene.add(cobaltLight)

const orangeLight = new THREE.PointLight(0xff991c, 0.65, 10)
orangeLight.position.set(2.3, 0.4, 1.2)
scene.add(orangeLight)

const camera = new THREE.PerspectiveCamera(68, 1, 0.1, 80)
camera.position.set(0, 0.16, 0)
camera.rotation.x = -0.085
scene.add(camera)

let currentScreen = 0
let targetRotation = 0
let currentFov = 68
let targetFov = 68

const labels = ['Building', 'Castle', 'House', 'Sky']
const screenLabel = document.querySelector('[data-screen-label]')

function updateScreenLabel() {
  if (screenLabel) {
    screenLabel.textContent = labels[currentScreen]
  }
}

function showScreen(next) {
  currentScreen = (next + labels.length) % labels.length
  targetRotation = currentScreen * (Math.PI / 2)
  targetFov = 68
  updateScreenLabel()
}

function zoom(delta) {
  targetFov = THREE.MathUtils.clamp(targetFov + delta, 38, 68)
}

document.querySelector('[data-prev-screen]')?.addEventListener('click', () => {
  showScreen(currentScreen - 1)
})

document.querySelector('[data-next-screen]')?.addEventListener('click', () => {
  showScreen(currentScreen + 1)
})

document.querySelector('[data-zoom-in]')?.addEventListener('click', () => {
  zoom(-4)
})

document.querySelector('[data-zoom-out]')?.addEventListener('click', () => {
  zoom(4)
})

canvas.addEventListener(
  'wheel',
  (event) => {
    event.preventDefault()
    zoom(Math.sign(event.deltaY) * 2)
  },
  { passive: false }
)

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance',
})
renderer.outputEncoding = THREE.sRGBEncoding

function resize() {
  const width = Math.max(container.clientWidth, 1)
  const height = Math.max(container.clientHeight, 1)

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height, false)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

window.addEventListener('resize', resize)
resize()
updateScreenLabel()

function tick() {
  theatre.rotation.y +=
    (targetRotation - theatre.rotation.y) * 0.075

  currentFov +=
    (targetFov - currentFov) * 0.1

  camera.fov = currentFov
  camera.updateProjectionMatrix()

  if (!prefersReducedMotion) {
    lavenderLight.intensity =
      1.25 + Math.sin(performance.now() * 0.0007) * 0.1
  }

  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

tick()
