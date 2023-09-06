import { Injectable } from '@angular/core';
import { InteractionManager } from 'three.interactive';
import { SceneService } from './scene.service';
import { Camera, Object3D, WebGLRenderer } from 'three';

@Injectable({
  providedIn: 'root'
})
export class InteractionsService {
  interactionManager: InteractionManager;
  constructor() { }

  initInteractionManager (renderer: WebGLRenderer, camera: Camera, canvas: HTMLCanvasElement) {
    this.interactionManager = new InteractionManager(
      renderer,
      camera,
      canvas
    );

    return this.interactionManager.update.bind(this);
  }

  addToInteractions (mesh: Object3D) {
    this.interactionManager.add(mesh);
  }

  update () {
    this.interactionManager.update();
  }
}
