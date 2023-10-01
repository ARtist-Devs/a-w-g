import { Injectable } from '@angular/core';

import { BufferGeometryLoader, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace, Scene, TextureLoader, Vector2 } from 'three';

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
    // this.floorTextureDefuse = 
  }

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

  loadModel (ops: { path: string, scene: Scene; bump?: any, diffuse?: any, emission?: any, glossiness?: any, metalness?: any, normal?: any, onLoadCB: Function, onLoadProgress: Function; }) {


    const floorMapRepeat = new Vector2(20, 15);
    this.gltfLoader.load(
      ops.path,
      (gltf) => {
        // console.log('GLTF ', gltf);
        const model = gltf.scene;
        model.position.z = -0;
        model.scale.set(3, 3, 3);
        model.traverse((obj) => {
          let material = this.materialsService.getMeshPhysicalMaterial();
          // new MeshPhysicalMaterial({
          //   clearcoat: 1.0,
          //   clearcoatRoughness: 0.1,
          //   metalness: 0.9,
          //   roughness: 0.5,
          //   color: 0x004a54,
          //   normalScale: new Vector2(0.15, 0.15)
          // });//this.materialsService.getRandomColoredMaterial();#54001b bordo, teal: #004a54
          // @ts-ignore
          if (obj.isMesh)
          {
            console.log("Mesh is ", obj.name, obj);
            if (obj.name == 'Floor')
            {
              // @ts-ignore
              material = this.createFloor();

            }
            // @ts-ignore
            obj.material = material;

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

          // @ts-ignore
          // this.debugService.addToDebug({ obj: obj.material, key: 'clearcoat', min: 0, max: 1 });
          // @ts-ignore
          // this.debugService.addToDebug({ obj: material, key: 'clearcoatRoughness', min: 0, max: 1, precision: 0.1 });
          // // @ts-ignore
          // this.debugService.addToDebug({ obj: material, key: 'metalness', min: 0, max: 1, precision: 0.1 });
          // // @ts-ignore
          // this.debugService.addToDebug({ obj: material, key: 'roughness', min: 0, max: 1, precision: 0.1 });
        });
        const floor = model.children[0];

        // @ts-ignore
        // const floorMaterial = floor.material;
        // floorMaterial.map.repeat = floorMapRepeat;
        // floorMaterial.normalMap.repeat = floorMapRepeat;

        // const windowsGroup = model.children[1];
        // windowsGroup.castShadow = true;
        ops.scene.add(model);
        // console.log("After model loaded ", Date.now());
        ops.onLoadCB();
      },
      (xhr) => { ops.onLoadProgress(xhr); },
      (err) => {
        console.error('Error loading model');

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
