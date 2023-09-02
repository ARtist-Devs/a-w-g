import { Injectable } from '@angular/core';
import { Camera, Object3D, PerspectiveCamera } from 'three';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  public camera: Camera | undefined;
  public dummyCamera = new Object3D();
  public dolly = new Object3D();

  constructor() { }

  createCamera(ops?: any) {
    this.camera = new PerspectiveCamera(ops.fov, ops.width / ops.height, ops.near, ops.far);
    this.camera.position.set(ops.position.x, ops.position.y, ops.position.z);
    this.camera.rotation.set(0, 0, 0);
    this.camera.name = ops.name;

    return this.camera;
  }
}
