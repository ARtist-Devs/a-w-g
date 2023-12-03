import { Injectable } from '@angular/core';

import gsap from 'gsap';
import { BoxGeometry, Color, CylinderGeometry, Group, InstancedMesh, MathUtils, Matrix4, MeshPhongMaterial, SRGBColorSpace, UVMapping, Vector3, Material, Mesh } from 'three';
import * as  TWEEN from 'three/examples/jsm/libs/tween.module';
import { Artwork } from './artwork';
import { LightsService } from './lights.service';
import { LoadersService } from './loaders.service';
import { UIService } from './ui.service';

@Injectable( {
  providedIn: 'platform'
} )
export class ArtworkFramesService {

  angle = 0;
  artworksWithLocation: Artwork[];
  frameDistance = 7;
  frames: Group[] = [];
  focusPosition: any;
  focusFactor = 4;
  // radiusTop: Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float
  frameGeometry: any = new CylinderGeometry( 0.8, 0.7, 0.1, 36, 5 );

  framesGroup = new Group();

  locations: any[] = [];
  matrix = new Matrix4();


  constructor(
    private lightsService: LightsService,
    private loadersService: LoadersService,
    private uiService: UIService,
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
    const frameMaterial = new MeshPhongMaterial( { color: artwork.colors[0] } );
    frameMaterial.needsUpdate = true;
    const frameMesh = new Mesh( this.frameGeometry, frameMaterial );
    // TODO: 

    const canvasMesh = new InstancedMesh( canvasGeometry, canvasMaterial, 5 );
    frameMesh.name = `${artwork.title} frame mesh` || 'frame';
    canvasMesh.name = `${artwork.title} canvas mesh` || 'frame canvas';

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

    // this.frames.children.forEach( ( frame: any, i: number ) => {
    //   const n = Math.round( Math.random() * this.artworks[i].colors.length );
    //   const ranCol = new Color( 0xffffff );
    //   const col = this.artworks[i].colors[n] || ranCol;
    //   console.log( 'Color ', col, n );
    //   const tween = new TWEEN.Tween( frame.children[0].material.color );
    //   // .to(
    //   //   // @ts-ignore
    //   //   col,
    //   //   1000
    //   // );
    //   this.tweens.push( tween );
    //   // this.sceneService.renderFunctions.push( () => tween.update() );

    //   // Target color
    //   // easing: TWEEN.Easing.Cubic.In, // Easing function
    //   // duration: 1000 // Duration in milliseconds

    //   // this.sceneService.renderFunctions.push( this.ui.update );
    // } );
    this.animateFrameColors( frameMesh, artwork.colors );
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

    // let tween = new TWEEN.Tween( f.material.color );

    console.log( 'Colors ', colors );
    // if ( colors.length ) {
    colors.forEach( ( color: Color, i: number ) => {
      const tween = new TWEEN.Tween( f.material.color );
      tween.repeat( Infinity );
      tween.easing( TWEEN.Easing.Quadratic.InOut );

      tween.to(
        colors[i],
        10000
      );

      tween.repeatDelay( colors.length * 1000 );
      tween.repeat( Infinity );
      tween.start( undefined, true );

      // .onStart( () => {
      //   console.log( 'onStart' );
      // } )
      // .onRepeat( () => {
      //   console.log( 'onRepeat' );
      // } )
      // .onEveryStart( () => {
      //   console.log( 'onEveryStart' );
      // } )
      // .start();
      // tween.start();
    } );

    // tween.start( undefined, true );

    // }



    // TODO: 
    // console.log( 'f ', f );


    // gsap.to( f.children[0].material.color, {
    //   r: 255, g: 0, b: 0, duration: 8
    // } );
    // const c = new Color(  );
    // if ( f.material ) {
    //   console.log( 'f.material ', f.material );

    //   new TWEEN.Tween( f.material.color )
    //     .to(
    //       {
    //         r: 255,
    //         g: 0,
    //         b: 0,
    //       },
    //       1000
    //     )
    //     .start();

    // }
  }

  // TODO: use Three animation system?
  moveFrame ( f: any, p: any ) {

    gsap.to( f.position, {
      // @ts-ignore
      x: p.x, y: p.y, z: p.z, duration: 2.5
    } );

  }

  rotateFrames ( angle: number = 72 ) {

    // angle between frames and the current group rotation
    const y = MathUtils.degToRad( angle ) + this.framesGroup.rotation.y;
    gsap.to( this.framesGroup.rotation, { y: y, duration: 1 } );

  }
};
