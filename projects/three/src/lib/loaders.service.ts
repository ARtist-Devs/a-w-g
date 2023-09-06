import { Injectable } from '@angular/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Injectable({
  providedIn: 'root'
})
export class LoadersService {
  private modelLoader = new GLTFLoader();
  constructor() { }

  loadModel (path: string) {
    this.modelLoader.load(path, (gltf) => {
      const gltfs = [gltf];
      const model = gltf.scene;
      return model;
    },
      // called while loading is progressing
      (xhr) => {
        // self.loadingBar.progress = (xhr.loaded / xhr.total) * 0.5;
        const progress = (xhr.loaded / xhr.total) * 0.5;
        console.log('Loading the model now ', xhr);
        console.log('Progress is ', progress);

      },
      (err) => {
        console.log('Cant load the model ', err);
      }
    );
  }
}
