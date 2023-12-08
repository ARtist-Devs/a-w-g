import { Injectable } from '@angular/core';

import { BoxGeometry, Color, CylinderGeometry, Group, InstancedMesh, MathUtils, Matrix4, Mesh, MeshPhongMaterial, SRGBColorSpace, UVMapping, Vector3 } from 'three';

import { animate, easeIn, easeInOut } from 'popmotion';
import { Artwork } from './artwork';
import { DebugService } from './debug.service';
import { InteractionsService } from './interactions.service';
import { LightsService } from './lights.service';
import { LoadersService } from './loaders.service';
import { UIService } from './ui.service';

@Injectable( {
  providedIn: 'platform'
} )
export class ArtworkFramesService {

  angle = 0;
  artworksWithLocation: Artwork[];
  colorAnimationDuration: number = 5500;
  colorButtonGeo = new CylinderGeometry( 0.07, 0.07, 0.1, 16, 1 );
  frameDistance = 7;
  frames: Group[] = [];
  focusPosition: any;
  focusFactor = 4;
  // radiusTop: Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float
  frameGeometry: any = new CylinderGeometry( 0.8, 0.7, 0.1, 64, 5 );

  framesGroup = new Group();

  locations: any[] = [];
  matrix = new Matrix4();
  phongMaterial = new MeshPhongMaterial();


  constructor(
    private interactionsService: InteractionsService,
    private lightsService: LightsService,
    private loadersService: LoadersService,
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
    const canvasMaterial = this.phongMaterial.clone();
    canvasMaterial.map = texture;

    // Create the frame & canvas mesh
    const frameMaterial = this.phongMaterial.clone();
    frameMaterial.color.set( artwork.colors[0] );
    frameMaterial.needsUpdate = true;
    const frameMesh = new Mesh( this.frameGeometry, frameMaterial );


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

    // Color Buttons
    const colorButtons = this.createCollorsButtons( artwork.colors, frameMesh );
    frameGroup.add( colorButtons );

    // Calling the frame color animation for the first time
    this.animateFrameColor( frameMesh, artwork.colors, artwork.colors.length * this.colorAnimationDuration, 2 );
    return frameGroup;

  }

  createCollorsButtons ( colors: string[], frameMesh: any ) {

    const colorButtonsGroup: Group = new Group;
    const r = 1;
    const l = colors.length;

    for ( let i = 0; i < l; i++ ) {
      const material = this.phongMaterial.clone();
      let c = colors[i];
      material.color.set( c );
      const mesh = new Mesh( this.colorButtonGeo, material );
      const theta = 2 * Math.PI * i / ( l * 2 );
      mesh.position.z = 0;
      mesh.rotation.x = Math.PI / 2;
      mesh.position.y = r * Math.sin( theta );
      mesh.position.x = r * Math.cos( theta );//-1;
      colorButtonsGroup.add( mesh );
      this.interactionsService.addToInteractions( mesh );
      mesh.addEventListener( 'click', () => {

        frameMesh.userData.playback.stop();
        this.animateFrameColor( frameMesh, c, 500 );

      } );

      mesh.addEventListener( 'mouseover', ( event ) => {
        animate( {
          from: 1,
          to: 1.2,
          ease: easeIn,
          duration: 400,
          onUpdate: latest => {
            mesh.scale.set( latest, latest, latest );
          },
        } );
      } );

      mesh.addEventListener( 'mouseout', ( event ) => {
        animate( {
          from: 1.2,
          to: 1,
          ease: easeIn,
          duration: 400,
          onUpdate: latest => {
            mesh.scale.set( latest, latest, latest );
          },
        } );
      } );
    }

    colorButtonsGroup.rotation.z = Math.PI / 4;

    return colorButtonsGroup;

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

  animateFrameColor ( frameMesh: any, colors: any, time?: number, repeat?: number ) {
    const clr = frameMesh.material.color;
    const f = clr.getStyle();
    const duration = time || this.colorAnimationDuration;

    // Animation
    const playback = animate( {
      from: f,
      to: colors,
      ease: easeInOut,
      duration: duration,
      onUpdate: latest => {
        clr.set( new Color( latest ) );
      },
      repeat: repeat || 0,
      repeatType: 'reverse',
    } );

    frameMesh.userData['playback'] = playback;

  }

  // TODO: use Three animation system?
  moveFrame ( f: any, p: any ) {

    const to = new Vector3( p.x, p.y, p.z );
    animate( {
      from: f.position,
      to: to,
      duration: 2500,
      ease: easeInOut,
      onUpdate: latest => {
        f.position.x = latest.x;
        f.position.y = latest.y;
        f.position.z = latest.z;
      }
    } );

  }

  rotateFrames ( angle: number = 72 ) {

    // angle between frames and the current group rotation
    const y = MathUtils.degToRad( angle ) + this.framesGroup.rotation.y;
    animate( {
      from: this.framesGroup.rotation.y,
      to: y,
      duration: 1000,
      ease: easeInOut,
      onUpdate: latest => this.framesGroup.rotation.y = latest
    } );

  }
};;;;
