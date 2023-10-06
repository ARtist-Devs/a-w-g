import { Injectable } from '@angular/core';

import { BufferGeometryLoader, Light, Material, Mesh, MeshStandardMaterial, Object3D, RepeatWrapping, SRGBColorSpace, Scene, TextureLoader, Vector2 } from 'three';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { DebugService } from './debug.service';
import { MaterialsService } from './materials.service';

@Injectable({
  providedIn: 'root'
})
export class LoadersService {
  private gltfLoader = new GLTFLoader();
  private bufferLoader: BufferGeometryLoader = new BufferGeometryLoader();
  private textureLoader: TextureLoader = new TextureLoader();
  private dracoLoader = new DRACOLoader();
  floorTexture: any;

  constructor(
    private debugService: DebugService,
    private materialsService: MaterialsService
  ) {
    this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    this.dracoLoader.setDecoderConfig({ type: 'js' });
    this.dracoLoader.preload();
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
  }

  loadModel (ops: { path: string, scene: Scene; bump?: any, diffuse?: any, emission?: any, glossiness?: any, metalness?: any, normal?: any, onLoadCB: Function, onLoadProgress: Function; }) {


    const floorMapRepeat = new Vector2(20, 15);
    this.gltfLoader.load(
      ops.path,
      (gltf) => {

        // console.log('GLTF ', gltf);
        const model = gltf.scene;
        model.position.z = -0;
        model.scale.set(3, 3, 3); // TODO: scale on blender
        let material: Material = this.materialsService.getMeshPhysicalMaterial();
        model.traverse((obj: Object3D) => {

          // @ts-ignore
          if (obj.isMesh)
          {
            if (obj.name == 'Floor')
            {
              material = this.createFloor();
            }

            // @ts-ignore
            obj.material = material;

            obj.castShadow = true;
            obj.receiveShadow = true;
            obj.castShadow = true;
            obj.receiveShadow = true;
            // @ts-ignore
            if (obj.material.map) { obj.material.map.anisotropy = 16; }
          }
        });
        ops.scene.add(model);
        ops.onLoadCB();
      },
      (xhr: any) => { ops.onLoadProgress(xhr); },
      (err) => {
        console.error('Error loading model');
      });

  };

  createFloor () {
    const floorMat = new MeshStandardMaterial({
      roughness: 0.8,
      color: 0xffffff,
      metalness: 0.2,
      bumpScale: 0.0005
    });

    // Diffuse
    this.textureLoader.load('assets/textures/hardwood_diffuse.jpg', (map) => {
      map.wrapS = RepeatWrapping;
      map.wrapT = RepeatWrapping;
      map.anisotropy = 16;
      map.repeat.set(10, 24);
      map.colorSpace = SRGBColorSpace;
      floorMat.map = map;
      floorMat.needsUpdate = true;
    });

    this.textureLoader.load('assets/textures/hardwood_bump.jpg', function (map) {

      map.wrapS = RepeatWrapping;
      map.wrapT = RepeatWrapping;
      map.anisotropy = 4;
      map.repeat.set(10, 24);
      floorMat.bumpMap = map;
      floorMat.needsUpdate = true;

    });

    this.textureLoader.load('assets/textures/hardwood_roughness.jpg', function (map) {

      map.wrapS = RepeatWrapping;
      map.wrapT = RepeatWrapping;
      map.anisotropy = 4;
      map.repeat.set(10, 24);
      floorMat.roughnessMap = map;
      floorMat.needsUpdate = true;

    });
    return floorMat;

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
