import { Injectable } from '@angular/core';
import { Vector3, BufferGeometry, BufferGeometryLoader, MeshLambertMaterial, Mesh, Scene, MeshBasicMaterial } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DebugService } from './debug.service';

@Injectable({
  providedIn: 'root'
})
export class LoadersService {
  private modelLoader = new GLTFLoader();
  private bufferLoader: BufferGeometryLoader = new BufferGeometryLoader();
  constructor(
    private debugService: DebugService,
  ) { }

  loadBufferGeometry (scene: Scene, path: string, cb?: Function) {

    this.bufferLoader.load(
      // resource URL
      path,

      // onLoad callback
      function (geometry) {
        const material = new MeshBasicMaterial({ color: 0xF5F5F5 });
        const object = new Mesh(geometry, material);
        object.name = 'json model';

        scene.add(object);
        console.log("Model ", object);
        return object;
      },

      // onProgress callback
      function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },

      // onError callback
      function (err) {
        console.log('An error happened', err);
      }
    );
  }


  loadModel (path: string, scene: any) {
    const gltfLoader = new GLTFLoader();

    let model = null;
    gltfLoader.load(
      path,
      (gltf) => {
        model = gltf.scene;
        model.position.y = 0;
        model.scale.set(2, 2, 2);
        scene.add(model);
        this.debugService.addToDebug({ obj: model, name: 'model', properties: { 'Scale': {} } });
      }
    );

  }
}
