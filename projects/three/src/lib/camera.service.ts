import { Injectable } from '@angular/core';
import { Camera, MathUtils, Object3D, PerspectiveCamera } from 'three';
import gsap from 'gsap';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  public camera: Camera | undefined;
  public dummyCamera = new Object3D();
  public dolly = new Object3D();
  theta = 0;
  radius = 5;

  constructor() { }

  createCamera (ops?: any) {
    this.camera = new PerspectiveCamera(ops.fov, ops.width / ops.height, ops.near, ops.far);
    this.camera.position.set(ops.position.x, ops.position.y, 20);
    this.camera.rotation.set(0, 0, 0);
    this.camera.name = ops.name;
    return this.camera;
  }

  // TODO: Dummy camera
  addDolly () {
    this.dolly.add(this.camera);
    this.camera?.add(this.dummyCamera);
    return this.dolly;
  }

  moveDolly (x: Number, y: Number, z: Number) { }

  moveCamera (x: Number, y: Number, z: Number, duration: Number) {
    // @ts-ignore
    gsap.to(this.camera.position, {
      // @ts-ignore
      x: x, y: y, z: z, duration: duration
    });
  }

  rotateCamera (x: Number, y: Number, z: Number) {
    gsap.to(this.camera.rotation, {
      // @ts-ignore
      x: x, y: y, z: z, duration: 3.2
    });
  }

  animateCamera (ops?: any) {
    this.theta += 0.1;
    ops.camera.position.x = this.radius * Math.sin(MathUtils.degToRad(this.theta));
    ops.camera.position.y = this.radius * Math.sin(MathUtils.degToRad(this.theta));
    ops.camera.position.z = this.radius * Math.cos(MathUtils.degToRad(this.theta));
    ops.camera.lookAt(ops.look);

  }

  updateCamera (ops?: any) {
    // this.animateCamera({ camera: ops.camera, scene: ops.scene });
    if (ops.look) ops.lookAt(ops.look);
    ops.camera.updateMatrixWorld();

  }
}
