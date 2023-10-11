import { Injectable } from '@angular/core';
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Line, LineBasicMaterial, MOUSE, Matrix4, Mesh, MeshBasicMaterial, Raycaster, RingGeometry, TOUCH, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DebugService } from './debug.service';

@Injectable({
  providedIn: 'platform'
})
export class ControllerService {
  controller: any;
  controllerGrip: any;
  private raycaster = new Raycaster();
  private tempMatrix = new Matrix4();
  intersectedObject: any;
  private controls: any;
  private controllers: any;
  workingMatrix = new Matrix4();
  workingVector = new Vector3();
  origin = new Vector3();
  userData = {
    selectPressed: false
  };
  renderer: any;
  constructor(
    private debug: DebugService
  ) { }

  /**
   * TODO: Add hand controls and controllers. Push the update function to render functions
   * @param ops
   * @returns
   */
  createControls (ops: any) {
    this.renderer = ops.renderer;

    if (ops.type === 'orbit')
    {
      return this.createOrbitControls(ops);
    }
    if (ops.xrMode === 'immersive-vr')
    {
      this.buildControllers(ops);

    }
    this.buildControllers(ops);

  }

  buildControllers (ops: any) {
    this.controllers[0] = this.renderer.xr.getController(0);
    this.controllers[0].addEventListener('selectstart', this.onSelectStart);
    this.controllers[0].addEventListener('selectend', this.onSelectEnd);
    this.controllers[0].addEventListener('connected', (event: any) => {
      // @ts-ignore
      this.add(this.createController(event.data));
      console.log('event.data ', event.data, this);

    });
    this.controllers[0].addEventListener('disconnected', () => {
      // @ts-ignore
      this.remove(this.controllers[0]);

    });

    this.controllers[1] = this.renderer.xr.getController(1);
    this.controllers[1].addEventListener('selectstart', this.onSelectStart);
    this.controllers[1].addEventListener('selectend', this.onSelectEnd);
    this.controllers[1].addEventListener('connected', (event: any) => {
      // @ts-ignore
      this.add(this.createController(event.data));

    });

    this.controllers[1].addEventListener('disconnected', () => {

      ops.scene.remove(this.controllers[1]);

    });
  }




  // TODO: Disable the orbit controllers on device change

  // TODO: Disable the orbit controllers on device change
  createOrbitControls (ops: any) {
    this.controls = new OrbitControls(ops.camera, ops.canvas);
    this.controls.target.set(0, 1.6, 0);

    // Enable arrow keys
    this.controls.listenToKeyEvents(window);
    this.controls.keys = {
      LEFT: 'ArrowLeft', //left arrow
      UP: 'ArrowUp', // up arrow
      RIGHT: 'ArrowRight', // right arrow
      BOTTOM: 'ArrowDown' // down arrow
    };

    this.controls.mouseButtons = {
      LEFT: MOUSE.ROTATE,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.PAN
    };

    // { ROTATE: 0, PAN: 1, DOLLY_PAN: 2, DOLLY_ROTATE: 3 }
    this.controls.touches = {
      ONE: TOUCH.ROTATE,
      TWO: TOUCH.DOLLY_PAN
    };

    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;

    this.controls.screenSpacePanning = false;
    this.controls.panSpeed = 0.5;
    this.controls.rotateSpeed = 0.5;
    this.controls.keyPanSpeed = 40;

    this.controls.minDistance = ops.minDistance || -30;
    this.controls.maxDistance = ops.maxDistance || 50;

    this.controls.zoomSpeed = 0.5;
    this.controls.maxZoom = 30;
    this.controls.minZoom = -30;

    // Limit the vertical rotation
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.screenSpacePanning = false;

    this.debug.addToDebug({
      obj: this.controls, name: 'Orbit Controls', properties: {
        'panSpeed': { min: 0, max: 1, precision: 0.01 },
        'rotateSpeed': { min: 0, max: 1, precision: 0.01 },
        'zoomSpeed': { min: 0, max: 1, precision: 0.01 },
        'dampingFactor': { min: 0, max: 1, precision: 0.01 },
        'minDistance': { min: 0, max: 5, precision: 0.01 },
        'maxDistance': { min: 10, max: 500, precision: 1 },
        'keyPanSpeed': { min: 0, max: 100, precision: 1 },
      }
    });

    this.controls.addEventListener('change', (e: Event) => {
      // console.log('Controls Changed', e);
    });

    return this.controls;
  }

  createController (data: any) {
    let geometry, material;

    switch (data.targetRayMode)
    {

      case 'tracked-pointer':

        geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute([0, 0, 0, 0, 0, - 1], 3));
        geometry.setAttribute('color', new Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));

        material = new LineBasicMaterial({ vertexColors: true, blending: AdditiveBlending });

        return new Line(geometry, material);

      case 'gaze':

        geometry = new RingGeometry(0.02, 0.04, 32).translate(0, 0, - 1);
        material = new MeshBasicMaterial({ opacity: 0.5, transparent: true });
        return new Mesh(geometry, material);

      default:
        return console.log('default', data);

    }
    // TODO: disposes the orbit controls in VR?
    // this.controls.dispose();

  }

  // setupXR () {

  //   this.renderer.xr.enabled = true;

  //   // document.body.appendChild(XRButton.createButton(this.renderer));
  //   this.webXRManager = this.renderer.xr;
  //   // console.log('this.webXRManager ', this.webXRManager);

  //   const self = this;

  //   this.controller = this.renderer.xr.getController(0);

  //   if (this.controller)
  //   {
  //     this.dolly.add(this.controller);
  //     this.controller.addEventListener('selectstart', this.onSelectStart);
  //     this.controller.addEventListener('selectend', this.onSelectEnd);
  //     this.controller.addEventListener('connected', this.onConnected.bind(this));
  //     this.controller.addEventListener('disconnected', this.onDisconnected.bind(this));
  //     this.scene.add(this.controller);
  //   }

  //   const controllerModelFactory = new XRControllerModelFactory();

  //   this.controllerGrip = this.renderer.xr.getControllerGrip(0);
  //   this.controllerGrip.add(controllerModelFactory.createControllerModel(this.controllerGrip));
  //   this.scene.add(this.controllerGrip);
  // }

  // TODO: fix the function arguments
  handleControllers (controller?: any, dt?: any) {
    if (this.controllers?.userData.selectPressed)
    {
      console.log('Select Pressed ');
    }
  }


  // TODO:
  updateControls (delta: any) {
    if (this.renderer.xr && this.renderer.xr?.isPresenting)
    {
      this.controls.enabled = false;
      return this.handleControllers();
    }
    return this.controls.update(delta);
  }

  /**
   * TODO: Add hand controls and controllers
   * Assumes userData.selectPressed, not implemented yet
   */
  get selectPressed () {
    return (this.controllers !== undefined && this.controllers[0].userData.selectPressed || this.controllers[1].userData.selectPressed);
  }

  // Controller Events
  getControllerIntersections (controller: any, objects: any) {
    controller.updateMatrixWorld();

    this.tempMatrix.identity().extractRotation(controller.matrixWorld);

    this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    this.raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(this.tempMatrix);

    return this.raycaster.intersectObjects(objects, false);//obj, recursive

  }

  // Touch Events
  onPinchEndLeft (e: Event) {
    console.log('Pinch end Left ', e);
  }
  onPinchEndRight (e: Event) {
    console.log('Pinch end Right ', e);
  }
  onPinchStartLeft (e: Event) {
    console.log('Pinch start Left ', e);
  }
  onPinchStartRight (e: Event) {
    console.log('Pinch start Right ', e);
  }

  onConnected (e: any) {
    console.log('connected this, e ', this, e);
    if (e.target)
    {
      const mesh = this.createController.call(this, e.data);
      if (mesh) mesh.scale.z = 0;
      e.target.add(mesh);
    }
  }

  onDisconnected (e: any) {
    const controller = e.target;
    controller.remove(controller.children[0]);
    this.controller = undefined;
    this.controllerGrip = undefined;

  }

  onSessionStart (e: any) {
    console.log('onSessionStart ', e);
  }

  onSessionEnd (e: any) {
    console.log('onSessionEnd ', e);
  }

  onSelectStart (e: Event) {
    console.log('SelectStart controller service  ', e);

    this.userData.selectPressed = true;
  }

  onSelectEnd (e: Event) {
    console.log('SelectEnd controller service  ', e);
    this.userData.selectPressed = false;
  }
}
