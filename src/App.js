import * as THREE from 'three'
import {MathUtils} from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import './App.css'


const gui = new dat.GUI()

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer()

const controls = new OrbitControls( camera, renderer.domElement );
const axesHelper = new THREE.AxesHelper()

const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
const mesh = new THREE.Mesh( geometry, material )

const textureLoader = new THREE.TextureLoader()

function animate(frame) {
    scene.rotation.y += 0.001

    scene.children.map((mesh, i)=>{
        if( mesh.geometry.type === 'TorusGeometry'){
          //  mesh.rotation.y += 0.03
            mesh.rotation.x += 0.03
        }
    })
    requestAnimationFrame( animate )
    renderer.render( scene, camera )
}

function init(){
    renderer.setSize( window.innerWidth, window.innerHeight )
    document.body.appendChild( renderer.domElement )
    renderer.setClearColor('#ffe100', 1)

    scene.add( controls )
    //scene.add( axesHelper )
    // scene.add( mesh )
    gui.hide()
    gui.add(mesh, 'visible')
    gui.add(material, 'wireframe')
    gui
        .add(mesh.position, 'y')
        .min(- 3)
        .max(3)
        .step(0.01)
        .name('elevation')

    const parameters = {
        color: 0xff0000,
        spin: () => gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })

    }
    gui
        .addColor(parameters, 'color')
        .onChange(() =>  renderer.setClearColor(parameters.color, 1)) // renderer.color.set(parameters.color))

    gui.add(parameters, 'spin')

    camera.position.z = 5

    /**
     * Fonts
     */
    const fontLoader = new THREE.FontLoader()

    fontLoader.load(
        process.env.PUBLIC_URL +'/fonts/helvetiker_regular.typeface.json',
        (font) =>
        {
            const textGeometry = new THREE.TextGeometry(
                'Stefany Carballo',
                {
                    font,
                    size: 0.5,
                    height: 0.2,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 5

                }
            )

            textGeometry.computeBoundingBox()
            textGeometry.center()

            const matcapTextureText = textureLoader.load(process.env.PUBLIC_URL +'/textures/matcaps/1.png')
            const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTextureText })


            const text = new THREE.Mesh(textGeometry, textMaterial)
            scene.add(text)


        }
    )

    //add donuts
    const donutGeometry = new THREE.TorusGeometry(0.2, 0.2, 20, 45)
    const matcapTextureDonut = textureLoader.load(process.env.PUBLIC_URL +'/textures/matcaps/7.png')
    const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTextureDonut })

    for(let i = 0; i < 50; i++){

        const donut = new THREE.Mesh(donutGeometry, donutMaterial)

        donut.position.x = (Math.random() - 0.5) * 10
        donut.position.y = (Math.random() - 0.5) * 10
        donut.position.z = (Math.random() - 0.5) * 10

        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI

        const scale = Math.random()
        donut.scale.set(scale, scale, scale)
        const radiansPerSecond = MathUtils.degToRad(30);
        donut.tick = (delta) => {
            // increase the cube's rotation each frame
            donut.rotation.z += radiansPerSecond * delta;
            donut.rotation.x += radiansPerSecond * delta;
            donut.rotation.y += radiansPerSecond * delta;
        };

        scene.add(donut)
    }


    //add sferes
    const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 16)
    const matcapTextureSphere  = textureLoader.load(process.env.PUBLIC_URL +'/textures/matcaps/8.png')
    const sphereMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTextureSphere })

    for(let i = 0; i < 50; i++){

        const sphere  = new THREE.Mesh(sphereGeometry, sphereMaterial)

        sphere.position.x = (Math.random() - 0.5) * 10
        sphere.position.y = (Math.random() - 0.5) * 10
        sphere.position.z = (Math.random() - 0.5) * 10

        sphere.rotation.x = Math.random() * Math.PI
        sphere.rotation.y = Math.random() * Math.PI

        const scale = Math.random()
        sphere.scale.set(scale, scale, scale)

        scene.add(sphere)
    }
console.log('*****', scene)
    animate()
}



function App() {

    return(
        <div>{init()}</div>
    )
}

export default App
