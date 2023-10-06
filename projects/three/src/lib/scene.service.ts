import { Injectable, NgZone } from '@angular/core';

import { ACESFilmicToneMapping, Camera, CineonToneMapping, Clock, Color, CustomToneMapping, Fog, LinearToneMapping, NoToneMapping, Object3D, PCFSoftShadowMap, PerspectiveCamera, ReinhardToneMapping, Scene, SpotLight, Vector2, WebGLRenderer } from 'three';

import { CameraService } from './camera.service';
import { ControllerService } from './controller.service';
import { DebugService } from './debug.service';
import { InteractionsService } from './interactions.service';
import { LightsService } from './lights.service';
import { ObjectsService } from './objects.service';
import { sceneDefaults } from './scene.config';
import { XRButton } from 'three/examples/jsm/webxr/XRButton';

@Injectable({
  providedIn: null,

})
export class SceneService {

  public camera: PerspectiveCamera;
  public scene: Scene = new Scene();
  public renderFunctions: Function[] = [];
  public clock = new Clock();
  public renderer: WebGLRenderer;
  public interactionsManager: any;

  private width = window.innerWidth;
  private height = window.innerHeight;
  private rect: DOMRect;
  private pointer = new Vector2();
  private dolly: Object3D;

  private spotLights: any[];
  spotlight: SpotLight;
  toneMappingOptions = {
    None: NoToneMapping,
    Linear: LinearToneMapping,
    Reinhard: ReinhardToneMapping,
    Cineon: CineonToneMapping,
    ACESFilmic: ACESFilmicToneMapping,
    Custom: CustomToneMapping
  };
  params = {
    exposure: 1.0,
    toneMapping: 'ACESFilmic',
    blurriness: 0.3,
    intensity: 1.0,
  };
  icoLight: any;
  icoLight1: any;
  pointLight: any;
  icoLight2: any;
  canvas: HTMLCanvasElement;
  constructor(
    private cameraService: CameraService,
    private controllerService: ControllerService,
    private ngZone: NgZone,
    private interactionsService: InteractionsService,
    private lightsService: LightsService,
    private objectsService: ObjectsService,
    private debug: DebugService,

  ) { }

  initScene (canvas: HTMLCanvasElement, options?: any) {

    const ops = options ? Object.assign({}, sceneDefaults, options) : sceneDefaults;
    this.canvas = canvas;

    // Camera
    ops.camera.width = this.width;
    ops.camera.height = this.height;
    this.camera = this.cameraService.createCamera(ops.camera);

    this.dolly = this.cameraService.addDolly();
    this.scene.add(this.dolly);

    // Scene
    this.scene.background = ops.background || new Color('skyblue');
    if (ops.fog)
    {
      this.scene.fog = new Fog(ops.fog.color, ops.fog.near, ops.fog.far);
    }

    // Renderer powerPreference: "high-performance", preserveDrawingBuffer: true
    this.renderer = new WebGLRenderer({ canvas: canvas, antialias: true });

    // TODO: this.renderer = new WebGPURenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.5;
    this.renderer.xr.enabled = true;


    this.scene.backgroundBlurriness = 0.3;

    this.rect = this.renderer.domElement.getBoundingClientRect();

    // Lights
    const hemLight = this.lightsService.createHemLight({ intensity: 0.5 });
    // const dirLights = this.lightsService.createDirLight({ intensity: 1.2 });

    this.spotLights = this.lightsService.createSpotLight();
    this.spotlight = this.spotLights[0];
    this.spotlight.position.set(0, 7, 1.16);
    this.spotlight.target.position.set(0, 0, -4);
    this.spotlight = this.spotLights[0];

    const cameraLight: any = this.lightsService.createSpotLight();
    cameraLight[0].position.set(0, -2, 0.64);
    this.camera.add(cameraLight[0]);

    this.debug.addToDebug({
      obj: cameraLight[0], name: 'Camera Light', properties: {
        'Position': {},
        'intensity': { min: 0, max: 20, precision: 1 },
        'distance': { min: 0, max: 10, precision: 1 },
        'angle': { min: 0, max: Math.PI, precision: Math.PI / 36 },
        'penumbra': { min: 0, max: 1, precision: 0.01 },
        'decay': { min: 0, max: 10, precision: 1 },
      }
    });
    this.scene.add(...hemLight);

    const icoLight = this.objectsService.createIcosahedron({ radius: 0.3, detail: 0, material: 'MeshPhysicalMaterial' });
    icoLight.position.set(0, 1, -10);
    icoLight.material.opacity = 0.6;
    this.pointLight = this.lightsService.createPointLight();
    this.pointLight.position.y = 2.2;

    icoLight.add(this.pointLight);
    this.icoLight = icoLight;

    this.scene.add(this.icoLight);
    // --Lights

    // Controls
    const controls = this.controllerService.createControls({ type: 'orbit', camera: this.camera, renderer: this.renderer, canvas: canvas });

    // Interactions
    const interactionsUpdate = this.interactionsService.initInteractionManager(this.renderer, this.camera, canvas);
    this.renderFunctions.push(interactionsUpdate);
    document.body.appendChild(XRButton.createButton(this.renderer));

    // Render loop
    this.ngZone.runOutsideAngular(() => this.renderer.setAnimationLoop(() => this.render()));

    return this.afterSceneInit.bind(this);

  }

  afterSceneInit (ops?: any) {

    this.createCornerLights();
    this.cameraService.moveCamera(0, 1.6, 0.001, 8);
    this.interactionsManager = this.interactionsService.initInteractionManager(this.renderer, this.camera, this.canvas);
    window.addEventListener("resize", this.onResize.bind(this));
    window.addEventListener("touchstart", this.onTouchStart.bind(this));

  }


  render () {

    // time elapsed since last frame
    const delta = this.clock.getDelta();

    // update controls
    this.controllerService.updateControls(delta);

    // update camera
    this.cameraService.updateCamera({ camera: this.camera, scene: this.scene });

    // run renderFunctions
    this.renderFunctions.forEach(func => func(delta));

    // render
    this.renderer.render(this.scene, this.camera);

  }

  animateLights (delta: any) {

    this.icoLight.rotation.y += 0.01;
    this.icoLight1.rotation.y += 0.01;
    this.icoLight2.rotation.y += 0.01;

  }

  addToScene (obj: any) {

    if (obj instanceof Array)
    {
      this.scene.add(...obj);
    } else
    {
      this.scene.add(obj);
    }

  }

  createCornerLights () {

    this.icoLight1 = this.icoLight.clone();
    const spotlight = this.lightsService.createPointLight();
    this.icoLight1.add(spotlight);
    this.icoLight1.position.set(-10, 1, 7.6);

    this.icoLight2 = this.icoLight.clone();

    this.icoLight2.add(spotlight);
    this.icoLight2.position.set(10, 1, 7.6);

    this.scene.add(this.icoLight1, this.icoLight2);
    this.renderFunctions.push(this.animateLights.bind(this));

  }

  onTouchStart (e: TouchEvent) {

    this.pointer.x = ((e.touches[0].clientX - this.rect.left) / (this.rect.right - this.rect.left)) * 2 - 1;
    this.pointer.y = - ((e.touches[0].clientY - this.rect.top) / (this.rect.bottom - this.rect.top)) * 2 + 1;
    this.interactionsService.intersectObjects({ pointer: this.pointer, camera: this.camera, scene: this.scene, select: true });

  }

  onPointerDown (e: PointerEvent) {

    this.pointer.x = ((e.clientX - this.rect.left) / (this.rect.right - this.rect.left)) * 2 - 1;
    this.pointer.y = - ((e.clientY - this.rect.top) / (this.rect.bottom - this.rect.top)) * 2 + 1;
    this.interactionsService.intersectObjects({ pointer: this.pointer, camera: this.camera, scene: this.scene });

  }

  onResize (e?: UIEvent, w?: any, h?: any) {

    w = w || window.innerWidth;
    h = h || window.innerHeight;

    // Set the camera's aspect ratio
    this.camera.aspect = w / h;

    // update the camera's frustum
    this.camera.updateProjectionMatrix();

    // update the size of the renderer & the canvas
    this.renderer.setSize(w, h);

    // set the pixel ratio (for mobile devices)
    this.renderer.setPixelRatio(window.devicePixelRatio);

  }

  // TODO: change the controls
  onDeviceChange (e: Event) {
    console.log(
      "Device changed: ", e
    );
    this.onResize();
  }
}
