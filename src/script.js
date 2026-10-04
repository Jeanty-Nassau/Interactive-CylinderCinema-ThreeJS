import './style.css'
import * as THREE from 'three'
import { Reflector } from 'three/examples/jsm/objects/Reflector'

const canvas = document.querySelector('canvas.webgl')
const container = document.querySelector('#canvasContainer')
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x05070b)

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance',
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 80)
camera.position.set(0, 0.15, 0.35)
scene.add(camera)

const theatre = new THREE.Group()
scene.add(theatre)

const videos = [
  document.querySelector('#video1'),
  document.querySelector('#video2'),
  document.querySelector('#video3'),
]

videos.forEach((video) => {
  video.muted = true
  video.loop = true
  video.playsInline = true
  video.play().catch(() => {})
})

const textureLoader = new THREE.TextureLoader()
const stillTexture = textureLoader.load('/building.jpeg')
stillTexture.encoding = THREE.sRGBEncoding

const videoTextures = videos.map((video) => {
  const texture = new THREE.VideoTexture(video)
  texture.encoding = THREE.sRGBEncoding
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
})

const screenTextures = [
  videoTextures[0],
  videoTextures[1],
  videoTextures[2],
  stillTexture,
]

const radius = 4.15
const screenHeight = 2.45
const screenArc = Math.PI / 2 - 0.06

screenTextures.forEach((texture, index) => {
  const panel = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(
      radius,
      radius,
      screenHeight,
      96,
      1,
      true,
      index * (Math.PI / 2),
      screenArc
    ),
    new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      toneMapped: false,
    })
  )

  theatre.add(panel)
})

const floorTexture = textureLoader.load('/floorTexture.jpg')
floorTexture.wrapS = THREE.RepeatWrapping
floorTexture.wrapT = THREE.RepeatWrapping
floorTexture.repeat.set(8, 8)
floorTexture.encoding = THREE.sRGBEncoding

const floor = new THREE.Mesh(
  new THREE.CircleBufferGeometry(4.0, 96),
  new THREE.MeshStandardMaterial({
    map: floorTexture,
    roughness: 0.58,
    metalness: 0.15,
    color: 0x7b7f8c,
  })
)
floor.rotation.x = -Math.PI / 2
floor.position.y = -screenHeight / 2
scene.add(floor)

const reflector = new Reflector(
  new THREE.CircleBufferGeometry(3.95, 96),
  {
    color: 0x283044,
    textureWidth: Math.min(window.innerWidth * window.devicePixelRatio, 1600),
    textureHeight: Math.min(window.innerHeight * window.devicePixelRatio, 1600),
    clipBias: 0.003,
  }
)
reflector.rotation.x = -Math.PI / 2
reflector.position.y = -screenHeight / 2 + 0.012
reflector.material.transparent = true
reflector.material.opacity = 0.22
scene.add(reflector)

scene.add(new THREE.AmbientLight(0xffffff, 0.18))

const blueLight = new THREE.PointLight(0x1847ff, 2.2, 12)
blueLight.position.set(-1.7, 1.8, 0)
scene.add(blueLight)

const orangeLight = new THREE.PointLight(0xff991c, 1.3, 10)
orangeLight.position.set(1.8, 1.1, 0.5)
scene.add(orangeLight)

let targetYaw = 0
let currentYaw = 0
let targetPitch = 0
let currentPitch = 0
let dragging = false
let lastX = 0
let lastY = 0

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

canvas.addEventListener('pointerdown', (event) => {
  dragging = true
  lastX = event.clientX
  lastY = event.clientY
  canvas.setPointerCapture(event.pointerId)
})

canvas.addEventListener('pointermove', (event) => {
  if (!dragging) return

  const dx = event.clientX - lastX
  const dy = event.clientY - lastY
  lastX = event.clientX
  lastY = event.clientY

  targetYaw += dx * 0.006
  targetPitch = clamp(targetPitch + dy * 0.0035, -0.28, 0.28)
})

function stopDragging(event) {
  dragging = false
  if (event.pointerId !== undefined && canvas.hasPointerCapture(event.pointerId)) {
    canvas.releasePointerCapture(event.pointerId)
  }
}

canvas.addEventListener('pointerup', stopDragging)
canvas.addEventListener('pointercancel', stopDragging)

canvas.addEventListener(
  'wheel',
  (event) => {
    event.preventDefault()
    camera.fov = clamp(camera.fov + event.deltaY * 0.018, 42, 68)
    camera.updateProjectionMatrix()
  },
  { passive: false }
)

document.querySelector('[data-turn-left]')?.addEventListener('click', () => {
  targetYaw -= Math.PI / 2
})

document.querySelector('[data-turn-right]')?.addEventListener('click', () => {
  targetYaw += Math.PI / 2
})

document.querySelector('[data-reset-view]')?.addEventListener('click', () => {
  targetYaw = 0
  targetPitch = 0
  camera.fov = 52
  camera.updateProjectionMatrix()
})

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

function tick() {
  if (!prefersReducedMotion && !dragging) {
    targetYaw += 0.00045
  }

  currentYaw += (targetYaw - currentYaw) * 0.055
  currentPitch += (targetPitch - currentPitch) * 0.055

  theatre.rotation.y = currentYaw
  camera.rotation.x = currentPitch

  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

tick()
