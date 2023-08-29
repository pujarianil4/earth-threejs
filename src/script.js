import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

// texture loading
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
  console.log("texture start");
};

loadingManager.onProgress = () => {
  console.log("In Progress");
};

loadingManager.onLoad = () => {
  console.log("loaded");
};

loadingManager.onError = () => {
  console.log("error");
};

const textureloader = new THREE.TextureLoader(loadingManager);
// earth = https://i.postimg.cc/K8SkG6cm/earth.jpg

const texture = textureloader.load("https://i.postimg.cc/K8SkG6cm/earth.jpg");
const nighttexture = textureloader.load("./nightEarth.jpeg");
const bump = textureloader.load(
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthbump1k.jpg"
);
const specular = textureloader.load(
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthspec1k.jpg"
);
const atmosphereMap = textureloader.load(
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthcloudmap.jpg"
);
const atmosphereAlphaMap = textureloader.load(
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthcloudmaptrans.jpg"
);
const galaxyMap = textureloader.load(
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/starfield.png"
);
texture.magFilter = THREE.NearestFilter;
texture.minFilter = THREE.NearestFilter;

// Earth
const material = new THREE.MeshPhongMaterial({
  map: texture,
  bumpScale: 0.05,
  specular: new THREE.Color("gray"),
  shininess: 10
});
material.bumpMap = bump;
material.specularMap = specular;
material.lightMap = nighttexture

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 50, 50), material);
sphere.rotation.x = 0.3;
sphere.position.z = 1
scene.add(sphere);

// atmosphere
const atmosphereMaterial = new THREE.MeshPhongMaterial({
  map: atmosphereMap,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.5,
});
atmosphereMaterial.alphaMap = atmosphereAlphaMap;
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.503, 50, 50),
  atmosphereMaterial
);
atmosphere.position.z = 1
scene.add(atmosphere);

// Galaxy
let galaxyGeometry = new THREE.SphereGeometry(100, 32, 32);
let galaxyMaterial = new THREE.MeshBasicMaterial({
  side: THREE.BackSide,
  map: galaxyMap,
});
let galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
scene.add(galaxy);

// Lights
const ambientLight = new THREE.AmbientLight(0xfffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xfffffff, 0.5);

pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

// Camera
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

window.addEventListener("resize", () => {
  //update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //update renderer
  renderer.setSize(sizes.width, sizes.height);

  renderer.setPixelRatio(window.devicePixelRatio);
});

//renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (e) => {
  cursor.x = -(e.clientX / sizes.width - 0.5);
  cursor.y = e.clientY / sizes.height - 0.5;
});

renderer.setSize(sizes.width, sizes.height);

// Controls
const orbit = new OrbitControls(camera, canvas);
orbit.enableDamping = true;

// Animation
let time = new THREE.Clock();
const tick = () => {
  const elapseTime = time.getElapsedTime();
  orbit.update();
 
  sphere.rotation.y = elapseTime * 0.1 + Math.PI * 2;
  atmosphere.rotation.y = -(elapseTime * 0.03) + Math.PI * 2;
  camera.lookAt(sphere.position);
  camera.lookAt(atmosphere.position);
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
