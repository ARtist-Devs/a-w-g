import { Injectable } from '@angular/core';
import { Matrix4, Raycaster, TOUCH, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DebugService } from './debug.service';

@Injectable({
  providedIn: 'platform'
})
export class ControllerService {

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
      this.createControllers();
    }

  }

  // TODO: Disable the orbit controllers on device change
  createOrbitControls (ops: any) {
    this.controls = new OrbitControls(ops.camera, ops.canvas);
    this.controls.target.set(0, 1.6, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.001;
    this.controls.panSpeed = 1;
    this.controls.rotateSpeed = 0.8;
    this.controls.minDistance = ops.minDistance || 0.1;
    this.controls.maxDistance = ops.maxDistance || 200;

    // Limit the vertical rotation
    this.controls.minPolarAngle = Math.PI / 2;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.screenSpacePanning = false;
    this.controls.zoomSpeed = 0.8;

    // Enable arrow keys
    this.controls.listenToKeyEvents(window);
    this.controls.keys = {
      LEFT: 'ArrowLeft', //left arrow
      UP: 'ArrowUp', // up arrow
      RIGHT: 'ArrowRight', // right arrow
      BOTTOM: 'ArrowDown' // down arrow
    };
    // { ROTATE: 0, PAN: 1, DOLLY_PAN: 2, DOLLY_ROTATE: 3 }
    this.controls.touches = {
      ONE: TOUCH.ROTATE,
      TWO: TOUCH.DOLLY_PAN
    };

    this.debug.addToDebug({
      obj: this.controls, name: 'Orbit Controls', properties: {
        'panSpeed': { min: 0, max: 1, precision: 0.001 },
        'rotateSpeed': { min: 0, max: 1, precision: 0.001 },
        'zoomSpeed': { min: 0, max: 1, precision: 0.001 }
      }
    });


    return this.controls;
  }

  createControllers () {
    // disposes the orbit controls in VR. 
    this.controls.dispose();

  }

  // TODO: fix the function arguments
  handleControllers (controller?: any, dt?: any) {
    if (this.controllers?.userData.selectPressed)
    {
      console.log('Select Pressed ');
    }
  }

  // TODO:
  updateControls () {
    // if (this.renderer.xr && this.renderer.xr?.isPresenting) { return this.handleControllers(); }
    // return this.controls.update();
  }

  /**
   * TODO: Add hand controls and controllers
   * Assumes userData.selectPressed, not implemented yet
   */
  get selectPressed () {
    return (this.controllers !== undefined && this.controllers[0].userData.selectPressed || this.controllers[1].userData.selectPressed);
  }

  // Controller Events
  // TODO:intersection service is intersecting on pointer move
  getControllerIntersections (controller: any, objects: any) {
    console.log('getIntersections controller ', controller);
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

  onSelectStart (e: Event) {
    console.log('SelectStart controller service  ', e);

    this.userData.selectPressed = true;
  }

  onSelectEnd (e: Event) {
    console.log('SelectEnd controller service  ', e);
    this.userData.selectPressed = false;
  }
}
