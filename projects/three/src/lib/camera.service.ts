import { Injectable } from '@angular/core';

import { animate, easeInOut, easeOut } from 'popmotion';
import { Euler, MathUtils, Object3D, PerspectiveCamera, Vector3 } from 'three';

@Injectable( {
  providedIn: 'platform'
} )
export class CameraService {
  public camera: PerspectiveCamera | undefined;
  public dummyCamera = new Object3D();
  public dolly = new Object3D();
  theta = 0;
  radius = 5;

  constructor() { }

  createCamera ( ops?: any ) {
    this.camera = new PerspectiveCamera( ops.fov, ops.width / ops.height, ops.near, ops.far );
    this.camera.position.set( ops.position.x, ops.position.y, 24 );
    this.camera.rotation.set( 0, 0, 0 );
    this.camera.name = ops.name;
    return this.camera;
  }

  // TODO: Dummy camera
  addDolly () {
    this.dolly.add( this.camera );
    this.camera?.add( this.dummyCamera );
    return this.dolly;
  }

  // moveDolly ( x: number, y: number, z: number, duration: number ) { }

  moveCamera ( x: number, y: number, z: number, duration: number ) {

    const p = this.camera.position;
    animate( {
      from: p,
      to: new Vector3( x, y, z ),
      duration: duration * 1000,
      ease: easeOut,
      onUpdate: latest => {
        p.x = latest.x;
        p.y = latest.y;
        p.z = latest.z;
      }
    } );

  }

  rotateCamera ( x: number, y: number, z: number ) {

    const p = this.camera.rotation;
    animate( {
      from: p,
      to: new Euler( x, y, z ),
      duration: 3200,
      ease: easeInOut,
      onUpdate: latest => {
        p.x = latest.x;
        p.y = latest.y;
        p.z = latest.z;
      }
    } );

  }

  animateCamera ( ops?: any ) {
    this.theta += 0.1 * ops.delta;
    ops.camera.position.x = this.radius * Math.sin( MathUtils.degToRad( this.theta ) );
    ops.camera.position.y = this.radius * Math.sin( MathUtils.degToRad( this.theta ) );
    ops.camera.position.z = this.radius * Math.cos( MathUtils.degToRad( this.theta ) );
    ops.camera.lookAt( ops.look );

  }

  updateCamera ( ops?: any ) {
    // this.animateCamera({ camera: ops.camera, scene: ops.scene });
    // if ( ops.look ) ops.lookAt( ops.look );
    ops.camera.updateMatrixWorld();

  }
}
