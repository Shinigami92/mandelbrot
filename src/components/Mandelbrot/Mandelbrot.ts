import * as THREE from 'three';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Mandelbrot extends Vue {
  private camera!: THREE.Camera;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private uniforms: any;

  private readonly speed: number = 0.99;
  private readonly timrRestart: number = 1.0;
  private readonly destinations: { x: number; y: number }[] = [];
  private destinationIndex: number = 0;

  public async beforeMount(): Promise<void> {
    await this.init();
    this.initDestinations();
    this.animate();
  }

  protected onWindowResize(): void {
    this.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
    //camera.aspect = window.innerWidth / window.innerHeight;
    //camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private async init(): Promise<void> {
    //camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -1, 1);
    //camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    //camera.position.z = 200;
    this.camera = new THREE.Camera();
    this.camera.position.z = 1;

    this.scene = new THREE.Scene();
    this.scene.add(this.camera);

    this.uniforms = {
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(window.innerWidth, window.innerHeight)
      },
      offset: { type: 'v2', value: new THREE.Vector2(-0.5, 0.0) },
      zoom: { type: 'f', value: 1.0 },
      //,maxiter: {type: 'i', value: 100}
      time: { type: 'f', value: 0.0 }
    };

    const mandelbrotMaterial: THREE.ShaderMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: await (await fetch('./shader/mandelbrot.vert')).text(),
      fragmentShader: await (await fetch('./shader/mandelbrot.frag')).text()
    });

    const plane: THREE.Mesh = new THREE.Mesh(
      //new THREE.PlaneGeometry(window.innerWidth, window.innerHeight),
      //new THREE.PlaneGeometry(10000, 10000),
      new THREE.PlaneBufferGeometry(2.0, 2.0),
      //new THREE.MeshBasicMaterial({color: 0xFF0000, side: THREE.DoubleSide})
      mandelbrotMaterial
    );
    this.scene.add(plane);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);
    window.addEventListener('resize', this.onWindowResize, false);
  }

  private initDestinations(): void {
    this.destinations.push({ x: -0.7463, y: 0.1102 });
    this.destinations.push({ x: -0.745428, y: 0.113009 });
    this.destinations.push({ x: -0.16, y: 1.0405 });
    this.destinations.push({ x: -0.7453, y: 0.1127 });
    this.destinations.push({ x: -0.925, y: 0.266 });
    this.destinationIndex = Math.floor(Math.random() * this.destinations.length);
  }

  private animate(): void {
    requestAnimationFrame(this.animate);
    this.uniforms.time.value += 0.001;
    if (this.uniforms.time.value > this.timrRestart) {
      this.uniforms.time.value = 0.0;
      this.uniforms.offset.value.x = -0.5;
      this.uniforms.offset.value.y = 0.0;
      this.uniforms.zoom.value = 1.0;
      //		destinationIndex = (destinationIndex + 1) % destinations.length;
      this.destinationIndex = Math.floor(Math.random() * this.destinations.length);
    }
    this.uniforms.offset.value.x = this.lerp(
      this.destinations[this.destinationIndex].x,
      this.uniforms.offset.value.x,
      this.speed
    );
    this.uniforms.offset.value.y = this.lerp(
      this.destinations[this.destinationIndex].y,
      this.uniforms.offset.value.y,
      this.speed
    );
    this.uniforms.zoom.value = this.lerp(0.0, this.uniforms.zoom.value, this.speed);
    this.renderer.render(this.scene, this.camera);
  }

  private lerp(left: number, right: number, amount: number): number {
    return left + amount * (right - left);
  }
}
