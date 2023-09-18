import { Injectable, NgZone, computed, signal } from '@angular/core';

import { ACESFilmicToneMapping, Camera, CineonToneMapping, Clock, Color, CustomToneMapping, DirectionalLight, Fog, HemisphereLight, LinearToneMapping, NoToneMapping, Object3D, PCFSoftShadowMap, Raycaster, ReinhardToneMapping, Scene, ShaderChunk, Vector2, WebGLRenderer, SpotLight } from 'three';
// WebGPU
// @ts-ignore
// import WebGPU from 'three/examples/jsm/capabilities/WebGPU.js';
// @ts-ignore
import WebGPURenderer from 'three/examples/jsm/renderers/webgpu/WebGPURenderer.js';
import { HDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader.js';
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture.js';


import { sceneDefaults } from './scene.config';
import { CameraService } from './camera.service';
import { ControllerService } from './controller.service';
import { InteractionsService } from './interactions.service';
import { WebXRService } from './webxr.service';
import { LightsService } from './lights.service';
import { ObjectsService } from './objects.service';
import { DebugService } from './debug.service';

@Injectable({
  providedIn: 'root',

})
export class SceneService {

  public camera: Camera;
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
  constructor(
    private cameraService: CameraService,
    private controllerService: ControllerService,
    private ngZone: NgZone,
    private interactionService: InteractionsService,
    private lightsService: LightsService,
    private objectsService: ObjectsService,
    private webXRService: WebXRService,
    private debug: DebugService,

  ) { }

  initScene (canvas: HTMLCanvasElement, options?: any) {
    const ops = Object.assign({}, sceneDefaults, options);

    // Camera
    ops.camera.width = this.width;
    ops.camera.height = this.height;
    this.camera = this.cameraService.createCamera(ops.camera);
    // TODO: z:20
    this.dolly = this.cameraService.addDolly();
    this.scene.add(this.dolly);

    // Scene
    this.scene.background = ops.background || new Color('skyblue');
    if (ops.fog)
    {
      this.scene.fog = new Fog(ops.fog.color, ops.fog.near, ops.fog.far);
    }


    // Renderer
    // TODO: Check out the performance for preserveDrawingBuffer
    this.renderer = new WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: true });
    // TODO: this.renderer = new WebGPURenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.5;

    ShaderChunk.tonemapping_pars_fragment = ShaderChunk.tonemapping_pars_fragment.replace(
      'vec3 CustomToneMapping( vec3 color ) { return color; }',
      `#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )
					float toneMappingWhitePoint = 1.0;
					vec3 CustomToneMapping( vec3 color ) {
						color *= toneMappingExposure;
						return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
					}`
    );
    this.scene.backgroundBlurriness = 0.3;

    this.rect = this.renderer.domElement.getBoundingClientRect();

    // GROUND
    // const ground = this.objectsService.createGround();
    // this.scene.add(ground);

    // Lights
    const hemLight = this.lightsService.createHemLight({ intensity: 0.5 });
    const dirLights = this.lightsService.createDirLight({ intensity: 1.2 });
    dirLights[0].castShadow = true;

    this.spotLights = this.lightsService.createSpotLight();
    this.spotlight = this.spotLights[0];
    this.spotlight.position.set(0, 7, 1.16);
    this.spotlight.target.position.set(0, 0, -4);
    this.spotlight = this.spotLights[0];

    const cameraLight: any = this.lightsService.createSpotLight();
    cameraLight[0].position.set(0, -2, 0.64);
    this.camera.add(cameraLight[0]);
    this.scene.add(...hemLight, ...this.spotLights, ...dirLights);//ambient, ...this.spotLights, ...hemLight, ...dirLights);//, ...hemLight, ...dirLights);


    const icoLight = this.objectsService.createIcosahedron({ radius: 0.3, detail: 0, material: 'MeshPhysicalMaterial' });
    icoLight.position.set(0, 1, -10);
    icoLight.material.opacity = 0.6;
    const pointLight = this.lightsService.createPointLight();
    pointLight.position.y = 2.2;

    icoLight.add(pointLight);
    this.icoLight = icoLight;


    this.scene.add(this.icoLight);

    this.debug.addToDebug({ obj: pointLight, name: 'pointLight', properties: { 'Position': {}, 'Rotation': {}, 'Intensity': {}, Color: {} } });
    this.debug.addToDebug({ obj: icoLight, name: 'icoLight', properties: { 'Position': {}, 'Rotation': {} } });
    this.debug.addToDebug({ obj: cameraLight[0], name: 'Camera Lights', properties: { 'Position': {}, 'Rotation': {}, 'Intensity': {}, Color: {} } });
    this.debug.addToDebug({ obj: hemLight[0], name: 'Hem Lights', properties: { 'Position': {}, 'Rotation': {}, 'Intensity': {}, Color: {} } });
    this.debug.addToDebug({ obj: dirLights[0], name: 'Dir Lights', properties: { 'Position': {}, 'Rotation': {}, 'Intensity': {}, Color: {} } });
    this.debug.addToDebug({ obj: this.spotLights[0], name: 'Spot Lights', properties: { 'Position': {}, 'Rotation': {}, 'Intensity': {}, Color: {} } });
    // - Lights



    // SKYDOME
    // const sky = this.objectsService.createSkyDom({ color: hemLight[0].color });
    // this.scene.add(sky);

    // Controls
    const controls = this.controllerService.createControls({ type: 'orbit', camera: this.camera, renderer: this.renderer, canvas: canvas });
    // this.controllerService.updateControls;
    // this.renderFunctions.push(this.controllerService.updateControls);

    this.debug.addToDebug({ obj: this.camera, name: 'Camera', properties: { 'Position': {} } });
    window.addEventListener("resize", this.onResize.bind(this));

    // TODO: Interactions Service Imp
    const interactionsUpdate = this.interactionService.initInteractionManager(this.renderer, this.camera, canvas);
    this.renderFunctions.push(interactionsUpdate);

    // WebXR
    this.webXRService.checkXRSupport({ renderer: this.renderer, camera: this.camera, scene: this.scene });

    // Render loop
    this.ngZone.runOutsideAngular(() => this.renderer.setAnimationLoop(() => this.render()));
    this.cameraService.moveCamera(0, 1.6, 0.001, 7);
    return this.afterSceneInit();
  }

  afterSceneInit (ops?: any) {
  }


  onTouchStart (e: TouchEvent) {

    this.pointer.x = ((e.touches[0].clientX - this.rect.left) / (this.rect.right - this.rect.left)) * 2 - 1;
    this.pointer.y = - ((e.touches[0].clientY - this.rect.top) / (this.rect.bottom - this.rect.top)) * 2 + 1;
    // this.interactions.intersectObjects({ pointer: this.pointer, camera: this.camera, scene: this.scene, select: true });

  }

  onPointerDown (e: PointerEvent) {
    // console.log('pointer down event ', e);
    this.pointer.x = ((e.clientX - this.rect.left) / (this.rect.right - this.rect.left)) * 2 - 1;
    this.pointer.y = - ((e.clientY - this.rect.top) / (this.rect.bottom - this.rect.top)) * 2 + 1;
    // this.interactions.intersectObjects({ pointer: this.pointer, camera: this.camera, scene: this.scene });

  }

  render () {
    const delta = this.clock.getDelta();
    this.icoLight.rotation.y += 0.01;
    // update controls
    this.controllerService.updateControls();

    // Lights
    // this.spotLight.position.set(
    //   this.camera.position.x + 10,
    //   this.camera.position.y + 10,
    //   this.camera.position.z + 10
    // );

    // update camera
    this.cameraService.updateCamera({ camera: this.camera, scene: this.scene });
    // this.interactionsManager.update();
    // run renderFunctions
    this.renderFunctions.forEach(func => func(delta));

    // render
    this.renderer.render(this.scene, this.camera);

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

  //TODO: check to see if you still need w,h args
  onResize (e: UIEvent, w?: any, h?: any) {
    console.log('Resizing ', e);
    w = w || window.innerWidth;
    h = h || window.innerHeight;

    // Set the camera's aspect ratio
    // @ts-ignore
    this.camera.aspect = w / h;
    // update the camera's frustum
    // @ts-ignore
    this.camera.updateProjectionMatrix();

    // update the size of the renderer & the canvas
    this.renderer.setSize(w, h);
    // set the pixel ratio (for mobile devices)
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  onDeviceChange (e: Event) { }
}
