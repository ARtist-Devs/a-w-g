import { NgModule, isDevMode } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GalleryComponent } from "./gallery/gallery.component";
import { WebXRButtonComponent } from "./webxr-button/webxr-button.component";

import { ServiceWorkerModule } from "@angular/service-worker";
import { ThreeModule } from "projects/three/src/public-api";
import { SharedModule } from "./shared/shared.module";

@NgModule({
	declarations: [AppComponent, GalleryComponent, WebXRButtonComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		SharedModule,
		ThreeModule,
		ServiceWorkerModule.register("ngsw-worker.js", {
			enabled: !isDevMode(),
			// Register the ServiceWorker as soon as the application is stable
			// or after 30 seconds (whichever comes first).
			registrationStrategy: "registerWhenStable:30000",
		}),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
