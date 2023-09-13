import { Injectable } from '@angular/core';
import { MeshBasicMaterial, MeshLambertMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshStandardMaterial } from 'three';

@Injectable({
  providedIn: 'root'
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

  constructor() { }

  getStandardMaterial () {
    return this.standardMaterial.clone();
  }

  getBasicMaterial () {
    return this.meshBasicMaterial;
  }

  getRandomColoredMaterial () {
    return new MeshBasicMaterial({ color: Math.random() * 0xffffff });
  }

}
