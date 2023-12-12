import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GalleryComponent } from "./gallery/gallery.component";
import { ErrorComponent } from "./shared/error/error.component";

const routes: Routes = [
	{
		path: "",
		component: GalleryComponent,
		title: "WebXR Gallery",
	},
	{
		path: "**",
		component: ErrorComponent,
		title: "Error Page",
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
