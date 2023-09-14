import { Injectable } from '@angular/core';
import { DirectionalLight, DirectionalLightHelper, HemisphereLight, HemisphereLightHelper, Vector3 } from 'three';

@Injectable({
  providedIn: 'root'
})
export class LightsService {

  constructor() { }

  createHemLight () {
    const hemiLight = new HemisphereLight(0xffffff, 0xffffff, 2);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(-15, -15, -0);


    const hemiLightHelper = new HemisphereLightHelper(hemiLight, 10);
    return [hemiLight, hemiLightHelper];
  }

  createDirLight () {
    const dirLight = new DirectionalLight(0xffffff, 3);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.color.convertLinearToSRGB();
    dirLight.position.set(-10, 20, -10);
    // dirLight.position.multiplyScalar(30);

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    const d = 50;

    // dirLight.shadow.camera.left = - d;
    // dirLight.shadow.camera.right = d;
    // dirLight.shadow.camera.top = d;
    // dirLight.shadow.camera.bottom = - d;

    dirLight.shadow.camera.far = 100;
    // dirLight.shadow.bias = - 0.0001;

    const dirLightHelper = new DirectionalLightHelper(dirLight, 10);
    return [dirLight, dirLightHelper];


  }


}
