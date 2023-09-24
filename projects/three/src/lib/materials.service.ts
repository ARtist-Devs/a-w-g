import { Injectable } from '@angular/core';
import { Material, MeshBasicMaterial, MeshLambertMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshPhysicalMaterialParameters, MeshStandardMaterial } from 'three';

@Injectable({
  providedIn: 'platform'
})
export class MaterialsService {

  //Materials
  private meshBasicMaterial = new MeshBasicMaterial();
  private normalMaterial = new MeshNormalMaterial();
  private meshLambert = new MeshLambertMaterial();
  private standardMaterial = new MeshStandardMaterial({
    roughness: 0.05,
    metalness: 1,
  });
  materials = {
    // TODO: delete or add reflectionCube
    // 'shiny': new MeshStandardMaterial({ color: 0x9c0000, envMap: reflectionCube, roughness: 0.1, metalness: 1.0 }),
    // 'chrome': new MeshLambertMaterial({ color: 0xffffff, envMap: reflectionCube }),
    // 'liquid': new MeshLambertMaterial({ color: 0xffffff, envMap: refractionCube, refractionRatio: 0.85 }),
    'matte': new MeshPhongMaterial({ specular: 0x494949, shininess: 1 }),
    'flat': new MeshLambertMaterial({ /*TODO flatShading: true */ }),
    // 'textured': new MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, shininess: 1, map: texture }),
    'colors': new MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, shininess: 2, vertexColors: true }),
    'multiColors': new MeshPhongMaterial({ shininess: 2, vertexColors: true }),
    'plastic': new MeshPhongMaterial({ specular: 0xc1c1c1, shininess: 250 }),

  };

  params: MeshPhysicalMaterialParameters = {
    color: 0xffffff,
    transmission: 1,
    opacity: 1,
    metalness: 0,
    roughness: 0,
    ior: 1.5,
    thickness: 0.01,
    // attenuationColor: 0xffffff,
    attenuationDistance: 1,
    specularIntensity: 1,
    // specularColor: 0xffffff,
    envMapIntensity: 1,
    // lightIntensity: 1,
    // exposure: 1
  };

  constructor() { }

  getMaterial (ops: string): any {
    if (ops = 'MeshPhysicalMaterial')
    {
      const material = new MeshPhysicalMaterial(this.params);
      return material;

    } else if ('StandardMaterial')
    {
      return this.getStandardMaterial();
    }
  }

  getStandardMaterial () {
    return this.standardMaterial.clone();
  }

  getMeshPhysicalMaterial (ops?: any) {

  }

  getMaterialByName (name: string): Material {
    // @ts-ignore
    return this.materials[name];
  }

  getBasicMaterial () {
    return this.standardMaterial;
  };

  getRandomColoredMaterial () {
    return new MeshStandardMaterial({ color: Math.random() * 0xffffff });
  }

}
