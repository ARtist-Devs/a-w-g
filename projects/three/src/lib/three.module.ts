import { NgModule } from '@angular/core';
import { ArtworkFramesService } from './artwork-frames.service';
import { CameraService } from './camera.service';
import { LoadersService } from './loaders.service';
import { SceneService } from './scene.service';
import { ThreeComponent } from './three.component';
import { UIService } from './ui.service';

@NgModule({
  declarations: [
    ThreeComponent,
  ],
  imports: [
  ],
  providers: [
    ArtworkFramesService, CameraService, LoadersService, SceneService, UIService
  ],
  exports: [
    ThreeComponent,
  ]
})
export class ThreeModule { }