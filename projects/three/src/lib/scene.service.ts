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
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory';
import { WebXRService } from './webxr.service';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GPUStatsPanel } from 'three/examples/jsm/utils/GPUStatsPanel';
// import * as Stats from 'stats.js';
const stats = new Stats();
@Injectable( {
  providedIn: null,

} )
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
  icoLight2: any;
  canvas: HTMLCanvasElement;
  webXRManager: any;
  controller: any;
  onConnected: any;
  onDisconnected: any;
  controllerGrip: any;
  constructor(
    private cameraService: CameraService,
    private controllerService: ControllerService,
    private ngZone: NgZone,
    private interactionsService: InteractionsService,
    private lightsService: LightsService,
    private objectsService: ObjectsService,
    private debug: DebugService,
    private webXRService: WebXRService

  ) { }

  initScene ( canvas: HTMLCanvasElement, options?: any ) {

    const ops = options ? Object.assign( {}, sceneDefaults, options ) : sceneDefaults;
    this.canvas = canvas;

    // Camera
    ops.camera.width = this.width;
    ops.camera.height = this.height;
    this.camera = this.cameraService.createCamera( ops.camera );

    // Dolly to move the camera
    this.dolly = this.cameraService.addDolly();
    this.scene.add( this.dolly );

    // Scene
    this.scene.background = ops.background || new Color( 'skyblue' );
    if ( ops.fog ) {
      this.scene.fog = new Fog( ops.fog.color, ops.fog.near, ops.fog.far );
    }

    // Renderer 
    this.renderer = new WebGLRenderer( { canvas: canvas, antialias: true, powerPreference: "high-performance" } );

    // TODO: this.renderer = new WebGPURenderer();
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( this.width, this.height );
    this.renderer.shadowMap.enabled = true;

    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.5;
    this.renderer.xr.enabled = true;

    this.scene.backgroundBlurriness = 0.3;

    this.rect = this.renderer.domElement.getBoundingClientRect();

    // Lights
    const hemLight = this.lightsService.createHemLight( { intensity: 0.5 } );
    // const dirLights = this.lightsService.createDirLight({ intensity: 1.2 });

    this.spotLights = this.lightsService.createSpotLight();
    this.spotlight = this.spotLights[0];
    this.spotlight.position.set( 0, 7, 1.16 );
    this.spotlight.target.position.set( 0, 0, -4 );
    this.spotlight = this.spotLights[0];

    const cameraLight: any = this.lightsService.createSpotLight();
    cameraLight[0].position.set( 0, -2, 0.64 );
    this.camera.add( cameraLight[0] );

    this.debug.addToDebug( {
      obj: cameraLight[0], name: 'Camera Light', properties: {
        'Position': {},
        'intensity': { min: 0, max: 20, precision: 1 },
        'distance': { min: 0, max: 10, precision: 1 },
        'angle': { min: 0, max: Math.PI, precision: Math.PI / 36 },
        'penumbra': { min: 0, max: 1, precision: 0.01 },
        'decay': { min: 0, max: 10, precision: 1 },
      }
    } );
    this.scene.add( ...hemLight );

    // Controls
    const controls = this.controllerService.createControls( { type: 'orbit', camera: this.camera, renderer: this.renderer, canvas: canvas, scene: this.scene } );

    // Interactions
    const interactionsUpdate = this.interactionsService.initInteractionManager( this.renderer, this.camera, canvas );
    this.renderFunctions.push( interactionsUpdate );

    return this.afterSceneInit.bind( this );

  }

  afterSceneInit ( start?: any, ) {


    // Interactions
    this.interactionsManager = this.interactionsService.initInteractionManager( this.renderer, this.camera, this.canvas );

    // XR
    const xrButton = XRButton.createButton( this.renderer );
    xrButton.addEventListener( 'click', ( e ) => {
      console.log( 'clicked xrButton ', e );
    } );
    document.body.appendChild( xrButton );
    document.body.appendChild( stats.dom );

    const gpuPanel = new GPUStatsPanel( this.renderer.getContext() );
    stats.addPanel( gpuPanel );
    stats.showPanel( 0 );
    this.webXRService.checkXRSupport( { renderer: this.renderer, camera: this.camera, scene: this.scene } );

    // Lights
    this.createCornerLights();

    // Render loop
    this.ngZone.runOutsideAngular( () => this.renderer.setAnimationLoop( () => this.render() ) );
    // this.renderer.shadowMap.autoUpdate = false;

    // Animate camera
    this.cameraService.moveCamera( 0, 1.6, 0.001, 10 );
  }


  setupXR () {

    this.renderer.xr.enabled = true;

    // document.body.appendChild(XRButton.createButton(this.renderer));
    this.webXRManager = this.renderer.xr;
    console.log( 'this.webXRManager ', this.webXRManager );

    const self = this;

    this.controller = this.renderer.xr.getController( 0 );

    if ( this.controller ) {
      // this.dolly.add(this.controller);
      // this.controller.addEventListener('selectstart', this.onSelectStart);
      // this.controller.addEventListener('selectend', this.onSelectEnd);
      // this.controller.addEventListener('connected', this.onConnected.bind(this));
      // this.controller.addEventListener('disconnected', this.onDisconnected.bind(this));
      this.scene.add( this.controller );
    }

    const controllerModelFactory = new XRControllerModelFactory();

    this.controllerGrip = this.renderer.xr.getControllerGrip( 0 );
    this.controllerGrip.add( controllerModelFactory.createControllerModel( this.controllerGrip ) );
    this.scene.add( this.controllerGrip );
  }
  onSelectStart ( arg0: string, onSelectStart: any ) {
    throw new Error( 'Method not implemented.' );
  }
  onSelectEnd ( arg0: string, onSelectEnd: any ) {
    throw new Error( 'Method not implemented.' );
  }


  render () {
    let startTime = performance.now();
    stats.update();
    // time elapsed since last frame
    const delta = this.clock.getDelta();
    // console.log( 'delta ', delta );
    // update controls
    this.controllerService.updateControls( delta );

    // update camera
    this.cameraService.updateCamera( { camera: this.camera, scene: this.scene } );

    // run renderFunctions
    this.renderFunctions.forEach( func => func( delta ) );


    // render
    this.renderer.render( this.scene, this.camera );
    let endTime = performance.now();
    let time = endTime - startTime;
    // console.log( 'timePassed, delta ', time, delta );
    // console.log( 'Render Draw Calls ', this.renderer.info.render.calls );

  }

  addToScene ( obj: any ) {

    if ( obj instanceof Array ) {
      this.scene.add( ...obj );
    } else {
      this.scene.add( obj );
    }

  }

  createCornerLights () {

    const pointLight = this.lightsService.createPointLight();
    pointLight.position.y = 3.2;
    pointLight.position.z = -10;

    const pointLight1 = this.lightsService.createPointLight();
    pointLight1.position.set( 10, 3.2, 7.6 );

    const pointLight2 = this.lightsService.createPointLight();
    pointLight2.position.set( -10, 3.2, 7.6 );
    this.scene.add( pointLight, pointLight1, pointLight2 );

  }

  onTouchStart ( e: TouchEvent ) {

    this.pointer.x = ( ( e.touches[0].clientX - this.rect.left ) / ( this.rect.right - this.rect.left ) ) * 2 - 1;
    this.pointer.y = - ( ( e.touches[0].clientY - this.rect.top ) / ( this.rect.bottom - this.rect.top ) ) * 2 + 1;
    this.interactionsService.intersectObjects( { pointer: this.pointer, camera: this.camera, scene: this.scene, select: true } );

  }

  onPointerDown ( e: PointerEvent ) {

    this.pointer.x = ( ( e.clientX - this.rect.left ) / ( this.rect.right - this.rect.left ) ) * 2 - 1;
    this.pointer.y = - ( ( e.clientY - this.rect.top ) / ( this.rect.bottom - this.rect.top ) ) * 2 + 1;
    this.interactionsService.intersectObjects( { pointer: this.pointer, camera: this.camera, scene: this.scene } );

  }

  onResize ( e?: UIEvent, w?: any, h?: any ) {

    w = w || window.innerWidth;
    h = h || window.innerHeight;

    // Set the camera's aspect ratio
    this.camera.aspect = w / h;

    // update the camera's frustum
    this.camera.updateProjectionMatrix();

    // update the size of the renderer & the canvas
    this.renderer.setSize( w, h );

    // set the pixel ratio (for mobile devices)
    this.renderer.setPixelRatio( window.devicePixelRatio );
    console.log( "onResize ", e );

  }

  // TODO: change the controls
  onDeviceChange ( e: Event ) {
    console.log( "Device changed: ", e );
    this.onResize();
    // if(this.renderer.)
  }
}
