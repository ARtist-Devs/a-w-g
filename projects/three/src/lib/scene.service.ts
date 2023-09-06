import { Injectable, NgZone, computed, signal } from '@angular/core';

import { Camera, Clock, Color, DirectionalLight, Fog, HemisphereLight, Object3D, PCFSoftShadowMap, Raycaster, Scene, Vector2, WebGLRenderer } from 'three';

import { sceneDefaults } from './scene.config';
import { CameraService } from './camera.service';
import { ControllerService } from './controller.service';
import { InteractionsService } from './interactions.service';

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
  // pos: Signal<Vector3> = computed(() =>
  //   this.frames?.[this.selectedIndex()]?.position.clone() || this.look
  // );

  constructor(
    private cameraService: CameraService,
    private controllerService: ControllerService,
    private ngZone: NgZone,
    private interactionService: InteractionsService
  ) { }

  initScene (canvas: HTMLCanvasElement, options?: any) {
    const ops = Object.assign({}, sceneDefaults, options);

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

    // Lights
    // TODO move to service
    const directionalLight = new DirectionalLight(ops.color, ops.intensity);
    this.scene.add(directionalLight);

    // Renderer
    this.renderer = new WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: true });// TODO: Check out the performance for preserveDrawingBuffer
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.rect = this.renderer.domElement.getBoundingClientRect();

    // Lights
    const ambient = new HemisphereLight(0xFFFFFF, 0xAAAAAA, 0.8);
    this.scene.add(ambient);

    // Controls
    const controls = this.controllerService.createControls({ type: 'orbit', camera: this.camera, renderer: this.renderer, canvas: canvas });

    // Interaction Manager
    // this.interactionsManager = new interactionsManager(this.renderer, this.camera, canvas);

    // TODO: Interactions Service Imp
    const interactionsUpdate = this.interactionService.initInteractionManager(this.renderer, this.camera, canvas);
    this.renderFunctions.push(interactionsUpdate);


    // Render loop
    this.ngZone.runOutsideAngular(() => this.renderer.setAnimationLoop(() => this.render()));
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

    // update controls
    this.controllerService.updateControls();

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
