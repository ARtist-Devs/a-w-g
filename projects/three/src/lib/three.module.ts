import { NgModule } from '@angular/core';
import { ThreeComponent } from './three.component';
import { ArtworkFramesService } from './artwork-frames.service'

@NgModule({
  declarations: [
    ThreeComponent
  ],
  imports: [
  ],
  providers: [
    ArtworkFramesService
  ],
  exports: [
    ThreeComponent,
  ]
})
export class ThreeModule { }
