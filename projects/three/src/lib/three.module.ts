import { NgModule } from '@angular/core';
import { ThreeComponent } from './three.component';
import { ArtworkFramesService } from './artwork-frames.service';
import { UIService } from './ui.service';
import { ObjectsService } from './objects.service';
import { CameraService } from './camera.service';
import { LoadersService } from './loaders.service';
import { SceneService } from './scene.service';

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
