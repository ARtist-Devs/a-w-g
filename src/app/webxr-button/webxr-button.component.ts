import { Component } from "@angular/core";

@Component({
	selector: "art-webxr-button",
	templateUrl: "./webxr-button.component.html",
	styleUrls: ["./webxr-button.component.scss"],
})
export class WebXRButtonComponent {
	text = "START XR";
	renderer: any;
	currentSession: any;
	sessionMode: XRSessionMode = "inline";

	onClick(e: Event) {
		console.log("XR Button component Clicked ");

		if (this.currentSession === null) {
			const sessionInit = {
				optionalFeatures: [
					"local-floor",
					"bounded-floor",
					"hand-tracking",
					"layers",
				],
			};
			// TODO: get the session mode
			navigator.xr
				?.requestSession(this.sessionMode, sessionInit)
				.then((session) => this.onSessionStarted);
		} else {
			this.currentSession.end();
		}
	}

	onXRNotSupported(e: Event) {
		this.text = "XR NOT SUPPORTED";
	}

	onSessionEnded(session: XRSession) {
		this.currentSession.removeEventListener("end", this.onSessionEnded);
		this.text = "START XR";
		this.currentSession = null;
	}

	onSessionStarted(session: XRSession) {
		// session.addEventListener('end', this.onSessionEnded.bind(this)); //TODO;
		this.renderer.xr.setSession(session);
		this.text = "STOP XR";
		this.currentSession = session;
	}
}
