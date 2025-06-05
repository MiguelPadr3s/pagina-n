import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff); // Background color (customizable)
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(4, 5, 11); // Initial camera position

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = true;
controls.enableZoom = true;
controls.minDistance = 0.1;
controls.maxDistance = 100;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI;
controls.target.set(0, 1, 0);
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

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 10, 100, 0.4, 0.8);
spotLight.position.set(0, 25, 0);
scene.add(spotLight);
scene.add(spotLight.target);

// === MULTIPLE ANNOTATIONS SETUP ===

// Array of annotation data
const annotations = [
  {
    label: 'Gabinete norte',
    description: 'Gabinete principal que contiene los elementos críticos del sistema.',
    position: new THREE.Vector3(-2, 0.8, 2.5)
  },
  {
    label: 'Tablero de alarmas',
    description: 'Aqui se presenta cualquien alarma involucrada con los gabinetes',
    position: new THREE.Vector3(3, 0.7, 1.8)
  },
  {
    label: 'Gabinete Sur',
    description: 'Gabinete principal que contiene los elementos críticos del sistema.',
    position: new THREE.Vector3(-2, 0.8, 1)
  }
];

// Create a container div for all annotations
const annotationContainer = document.createElement('div');
annotationContainer.className = 'annotation-container';
document.body.appendChild(annotationContainer);

// Create HTML elements for each annotation
annotations.forEach(ann => {
  const wrapper = document.createElement('div');
  wrapper.className = 'annotation-wrapper';

  const badge = document.createElement('div');
  badge.className = 'annotation-badge';
  badge.textContent = ann.label;
  wrapper.appendChild(badge);

  const box = document.createElement('div');
  box.className = 'annotation-box';
  box.textContent = ann.description;
  box.style.display = 'none';
  wrapper.appendChild(box);

  badge.addEventListener('click', () => {
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
  });

  annotationContainer.appendChild(wrapper);

  // Save reference to wrapper for positioning later
  ann.element = wrapper;
});

// Function to update position of all annotations based on camera view
function updateAnnotationsPosition() {
  annotations.forEach(ann => {
    const pos = ann.position.clone().project(camera);
    const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-pos.y * 0.5 + 0.5) * window.innerHeight;
    
    ann.element.style.left = `${x}px`;
    ann.element.style.top = `${y}px`;

    // Optional: Hide annotation if behind camera
    ann.element.style.display = (pos.z < 1) ? 'block' : 'none';
  });
}

// Load 3D model
const loader = new GLTFLoader().setPath('modelo/ganiete/');
loader.load('scene.gltf', (gltf) => {
  const mesh = gltf.scene;
  mesh.position.set(-3, 0.01, 4);
  mesh.scale.set(0.01, 0.01, 0.01);
  scene.add(mesh);
});

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate loop
function animate() {
  requestAnimationFrame(animate);
  updateAnnotationsPosition();
  controls.update();
  renderer.render(scene, camera);
}

animate();
