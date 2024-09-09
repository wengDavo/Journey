import * as three from "three";
import { OrbitControls, TextGeometry } from "three/examples/jsm/Addons.js";
import { FontLoader } from "three/examples/jsm/Addons.js";

// canavs
const canvas = document.querySelector(".webgl");

// clock
const clock = new three.Clock();

// scene
const scene = new three.Scene();

// font loader
const fontLoader = new FontLoader();

// materials
const textureLoader = new three.TextureLoader();
const gradientTexture = textureLoader.load("textures/gradients/5.jpg");
const toonMaterial = new three.MeshToonMaterial({
  gradientMap: gradientTexture,
});
gradientTexture.minFilter = three.NearestFilter;
gradientTexture.magFilter = three.NearestFilter;
gradientTexture.generateMipmaps = false;

// fonts
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Weng Davo", {
    font: font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 20,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  textGeometry.center();
  const textMesh = new three.Mesh(textGeometry, toonMaterial);
  scene.add(textMesh);
});

const donutGeometry = new three.TorusGeometry(0.3, 0.2, 20, 45);
for (let i = 0; i < 500; i++) {
  const donut = new three.Mesh(donutGeometry, toonMaterial);
  donut.position.set(
    (Math.random() - 0.5) * 40,
    (Math.random() - 0.5) * 40,
    (Math.random() - 0.5) * 40
  );
  donut.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  const scaleRand = Math.random() * 1.5;
  donut.scale.set(scaleRand, scaleRand, scaleRand);
  scene.add(donut);
}

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// camera
const camera = new three.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 0, 6);
scene.add(camera);

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// lights
const ambientLight = new three.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
//
const pointLight = new three.PointLight(0xffffff, 80);
pointLight.position.set(0, 4, 4);
scene.add(pointLight);

// rendererer
const renderer = new three.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

// resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

// loop
function loop() {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}

loop();
