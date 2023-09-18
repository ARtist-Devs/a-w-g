import { Injectable } from '@angular/core';
import { DirectionalLight, DirectionalLightHelper, HemisphereLight, HemisphereLightHelper, PointLight, SpotLight, SpotLightHelper, Vector3 } from 'three';

@Injectable({
  providedIn: 'root'
})
export class LightsService {
  dirLight = new DirectionalLight(0xfdc577, 4);
  // color : Integer, intensity : Float, distance : Float, angle : Radians, penumbra : Float, decay : Float
  spotLight = new SpotLight(0xffe29e, 15, 10, Math.PI / 4, 0.2, 1.5);

  constructor() { }

  createSpotLight (ops?: any) {
    const sLight = this.spotLight.clone();
    sLight.castShadow = true;
    sLight.shadow.bias = -0.0001;
    sLight.shadow.mapSize.width = 1024 * 4;
    sLight.shadow.mapSize.height = 1024 * 4;
    sLight.shadow.camera.near = 0.1;
    sLight.shadow.camera.far = 100;
    const sLightHelper = new SpotLightHelper(sLight);
    return [sLight];
    // sLightHelper
  }

  createHemLight (ops?: any) {

    const hemLight = new HemisphereLight(0xf6a96a, 0x9fc3f9, 0.8);
    hemLight.color.setHSL(0.6, 1, 0.6);
    hemLight.groundColor.setHSL(0.095, 1, 0.75);
    hemLight.position.set(-0.6, -2, -6);


    const hemLightHelper = new HemisphereLightHelper(hemLight, 1);
    return [hemLight, hemLightHelper];
  }

  createPointLight () {
    // Color, intensity, distance, decay
    const l = new PointLight(0xb3e2ff, 1.5, 13, 0);
    l.castShadow = true;
    l.shadow.bias = - 0.005;
    return l;
  }

  createDirLight (ops?: any) {
    const intensity = ops?.intensity || 2;
    const dirLight = new DirectionalLight(0xffffff, intensity);
    dirLight.castShadow = true;
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.color.convertLinearToSRGB();
    dirLight.position.set(-0, 12, -15); // dirLight.position.multiplyScalar(30); dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    const d = 50;

    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;

    dirLight.shadow.camera.far = 100;
    dirLight.shadow.bias = - 0.0001;

    dirLight.target.position.set(0, 0, -2);
    if (ops && ops.helper)
    {
      const dirLightHelper = new DirectionalLightHelper(dirLight, 10);
      return [dirLight, dirLight.target, dirLightHelper];
    }

    return [dirLight];

  }

}
