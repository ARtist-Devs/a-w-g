import { Injectable } from '@angular/core';
import { InteractionManager } from 'three.interactive';
import { SceneService } from './scene.service';
import { Camera, Matrix4, Object3D, Raycaster, Vector2, Vector3, WebGLRenderer } from 'three';
import { ColliderObjectModel, ColliderOptions } from './webxr.models';

@Injectable({
  providedIn: 'root'
})
export class InteractionsService {
  interactionManager: InteractionManager;
  intersected: any;
  colliders: any = {};
  ui: any = {};

  rect: any;
  pointer = new Vector2();
  colliderOptions: ColliderOptions = {
    name: 'object',
    mesh: null,
    cb: (e: Event) => { console.log('Collided ', e); }
  };
  selectedObject: any;
  intersectedObjects: any[] = [];

  raycasterOptions: any = {
    origin: new Vector3(0, 0, 0),
    direction: null,
    near: 0,
    far: 10
  };

  raycaster: Raycaster = new Raycaster();
  tempMatrix = new Matrix4();
  constructor() { }

  initInteractionManager (renderer: WebGLRenderer, camera: Camera, canvas: HTMLCanvasElement) {
    this.interactionManager = new InteractionManager(
      renderer,
      camera,
      canvas
    );

    return this.interactionManager.update.bind(this);
  }

  addToInteractions (mesh: Object3D) {
    this.interactionManager.add(mesh);
  }

  raycast () {
    const objsToTest = this.intersectedObjects;
    return objsToTest.reduce((closestIntersection: any, obj: any) => {

      const intersection = this.raycaster.intersectObject(obj, true);

      if (!intersection[0]) return closestIntersection;

      if (!closestIntersection || intersection[0].distance < closestIntersection.distance)
      {

        intersection[0].object = obj;

        return intersection[0];

      }

      return closestIntersection;

    }, null);

  }

  /**
 * TODO: Works only for UI now
 * @param ops 
 * @returns selected object
 */
  intersectObjects (ops: any) {

    // Find closest intersecting object

    let intersect: any;

    // TODO: set the raycaster when vr mode, not on select
    if (ops.pointer && ops.pointer.x !== null && ops.pointer.y !== null)
    {
      this.raycaster.setFromCamera(ops.pointer, ops.camera);

      // intersect = this.raycast();

    } else
    {
      console.log('setting the ray from controller');
      this.tempMatrix.identity().extractRotation(ops.controller.matrixWorld);

      this.raycaster.ray.origin.setFromMatrixPosition(ops.controller.matrixWorld);
      this.raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(this.tempMatrix);

    }

    intersect = this.raycast();

    if (intersect && intersect.object.isUI)
    {
      console.log('intersected UI', intersect.object.name);

      if (this.ui.selectState)
      {

        // Component.setState internally call component.set with the options you defined in component.setupState
        intersect.object.setState('selected');

      } else
      {
        // Component.setState internally call component.set with the options you defined in component.setupState
        intersect.object.setState('hovered');

      }

    }

    // Update non-targeted buttons state
    this.intersectedObjects.forEach((obj: any) => {
      console.log('intersected obj ', obj);
      let isIdle = (!intersect || obj !== intersect.object);// && obj.isUI;
      let other = this.colliders[obj['uuid']] && ops.select;
      // console.log('intersected obj, idle, other ', obj, isIdle, other);
      if (isIdle)
      {
        // console.log('Setting Idle state on ', obj.name);
        if (obj.isUI) obj.setState('idle');

      } else if (this.colliders[obj['uuid']] && ops.select)
      {
        console.log('selected and have callback', obj, this.colliders[obj['uuid']]());
        return this.colliders[obj['uuid']]();
      }
    });
  }

  removeFromColliders (name: string) {
    this.colliders = this.colliders.filter((obj: ColliderObjectModel) => {
      return obj.name !== name;
    });
  }

  setRay (ops: any) {
    this.raycaster.setFromCamera(ops.pointer, ops.camera);
  }

  addToColliders (ops: any) {
    this.intersectedObjects.push(ops.mesh);
    const obj = Object.assign({}, this.colliderOptions, ops);
    this.colliders[ops.mesh.uuid] = ops.cb;

    console.log('obj added to the colliders ', obj, this.colliders);
  }

  update () {
    this.interactionManager.update();
  }
}
