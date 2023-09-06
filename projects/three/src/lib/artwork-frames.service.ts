import { Injectable } from '@angular/core';

import gsap from 'gsap';
import { BoxGeometry, Group, LinearFilter, MathUtils, Mesh, MeshBasicMaterial, MeshLambertMaterial, Object3D, SRGBColorSpace, TextureLoader, UVMapping, Vector3, } from 'three';

import { Artwork } from './artwork';

@Injectable({
  providedIn: 'root'
})
export class ArtworkFramesService {
  frameDistance = 5;
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
    texture.colorSpace = SRGBColorSpace;
    texture.minFilter = texture.magFilter = LinearFilter;
    texture.mapping = UVMapping;

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

  focusFrame (i: number) {

    const f = this.frames[i];
    const x = f.position.x / this.frameDistance * 1.5;// 0 - 1
    const z = f.position.z / this.frameDistance * 1.5;// 0 - 0 
    const p = new Vector3(x, f.position.y, z);
    this.moveFrame(f, p);

  }

  resetPosition (i: number) {
    const f = this.frames[i];
    const p = f.userData['originalPosition'];
    this.moveFrame(f, p);
  }

  moveFrame (f: any, p: any) {
    gsap.to(f.position, {
      // @ts-ignore
      x: p.x, y: p.y, z: p.z, duration: 2.5
    });
  }

  rotateFrames (angle: number = 72) {
    const y = MathUtils.degToRad(angle) + this.framesGroup.rotation.y;
    gsap.to(this.framesGroup.rotation, { y: y, duration: 1 });
    // this.framesGroup.rotateY(MathUtils.degToRad(angle));
  }

};;
