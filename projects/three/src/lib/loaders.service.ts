import { Injectable, WritableSignal, signal } from '@angular/core';

import { LoadingManager, Material, Mesh, MeshStandardMaterial, Object3D, RepeatWrapping, SRGBColorSpace, Scene, TextureLoader, Vector2 } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { DebugService } from './debug.service';
import { MaterialsService } from './materials.service';

@Injectable( {
  providedIn: 'root'
} )
export class LoadersService {
  public loadingProgress: WritableSignal<number> = signal( 0 );
  private loadingManager = new LoadingManager();
  private gltfLoader = new GLTFLoader( this.loadingManager );
  private textureLoader: TextureLoader = new TextureLoader( this.loadingManager );
  private dracoLoader = new DRACOLoader( this.loadingManager );
  floorTexture: any;


  constructor(
    private debugService: DebugService,
    private materialsService: MaterialsService ) {
    this.loadingManager.onStart = ( url: string, itemsLoaded: number, itemsTotal: number ) => {
      this.onStart( url, itemsLoaded, itemsTotal );
    };
    this.loadingManager.onProgress = ( url: string, itemsLoaded: number, itemsTotal: number ) => {
      // console.log( `Loading file: ${url}.\nLoaded ${itemsLoaded} of ${itemsTotal} files.` );
      this.loadingProgress.set( itemsLoaded * 100 / itemsTotal );
    };

    this.loadingManager.onLoad = () => {

      console.log( 'Loading complete!' );
      this.loadingProgress.set( 100 );

    };

    this.loadingManager.onError = ( url: string ) => {
      console.error( 'There was an error loading ' + url );
    };
    this.dracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/' );
    this.dracoLoader.setDecoderConfig( { type: 'js' } );
    this.dracoLoader.preload();
    this.gltfLoader.setDRACOLoader( this.dracoLoader );
  }

  loadModel ( ops: { path: string, scene: Scene; bump?: any, diffuse?: any, emission?: any, glossiness?: any, metalness?: any, normal?: any, onLoadCB: Function, onLoadProgress: Function; } ) {


    const floorMapRepeat = new Vector2( 20, 15 );
    this.gltfLoader.load(
      ops.path,
      ( gltf ) => {
        let meshesCount = 0;
        // console.log( 'Mesh Count: ', gltf.meshes?.length );

        const model = gltf.scene;
        // console.log( 'Material Count: ', model );
        model.position.z = -0;
        model.scale.set( 3, 3, 3 ); // TODO: scale on blender
        let material: Material = this.materialsService.getMeshPhysicalMaterial();
        model.traverse( ( obj: Object3D ) => {

          // @ts-ignore
          if ( obj.isMesh ) {
            meshesCount += 1;
            if ( obj.name == 'Floor' ) {
              material = this.createFloor();
            }

            // @ts-ignore
            obj.material = material;

            obj.castShadow = true;
            obj.receiveShadow = true;
            obj.castShadow = true;
            obj.receiveShadow = true;

            // @ts-ignore
            if ( obj.material.map ) { obj.material.map.anisotropy = 16; }
          }

          // @ts-ignore
          // this.debugService.addToDebug({ obj: obj.material, key: 'clearcoat', min: 0, max: 1 });
          // @ts-ignore
          // this.debugService.addToDebug({ obj: material, key: 'clearcoatRoughness', min: 0, max: 1, precision: 0.1 });
          // // @ts-ignore
          // this.debugService.addToDebug({ obj: material, key: 'metalness', min: 0, max: 1, precision: 0.1 });
          // // @ts-ignore
          // this.debugService.addToDebug({ obj: material, key: 'roughness', min: 0, max: 1, precision: 0.1 });
        } );

        ops.scene.add( model );
        ops.onLoadCB();
        // console.log( 'Meshes Count: ', meshesCount );
      },
      ( xhr: any ) => { ops.onLoadProgress( xhr ); },
      ( err ) => {
        console.error( 'Error loading model' );
      } );

  };

  createFloor () {
    const floorMat = new MeshStandardMaterial( {
      roughness: 0.8,
      color: 0xffffff,
      metalness: 0.2,
      bumpScale: 0.0005
    } );

    // Diffuse
    this.textureLoader.load( 'assets/textures/hardwood_diffuse.jpg', ( map ) => {
      map.wrapS = RepeatWrapping;
      map.wrapT = RepeatWrapping;
      map.anisotropy = 16;
      map.repeat.set( 10, 24 );
      map.colorSpace = SRGBColorSpace;
      floorMat.map = map;
      floorMat.needsUpdate = true;
    } );

    this.textureLoader.load( 'assets/textures/hardwood_bump.jpg', function ( map ) {

      map.wrapS = RepeatWrapping;
      map.wrapT = RepeatWrapping;
      map.anisotropy = 4;
      map.repeat.set( 10, 24 );
      floorMat.bumpMap = map;
      floorMat.needsUpdate = true;

    } );

    this.textureLoader.load( 'assets/textures/hardwood_roughness.jpg', function ( map ) {

      map.wrapS = RepeatWrapping;
      map.wrapT = RepeatWrapping;
      map.anisotropy = 4;
      map.repeat.set( 10, 24 );
      floorMat.roughnessMap = map;
      floorMat.needsUpdate = true;

    } );
    return floorMat;

  }

  loadTexture ( path: string ) {
    return this.textureLoader.load( path );
  }

  onStart ( url: string, item: any, total: any ) {
    // console.log( `Started loading file: ${url}. Now loading item ${item} of ${total}.` );
  }
}
