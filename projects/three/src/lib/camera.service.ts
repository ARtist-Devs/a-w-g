import { Injectable } from '@angular/core';
import { Camera, Object3D, PerspectiveCamera } from 'three';
import gsap from 'gsap';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  public camera: Camera | undefined;
  public dummyCamera = new Object3D();
  public dolly = new Object3D();

  constructor() { }

  createCamera (ops?: any) {
    this.camera = new PerspectiveCamera(ops.fov, ops.width / ops.height, ops.near, ops.far);
    this.camera.position.set(ops.position.x, ops.position.y, ops.position.z);
    this.camera.rotation.set(0, 0, 0);
    this.camera.name = ops.name;

    return this.camera;
  }

  // TODO: Dummy camera
  addDolly () {
    // @ts-ignore
    this.dolly.add(this.camera);
    this.camera?.add(this.dummyCamera);
    return this.dolly;
  }

  moveDolly (x: Number, y: Number, z: Number) { }

  moveCamera (x: Number, y: Number, z: Number) {
    // @ts-ignore
    gsap.to(this.camera.position, {
      // @ts-ignore
      x: x, y: y, z: z, duration: 3
    });
  }

  rotateCamera (x: Number, y: Number, z: Number) {
    gsap.to(this.camera.rotation, {
      // @ts-ignore
      x: x, y: y, z: z, duration: 3.2
    });
  }
}
