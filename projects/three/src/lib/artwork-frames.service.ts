import { Injectable } from '@angular/core';

import { Object3D, Group, BoxGeometry, Mesh, MathUtils, MeshLambertMaterial, MeshBasicMaterial, TextureLoader, Vector3, } from 'three';
// TODO: move to animation service: Quaternion, AnimationClip, QuaternionKeyframeTrack, AnimationMixer, AnimationObjectGroup, NumberKeyframeTrack, AnimationAction, LoopOnce 

import { Artwork } from './artwork';

@Injectable({
  providedIn: 'root'
})
export class ArtworkFramesService {
  frameDistance = 3;
  angle = 0;
  frames: Group[] = [];
  focusPosition: any;
  locations: any[] = [];

  framesGroup = new Group();
  artworksWithLocation: Artwork[];


  constructor() { }

  createFrames (artworks: Artwork[] = []): Group {
    this.framesGroup.name = 'Frames Group';
    this.angle = (Math.PI * 2) / artworks.length;
    this.frames = artworks.map((artwork, i) => {
      const f = this.placeFrame(this.createFrame(artwork), i);
      return f;
    });

    const length = artworks.length;
    const radians = (Math.PI * 2) / length;
    this.framesGroup.add(...this.frames);

    // TODO:
    // this.sceneService.renderFunctions.push(this.update.bind(this));
    this.framesGroup.position.set(0, 1.6, 0);
    return this.framesGroup;
  }

  /**
   * Distributes frames based on their index
   * @param frame artframe
   * @param i index
   * @returns frame with location
   */
  placeFrame (frame: Group, i: number = 0) {
    const position = new Vector3(0, 0, 0);
    const alpha = Math.PI + i * this.angle;
    const x = Math.sin(alpha) * this.frameDistance;// 0 - 1
    const z = Math.cos(alpha) * this.frameDistance;// 0 - 0 
    frame.position.set(x, 0, z);
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
  createFrame (artwork: Artwork, i?: number): Group {
    const frameGroup = new Group();
    frameGroup.name = ` ${artwork.title} frame group`;
    //Use the componenet options or take the default values

    // Create the frame geometry & canvas geometry
    const frameGeometry = new BoxGeometry(1.5, 2, 0.2);
    // @ts-ignore
    const canvasGeometry = new BoxGeometry(artwork?.width / 100, artwork?.height / 100, 0.3);

    // Create the canvas material with the texture
    const texture = new TextureLoader().load(artwork.textureUrl);
    const canvasMaterial = new MeshBasicMaterial({ map: texture, color: 0xffffff });
    const frameMaterial = new MeshBasicMaterial({ color: 0xffffff });

    // Create the frame & canvas mesh
    const frameMesh = new Mesh(frameGeometry, frameMaterial);
    const canvasMesh = new Mesh(canvasGeometry, canvasMaterial);
    frameMesh.name = ` ${artwork.title} frame mesh` || 'frame';
    canvasMesh.name = ` ${artwork.title} canvas mesh` || 'frame canvas';
    frameGroup.add(frameMesh, canvasMesh);

    return frameGroup;
  }

  createNextButtons () {

  }

  // TODO: Get the frame[i]
  focusFrame (f?: Group) {
    // console.log("Default P ", this.frames[1].userData['originalPosition']);
    const frame = this.frames[1];
    console.log("BP", this.frames[1].position);
    const x = frame.position.x / this.frameDistance;// 0 - 1
    const z = frame.position.z / this.frameDistance;// 0 - 0 
    frame.position.set(x, frame.position.y, z);

  }

  // TODO: Animate
  resetPosition (i: number) {
    const v = this.frames[i].userData['originalPosition'].clone();
    this.frames[i].position.set(v.x, v.y, v.z);
  }

  rotateFrames (angle: number = 72) {
    this.framesGroup.rotateY(MathUtils.degToRad(angle));
  }

  update () {
  }

};;
