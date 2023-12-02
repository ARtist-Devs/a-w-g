import { Injectable } from '@angular/core';

import gsap from 'gsap';
import { BoxGeometry, CylinderGeometry, Group, InstancedMesh, MathUtils, Matrix4, Mesh, MeshPhongMaterial, SRGBColorSpace, UVMapping, Vector3 } from 'three';

import { Artwork } from './artwork';
import { DebugService } from './debug.service';
import { InteractionsService } from './interactions.service';
import { LightsService } from './lights.service';
import { LoadersService } from './loaders.service';
import { MaterialsService } from './materials.service';
import { ObjectsService } from './objects.service';
import { UIService } from './ui.service';

@Injectable( {
  providedIn: 'platform'
} )
export class ArtworkFramesService {
  frameDistance = 7;
  angle = 0;
  frames: Group[] = [];
  focusPosition: any;
  locations: any[] = [];
  focusFactor = 4;
  // radiusTop: Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float
  frameGeometry: any = new CylinderGeometry( 0.8, 0.7, 0.1, 36, 5 );
  matrix = new Matrix4();
  frameMaterial = new MeshPhongMaterial( { color: 0xffffff } );
  framesGroup = new Group();
  artworksWithLocation: Artwork[];

  constructor(
    private objectsService: ObjectsService,
    private interactionsService: InteractionsService,
    private lightsService: LightsService,
    private loadersService: LoadersService,

    private materialsService: MaterialsService,
    private uiService: UIService,
    private debug: DebugService,

  ) { }

  createFrames ( artworks: Artwork[] = [], btns: any[] = [], cb?: Function ): Group {
    this.framesGroup.name = 'Frames Group';
    this.angle = ( Math.PI * 2 ) / artworks.length;
    this.frames = artworks.map( ( artwork, i ) => {
      const f = this.placeFrame( this.createFrame( artwork, btns, i ), i );
      return f;
    } );

    this.framesGroup.add( ...this.frames );

    this.framesGroup.position.set( 0, 1.6, 0 );
    this.focusFrame( 0 );
    return this.framesGroup;
  }

  /**
   * Distributes frames based on their index
   * @param frame artframe
   * @param i index
   * @returns frame with location
   */
  placeFrame ( frame: Group, i: number = 0 ) {
    const alpha = i * this.angle;
    const x = Math.sin( alpha ) * this.frameDistance;// 0 - 1
    const z = -Math.cos( alpha ) * this.frameDistance;// 0 - 0
    frame.position.set( x, 0, z );
    frame.scale.set( 1.3, 1.3, 1.3 );
    frame.rotation.y = alpha;
    frame.userData['originalPosition'] = frame.position.clone();

    return frame;
  }

  /**
   * Creates artframes with the textured canvas in the middle
   * @param artwork
   * @param i
   * @returns
   */
  createFrame ( artwork: Artwork, btns: any[] = [], i: number ): Group {
    const frameGroup = new Group();
    frameGroup.name = ` ${artwork.title} frame group`;

    // Create the frame geometry & canvas geometry
    this.frameGeometry.rotateX( Math.PI / 2 );
    const canvasGeometry = new BoxGeometry( artwork?.width / 100 * 1.12, artwork?.height / 100 * 1.12, 0.15 );

    // Create the canvas material with the texture
    const texture = this.loadersService.loadTexture( artwork.textureUrl );
    texture.colorSpace = SRGBColorSpace;
    texture.mapping = UVMapping;
    const canvasMaterial = new MeshPhongMaterial( { map: texture, color: 0xffffff } );

    // Create the frame & canvas mesh
    const frameMesh = new InstancedMesh( this.frameGeometry, this.frameMaterial, 5 );
    // TODO: this.animateFrameColors(frameMesh);

    const canvasMesh = new InstancedMesh( canvasGeometry, canvasMaterial, 5 );
    frameMesh.name = ` ${artwork.title} frame mesh` || 'frame';
    canvasMesh.name = ` ${artwork.title} canvas mesh` || 'frame canvas';

    const l = this.lightsService.createSpotLight();
    l[0].target = canvasMesh;
    frameGroup.add( frameMesh, canvasMesh, ...l );
    frameGroup.rotateY( Math.PI );

    const buttonsPanel = this.uiService.createInteractiveButtons( { buttons: btns, id: artwork.id } );

    const moreInfoPanel = this.uiService.createMoreInfoPanels( {
      id: artwork.id,
      title: artwork.title,
      description: artwork.description,
      votes: artwork.votes
    } );

    moreInfoPanel.quaternion.copy( frameMesh.quaternion );

    buttonsPanel.position.x = 0;
    buttonsPanel.position.y = -0.7;
    buttonsPanel.position.z = -0.2;

    buttonsPanel.rotateY( Math.PI );
    buttonsPanel.rotateX( -0.55 );
    moreInfoPanel.position.x = 1.3;
    moreInfoPanel.rotateY( -72 );//TODO: look at the angle it is created
    frameGroup.add( moreInfoPanel, buttonsPanel );

    return frameGroup;
  }

  focusFrame ( i: number ) {

    const f = this.frames[i];
    const x = f.position.x / this.frameDistance * this.focusFactor;
    const z = f.position.z / this.frameDistance * this.focusFactor;
    const p = new Vector3( x, f.position.y, z );
    this.moveFrame( f, p );

  }

  resetPosition ( i: number ) {

    const f = this.frames[i];
    const p = f.userData['originalPosition'];
    this.moveFrame( f, p );

  }

  animateFrameColors ( f: any, colors?: any ) {

    //TODO: gsap.to( f.material.color, {
    //   r: 144, g: 140, b: 209, duration: 2
    // } );
  }

  // TODO: use Three animation system?
  moveFrame ( f: any, p: any ) {

    gsap.to( f.position, {
      // @ts-ignore
      x: p.x, y: p.y, z: p.z, duration: 2.5
    } );

  }

  rotateFrames ( angle: number = 72 ) {
    console.log( 'MathUtils.degToRad( angle ) + this.framesGroup.rotation.y', MathUtils.degToRad( angle ), this.framesGroup.rotation.y );
    // angle between frames and the current group rotation
    const y = MathUtils.degToRad( angle ) + this.framesGroup.rotation.y;
    gsap.to( this.framesGroup.rotation, { y: y, duration: 1 } );

  }
};
