import { Injectable } from '@angular/core';

import { Object3D, Group, BoxGeometry, Mesh, MathUtils, MeshLambertMaterial, MeshBasicMaterial, TextureLoader, Vector3, Quaternion, AnimationClip, QuaternionKeyframeTrack, AnimationMixer, AnimationObjectGroup, NumberKeyframeTrack, AnimationAction, LoopOnce } from 'three';

import { Artwork } from './artwork';

@Injectable({
  providedIn: 'root'
})
export class ArtworkFramesService {
  frameDistance = 4;
  angle = 0;
  frames: Object3D[] = [];
  focusPosition: any;
  locations: any[] = [];

  framesGroup = new Group();


  constructor() {
  }

  createFrames(artworks: Artwork[] = []): Object3D {
    console.log('creating frames ')
    this.framesGroup.name = 'Frames Group';
    this.angle = (Math.PI * 2) / artworks.length;
    this.frames = artworks.map((artwork, i) => {
      const f = this.placeFrame(this.createFrame(artwork), i)
      return f;
    });

    const length = artworks.length;
    const radians = (Math.PI * 2) / length;
    this.framesGroup.add(...this.frames);

    // this.sceneService.renderFunctions.push(this.update.bind(this));
    this.addLocationData(artworks);
    this.framesGroup.position.set(0, 1.6, 0);
    return this.framesGroup;
  }

  addLocationData(artworks: Artwork[]) {
    const withLocation = artworks.map((artwork, i) => {
      const curFrame = this.frames[i]
      artwork.defaultPosition = curFrame.position;
      artwork.defaultRotation = curFrame.rotation;
      this.locations[i] = [curFrame.position, curFrame.rotation];
      return artwork;
    });

  }

  placeFrame(frame: Object3D, i: number = 0) {
    const position = new Vector3(0, 0, 0);
    const alpha = Math.PI + i * this.angle;
    const x = Math.sin(alpha) * this.frameDistance;// 0 - 1
    const z = Math.cos(alpha) * this.frameDistance;// 0 - 0 
    frame.position.set(x, 0, z);
    frame.rotation.y = alpha;//

    frame.userData['originalPosition'] = frame.position.clone();
    return frame;
  }

  createFrame(artwork: Artwork, i?: number): Object3D {
    //Use the componenet options or take the default values

    // Create the frame geometry
    // const frameGeometry = new BoxGeometry(artwork.width / 100, artwork.height / 100, 0.1);
    const frameGeometry = new BoxGeometry(2, 2, 0.1)

    // Create the frame material with the texture
    // const texture = new TextureLoader().load(artwork.textureUrl);

    //const frameMaterial = new MeshBasicMaterial({ map: texture, color: 0xffffff });
    const frameMaterial = new MeshBasicMaterial({ color: 0xffffff });
    // Create the frame mesh
    const frameMesh = new Mesh(frameGeometry, frameMaterial);
    frameMesh.name = artwork.title || 'frame';

    return frameMesh;
  }

  update() {
  }

}
