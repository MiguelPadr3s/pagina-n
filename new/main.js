import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff); //  Background color (customizable)
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(4, 5, 11); // Initial camera position

//  Orbit Controls (drag to rotate, pan, and zoom)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;          // Smooth motion
controls.dampingFactor = 0.05;
controls.enablePan = true;              // Allow panning
controls.enableZoom = true;             // Allow zooming
controls.minDistance = 0.1;
controls.maxDistance = 100;
controls.minPolarAngle = 0;             // Look from below
controls.maxPolarAngle = Math.PI;       // Look from above
controls.target.set(0, 1, 0);           // Center of the model
controls.update();

// Ground plane
const groundGeometry = new THREE.PlaneGeometry(20, 20);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.receiveShadow = false;
scene.add(groundMesh);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); //  Bright and even
scene.add(ambientLight);

// Light
const spotLight = new THREE.SpotLight(0xffffff, 10, 100, 0.4, 0.8);
spotLight.position.set(0, 25, 0);
//spotLight.castShadow = false;
scene.add(spotLight);
scene.add(spotLight.target);

// Load 3D model
const loader = new GLTFLoader().setPath('modelo/ganiete/');
loader.load('scene.gltf', (gltf) => {
  const mesh = gltf.scene;

  mesh.traverse((child) => {
    if (child.isMesh) {
      //child.castShadow = false;
      //child.receiveShadow = false;
    }
  });

  mesh.position.set(-3, 0.01, 4); // Adjust position if needed
  mesh.scale.set(0.01, 0.01, 0.01); // 🔧 Shrinks the model to 10% of its original size
  scene.add(mesh);
});

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update(); //  Keep controls in sync
  renderer.render(scene, camera);
}

animate();
