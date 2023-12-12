import { NgModule } from '@angular/core';
import { ArtworkFramesService } from './artwork-frames.service';
import { CameraService } from './camera.service';
import { LoadersService } from './loaders.service';
import { SceneService } from './scene.service';
import { UIService } from './ui.service';
import { WebXRService } from './webxr.service';

@NgModule( {
  providers: [
    ArtworkFramesService, CameraService, LoadersService, SceneService, UIService, WebXRService
  ],
} )
export class ThreeModule { }
