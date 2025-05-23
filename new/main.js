import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(150, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 5, 11);
camera.lookAt(0, 0, 0);

const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
scene.add(groundMesh);

// color de luz, intensidad, la distancia que la luz brilla, las ultmas 2 son las esquinas a donde la luz llega
const spotLight = new THREE.SpotLight(0xffffff, 3, 100, 0.2, 0.5);
spotLight.position.set(0, 25, 0);
scene.add(spotLight);

const loader = new GLTFLoader().setPath('modelo/millennium_falcon/');
loader.load('scene.gltf', (gltf) => {
    const mesh = gltf.scene;
    mesh.position.set(0,1.05, -1);
    scene.add(mesh);
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();