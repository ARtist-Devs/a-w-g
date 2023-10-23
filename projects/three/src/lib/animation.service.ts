import { Injectable } from '@angular/core';
import { AnimationObjectGroup } from 'three';

@Injectable( {
  providedIn: null
} )
export class AnimationService {
  animationGroup = new AnimationObjectGroup();
  constructor() { }

  rotateFrames ( angle: number ) {

  };
}
