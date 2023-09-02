import { Injectable } from '@angular/core';
import { Raycaster, Matrix4, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  private raycaster = new Raycaster();
  private tempMatrix = new Matrix4();
  intersectedObject: any
  private controls: any;
  private controllers: any;
  workingMatrix = new Matrix4();
  workingVector = new Vector3();
  origin = new Vector3();
  userData = {
    selectPressed: false
  };
  renderer: any;
  constructor() { }

  /**
   * TODO: Add hand controls and controllers
   * @param ops 
   * @returns 
   */
  createControls(ops?: any) {
    this.renderer = ops.renderer;

    if (ops.type === 'orbit') {
      return this.createOrbitControls(ops);
    }
    if (ops.xrMode === 'immersive-vr') {
      this.createControllers()
    }
  }

  createOrbitControls(ops: any) {
    // Controls
    this.controls = new OrbitControls(ops.camera, ops.canvas)
    this.controls.target.set(0, 1.6, 0);
    this.controls.enableDamping = true;
    this.controls.update();
    return this.controls;
  }

  createControllers() {

  }


  // TODO: fix the function arguments
  handleControllers(controller?: any, dt?: any) {
    if (this.controllers?.userData.selectPressed) {
      console.log('Select Pressed ');
    }
  }
  updateControls() {
    if (this.renderer.xr.isPresenting) this.handleControllers();
    return this.controls.update.bind(this);
  }

  /**
   * TODO: Add hand controls and controllers
   * Assumes userData.selectPressed, not implemented yet
   */
  get selectPressed() {
    return (this.controllers !== undefined && this.controllers[0].userData.selectPressed || this.controllers[1].userData.selectPressed)
  }

  // Controller Events
  // TODO:intersection service is intersecting on pointer move
  getControllerIntersections(controller: any, objects: any) {
    // console.log('getIntersections controller ', controller);
    controller.updateMatrixWorld();

    this.tempMatrix.identity().extractRotation(controller.matrixWorld);

    this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    this.raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(this.tempMatrix);

    return this.raycaster.intersectObjects(objects, false);//obj, recursive

  }

  // Touch Events
  onPinchEndLeft(e: Event) {
    console.log('Pinch end Left ', e);
  }
  onPinchEndRight(e: Event) {
    console.log('Pinch end Right ', e);
  }
  onPinchStartLeft(e: Event) {
    console.log('Pinch start Left ', e);
  }
  onPinchStartRight(e: Event) {
    console.log('Pinch start Right ', e);
  }

  onSelectStart(e: Event) {
    console.log('SelectStart controller service  ', e);

    this.userData.selectPressed = true;
  }

  onSelectEnd(e: Event) {
    console.log('SelectEnd controller service  ', e);
    this.userData.selectPressed = false;
  }
}
