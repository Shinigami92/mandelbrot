var camera, scene, renderer;
var uniforms;

var speed = 0.99;
var timrRestart = 1.0;
var destinations = [];
var destinationIndex = 0;

var initDestinations = function() {
  destinations.push({ x: -0.7463, y: 0.1102 });
  destinations.push({ x: -0.745428, y: 0.113009 });
  destinations.push({ x: -0.16, y: 1.0405 });
  destinations.push({ x: -0.7453, y: 0.1127 });
  destinations.push({ x: -0.925, y: 0.266 });
  destinationIndex = Math.floor(Math.random() * destinations.length);
};

var onWindowResize = function() {
  uniforms.resolution.value = new THREE.Vector2(
    window.innerWidth,
    window.innerHeight
  );
  //camera.aspect = window.innerWidth / window.innerHeight;
  //camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

var init = function() {
  //camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -1, 1);
  //camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  //camera.position.z = 200;
  camera = new THREE.Camera();
  camera.position.z = 1;

  scene = new THREE.Scene();
  scene.add(camera);

  //console.log(mandelbrotVertexShaderText);
  //console.log(mandelbrotFragmentShaderText);

  uniforms = {
    resolution: {
      type: "v2",
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    },
    offset: { type: "v2", value: new THREE.Vector2(-0.5, 0.0) },
    zoom: { type: "f", value: 1.0 },
    //,maxiter: {type: 'i', value: 100}
    time: { type: "f", value: 0.0 }
  };

  var mandelbrotMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: mandelbrotVertexShaderText,
    fragmentShader: mandelbrotFragmentShaderText
  });

  var plane = new THREE.Mesh(
    //new THREE.PlaneGeometry(window.innerWidth, window.innerHeight),
    //new THREE.PlaneGeometry(10000, 10000),
    new THREE.PlaneBufferGeometry(2.0, 2.0),
    //new THREE.MeshBasicMaterial({color: 0xFF0000, side: THREE.DoubleSide})
    mandelbrotMaterial
  );
  scene.add(plane);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize, false);
};

var animate = function() {
  requestAnimationFrame(animate);
  uniforms.time.value += 0.001;
  if (uniforms.time.value > timrRestart) {
    uniforms.time.value = 0.0;
    uniforms.offset.value.x = -0.5;
    uniforms.offset.value.y = 0.0;
    uniforms.zoom.value = 1.0;
    //		destinationIndex = (destinationIndex + 1) % destinations.length;
    destinationIndex = Math.floor(Math.random() * destinations.length);
  }
  uniforms.offset.value.x = lerp(
    destinations[destinationIndex].x,
    uniforms.offset.value.x,
    speed
  );
  uniforms.offset.value.y = lerp(
    destinations[destinationIndex].y,
    uniforms.offset.value.y,
    speed
  );
  uniforms.zoom.value = lerp(0.0, uniforms.zoom.value, speed);
  renderer.render(scene, camera);
};

var lerp = function(left, right, amount) {
  return left + amount * (right - left);
};

init();
initDestinations();
animate();
