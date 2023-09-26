import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GalleryComponent } from './gallery/gallery.component';
import { WebXRButtonComponent } from './webxr-button/webxr-button.component';

import { SharedModule } from './shared/shared.module';
import { ThreeModule } from 'projects/three/src/public-api';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    AppComponent,
    GalleryComponent,
    WebXRButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    ThreeModule,
    MatProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
