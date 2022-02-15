import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Reflector } from 'three/examples/jsm/objects/Reflector'
import * as dat from 'dat.gui'
import { vertexShader, fragmentShader } from './shaders'
import gsap from 'gsap'
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
// dynamic texture material
let video1 = document.querySelector('#video1');
video1.play();
video1.defaultPlaybackRate = 0.01;

let video2 = document.querySelector('#video2');
video2.play();
video2.defaultPlaybackRate = 0.01;

let video3 = document.querySelector('#video3');
video3.play();
video3.defaultPlaybackRate = 0.01;

const vidArray = [new THREE.VideoTexture(video1), new THREE.VideoTexture(video2), new THREE.VideoTexture(video3)];

//static mesh
// const dynamicMesh = new THREE.Mesh(
//     new THREE.PlaneBufferGeometry(2, 2, 64, 64),
//     new THREE.MeshBasicMaterial({
//         map: vidTexture,
//         color: 0xffffff,
//     })
// )

// dynamicMesh.position.set(0, 0, 0);
// dynamicMesh.rotation.set(0, 0, 0);
// scene.add(dynamicMesh);

let vidTexture = vid => {
    // console.log('typeOf of vid:', typeof vid);
    // console.log('typeOf of vid === "number:"', typeof vid === 'number');
    return (typeof vid === 'number') ? vidArray[vid] : (new THREE.TextureLoader().load('/building.jpeg'))
};

// Material
const material = vid => new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: { value: 0 },
        uTexture: { value: vidTexture(vid) },
    },
    transparent: true,
    depthTest: true,

})

//Meshes
const floorTexture = new THREE.TextureLoader().load('/floorTexture.jpg');
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(9, 9);

const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(15, 15, 64, 64),
    new THREE.MeshPhysicalMaterial(
        {
            roughness: 0.5,
            metalness: 0.5,
            color: 0xffffff,
            transparent: true,
            opacity: 0.9,
            depthTest: false,
            map: floorTexture,
        }
    )
)

const floorMirror = new Reflector(
    new THREE.PlaneBufferGeometry(15, 15, 64, 64),
    {
        color: 0xffffff,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        // opacity: 0.1,
        clipBias: 0.3,
        blending: THREE.AdditiveBlending,

    }
)

const cylinderPiece1 = new THREE.Mesh(
    // new THREE.TorusGeometry(1, 0.4, 16, 60),
    new THREE.CylinderBufferGeometry(2, 2, 1.3, 64, 1, true, 0, 2 * Math.PI / 4),
    material('/building.jpeg'),
)
const cylinderPiece2 = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(2, 2, 1.3, 64, 2, true, 0, 2 * Math.PI / 4),
    material(0),
)
const cylinderPiece3 = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(2, 2, 1.3, 64, 2, true, 0, 2 * Math.PI / 4),
    material(1),
)
const cylinderPiece4 = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(2, 2, 1.3, 64, 2, true, 0, 2 * Math.PI / 4),
    material(2),
)

const floorGroup = new THREE.Group();
floorGroup.add(floor, floorMirror);
scene.add(floorGroup)
floorGroup.position.set(0, -0.74, 0);
floorGroup.rotation.set(181.14, 0, 0)

cylinderPiece1.position.set(0, 0, 0);
cylinderPiece1.rotation.set(0, 0, 0);

cylinderPiece2.position.set(0, 0, 0);
cylinderPiece2.rotation.set(0, 2 * Math.PI / 2, 0);

cylinderPiece3.position.set(0, 0, 0);
cylinderPiece3.rotation.set(0, 2 * Math.PI / 4, 0);

cylinderPiece4.position.set(0, 0, 0);
cylinderPiece4.rotation.set(0, 2 * Math.PI / -4, 0);

const group = new THREE.Group();
group.add(cylinderPiece1, cylinderPiece2, cylinderPiece3, cylinderPiece4);
scene.add(group);
group.position.set(0, 0, 0);
group.rotation.set(6.78, 13.8, 0);

gui.add(group.position, ('x')).min(0).max(50);
gui.add(group.position, ('y')).min(0).max(50);
gui.add(group.position, ('z')).min(-50).max(50);

gui.add(group.rotation, ('x')).min(0).max(200);
gui.add(group.rotation, ('y')).min(0).max(200);

const guiFloor = gui.addFolder('floor');
guiFloor.add(floorGroup.position, 'x').min(-10).max(100);
guiFloor.add(floorGroup.position, 'y').min(-10).max(100);
guiFloor.add(floorGroup.position, 'z').min(-10).max(100);
guiFloor.add(floorGroup.rotation, ('x')).min(0).max(600);
guiFloor.add(floorGroup.rotation, ('y')).min(0).max(600);
// Lights

const pointLight = new THREE.PointLight(0xC1B5EB, 2, 20, 5)
pointLight.position.x = 0
pointLight.position.y = 5
pointLight.position.z = 3
scene.add(pointLight)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()


    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 1.5

scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))




/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)
    if ((newSection != currentSection) && (newSection === 0)) {
        currentSection = newSection
        // console.log('changed', currentSection)
        gsap.to(
            camera.position,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '0',
                y: '0',
                z: '1.5'
            }
        )
        gsap.to(
            group.rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                y: '13.2',
            }
        )
    } else if ((newSection != currentSection) && (newSection === 1)) {
        currentSection = newSection
        // console.log('changed', currentSection)
        gsap.to(
            camera.position,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '-1',
                y: '-0.5',
                z: '4'
            }
        )
        gsap.to(
            group.rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                y: '13.2',
            }
        )
    } else if ((newSection != currentSection) && (newSection === 2)) {
        currentSection = newSection
        // console.log('changed', currentSection)
        gsap.to(
            camera.position,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '0',
                y: '0',
                z: '1.5'
            }
        )
        gsap.to(
            group.rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                y: '16.2',
            }
        )
    } else if ((newSection != currentSection) && (newSection === 3)) {
        currentSection = newSection
        // console.log('changed', currentSection)
        gsap.to(
            camera.position,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '-1',
                y: '-0.5',
                z: '4'
            }
        )
        gsap.to(
            group.rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                y: '16.2',
            }
        )
    }
    console.log(newSection)
    console.log(scrollY)
})

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () => {

    const elapsedTime = clock.getElapsedTime()
    // group.rotation.y = 0.04 * elapsedTime;
    // Update objects
    // cylinder.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()