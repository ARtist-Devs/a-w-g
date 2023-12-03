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
    return l;
    
  }

}
