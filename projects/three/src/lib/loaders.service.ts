import { Injectable } from '@angular/core';
import { Vector3, BufferGeometry, BufferGeometryLoader, MeshLambertMaterial, Mesh, Scene, MeshBasicMaterial, ACESFilmicToneMapping, CineonToneMapping, CustomToneMapping, LinearToneMapping, NoToneMapping, ReinhardToneMapping, TextureLoader, MeshPhongMaterial, SRGBColorSpace, Vector2 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DebugService } from './debug.service';
import { vec2 } from 'gl-matrix';

@Injectable({
  providedIn: 'root'
})
export class LoadersService {
  private gltfLoader = new GLTFLoader();
  private bufferLoader: BufferGeometryLoader = new BufferGeometryLoader();
  private textureLoader: TextureLoader = new TextureLoader();
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

  loadModel (ops: { path: string, scene: Scene; bump?: any, diffuse?: any, emission?: any, glossiness?: any, metalness?: any, normal?: any; }) {

    const normalMap = this.textureLoader.load('assets/models/Floor/Floor_Bake1_PBR_Normal.png');
    const bumpMap = this.textureLoader.load('assets/models/Floor/Floor_Bake1_PBR_Bump.png');
    const diffuseMap = this.textureLoader.load('assets/models/Floor/Floor_Bake1_PBR_Diffuse.png');
    diffuseMap.anisotropy = 4;
    diffuseMap.colorSpace = SRGBColorSpace;
    const ambientMap = this.textureLoader.load('assets/models/Floor/Floor_Bake1_PBR_Diffuse.png');
    const specularMap = this.textureLoader.load('assets/models/Floor/Floor_Bake1_PBR_Glossiness.png');
    specularMap.colorSpace = SRGBColorSpace;
    const emissiveMap = this.textureLoader.load('assets/models/Floor/Floor_Bake1_PBR_Emission.png');


    const material = new MeshBasicMaterial();
    //new MeshPhongMaterial({
    //   aoMap: ambientMap,
    //   normalMap: normalMap,
    //   map: diffuseMap,
    //   color: 0x9c6e49,
    //   specular: 0x666666,
    //   shininess: 25,
    //   bumpMap: bumpMap,
    //   bumpScale: 0.01,
    //   specularMap: specularMap,
    //   emissiveMap: emissiveMap,
    //   normalScale: new Vector2(0.8, 0.8)
    // });
    const floorMapRepeat = new Vector2(15, 15);
    this.gltfLoader.load(
      ops.path,
      (gltf) => {
        const model = gltf.scene;
        // @ts-ignore
        // const model = this.createScene(gltf.scene.children[0].geometry, 1, material);
        model.position.z = -0;
        console.log('OBJ ', model);
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
            // console.log('OBJ ', obj);
          }
        });
        const floor = model.children[0];

        // @ts-ignore
        const floorMaterial = floor.material;
        console.log("Floor material", floorMaterial);

        floorMaterial.map.repeat = floorMapRepeat;
        floorMaterial.normalMap.repeat = floorMapRepeat;
        // floorMaterial.color 
        ops.scene.add(model);
        // const windowsSettings = {
        //   castShadow: true,
        //   receiveShadow: false,
        // };

        const windowsGroup = model.children[1];
        windowsGroup.castShadow = true;
        // @ts-ignore
        console.log('GLTF model children windows ', windowsGroup);
        // this.debugService.addToDebug({ obj: model, name: 'model', properties: { 'Scale': {}, Position: {} } });
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
    // scene.add(mesh);

  }

  loadTexture (path: string) {
    return this.textureLoader.load(path);
  }
}
