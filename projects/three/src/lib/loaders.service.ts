import { Injectable } from '@angular/core';

import { BufferGeometryLoader, Mesh, MeshBasicMaterial, Object3D, Scene, TextureLoader, Vector2 } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { DebugService } from './debug.service';

@Injectable({
  providedIn: 'root'
})
export class LoadersService {
  private gltfLoader = new GLTFLoader();
  private bufferLoader: BufferGeometryLoader = new BufferGeometryLoader();
  private textureLoader: TextureLoader = new TextureLoader();
  private dracoLoader = new DRACOLoader();
  constructor(
    private debugService: DebugService,
  ) {
    this.dracoLoader.setDecoderConfig({ type: 'js' });
    this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    this.dracoLoader.preload();
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
  }

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

  loadModel (ops: { path: string, scene: Scene; bump?: any, diffuse?: any, emission?: any, glossiness?: any, metalness?: any, normal?: any, onLoadCB: Function; }) {
    const material = new MeshBasicMaterial();

    const floorMapRepeat = new Vector2(15, 15);
    this.gltfLoader.load(
      ops.path,
      (gltf) => {
        console.log('GLTF ', gltf);
        const model = gltf.scene;
        model.position.z = -0;
        model.scale.set(3, 3, 3);
        model.traverse((obj) => {
          // @ts-ignore
          if (obj.isMesh)
          {

            obj.castShadow = true;
            obj.receiveShadow = true;
            obj.castShadow = true;
            obj.receiveShadow = true;
            // @ts-ignore
            if (obj.material.map) obj.material.map.anisotropy = 16;
          }
          // @ts-ignore
          if (obj.isLight)
          {
            // @ts-ignore
            obj.visible = visible;

          }
        });
        const floor = model.children[0];

        // @ts-ignore
        const floorMaterial = floor.material;
        floorMaterial.map.repeat = floorMapRepeat;
        floorMaterial.normalMap.repeat = floorMapRepeat;

        const windowsGroup = model.children[1];
        windowsGroup.castShadow = true;

        ops.scene.add(model);
        console.log("After model loaded ", Date.now());
        ops.onLoadCB();
      }
    );
  }

  createScene (geometry: any, scale: number, material: any) {

    const mesh = new Mesh(geometry, material);

    mesh.position.y = - 0.5;
    mesh.scale.set(scale, scale, scale);

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;

  }

  loadTexture (path: string) {
    return this.textureLoader.load(path);
  }
}
