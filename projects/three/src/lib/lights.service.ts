import { Injectable } from '@angular/core';
import { DirectionalLight, HemisphereLight, PointLight, SpotLight } from 'three';

@Injectable( {
  providedIn: 'platform'
} )
export class LightsService {
  private intensity = Math.PI;
  private dirLight = new DirectionalLight( 0xffffff, this.intensity );
  // color : Integer, intensity : Float, distance : Float, angle : Radians, penumbra : Float, decay : Float
  private spotLight = new SpotLight( 0xffffff, 30, 30, this.intensity / 4, 0.5 );

  constructor() { }

  createSpotLight ( ops?: any ) {
    const sLight = this.spotLight.clone();
    // sLight.castShadow = true;
    // sLight.shadow.bias = -0.001;
    // sLight.shadow.mapSize.width = 512;
    // sLight.shadow.mapSize.height = 512;
    // sLight.shadow.camera.near = 0.1;
    // sLight.shadow.camera.far = 100;
    // sLight.shadow.camera.fov = 30;
    return [sLight];
  }

  createHemLight ( ops?: any ) {

    const hemLight = new HemisphereLight( 0xf6a96a, 0x9fc3f9, 0.8 );
    hemLight.color.setHSL( 0.6, 1, 0.6 );
    hemLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemLight.position.set( -0.6, -2, -6 );


    return [hemLight];
  }

  createPointLight () {
    // Color, intensity, distance, decay
    const l = new PointLight( 0xffffff, Math.PI, 13, 1 );
    // l.castShadow = true;
    // l.shadow.bias = - 0.005;
    return l;
  }

  createDirLight ( ops?: any ): any[] {
    const intensity = ops?.intensity || this.intensity;
    const dirLight = new DirectionalLight( 0xffffff, intensity );
    dirLight.castShadow = true;
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.color.convertLinearToSRGB();
    dirLight.position.set( -0, 12, -15 );
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 512;
    dirLight.shadow.mapSize.height = 512;

    const d = 50;

    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;

    dirLight.shadow.camera.far = 100;
    dirLight.shadow.bias = - 0.0001;

    dirLight.target.position.set( 0, 0, -2 );
    return [dirLight, dirLight.target];

  }

}
