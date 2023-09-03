import { Injectable, NgZone } from '@angular/core';
import { Camera, Clock, Color, DirectionalLight, Fog, PCFSoftShadowMap, Scene, Vector2, WebGLRenderer } from 'three';
import { sceneDefaults } from './scene.config';
import { CameraService } from './camera.service';
import { ControllerService } from './controller.service';


@Injectable({
    providedIn: 'root',
})
export class SceneService {

    public camera: Camera;
    public scene: Scene = new Scene();
    public renderFunctions: Function[] = [];
    public clock = new Clock();
    public renderer: WebGLRenderer;

    private width = window.innerWidth;
    private height = window.innerHeight;
    private rect: DOMRect;
    private pointer = new Vector2();
    // pos: Signal<Vector3> = computed(() =>
    //   this.frames?.[this.selectedIndex()]?.position.clone() || this.look
    // );
    constructor(
        private cameraService: CameraService,
        private controllerService: ControllerService,
        private ngZone: NgZone
    ) { }

    initScene (canvas: HTMLCanvasElement, options?: any) {
        const ops = Object.assign({}, sceneDefaults, options);

        // Camera
        ops.camera.width = this.width;
        ops.camera.height = this.height;
        this.camera = this.cameraService.createCamera(ops.camera);
        // this.dolly = this.cameraService.addDolly()
        // this.scene.add(this.dolly);
        // Scene
        this.scene.background = ops.background || new Color('skyblue');
        if (ops.fog)
        {
            this.scene.fog = new Fog(ops.fog.color, ops.fog.near, ops.fog.far);
        }

        // Lights
        // TODO move to service
        const directionalLight = new DirectionalLight(ops.color, ops.intensity);
        this.scene.add(directionalLight);

        // Renderer
        this.renderer = new WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: true });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.rect = this.renderer.domElement.getBoundingClientRect();

        // Controls
        const controls = this.controllerService.createControls({ type: 'orbit', camera: this.camera, renderer: this.renderer, canvas: canvas });

        // Render loop
        this.ngZone.runOutsideAngular(() => this.renderer.setAnimationLoop(() => this.render()));
    }

    onTouchStart (e: Event) {
        // this.pointer.x = ((e.touches[0].clientX - this.rect.left) / (this.rect.right - this.rect.left)) * 2 - 1;
        // this.pointer.y = - ((e.touches[0].clientY - this.rect.top) / (this.rect.bottom - this.rect.top)) * 2 + 1;
        // this.interactions.intersectObjects({ pointer: this.pointer, camera: this.camera, scene: this.scene, select: true });
    }

    onPointerDown (e: Event) {
        this.pointer.x = ((event.clientX - this.rect.left) / (this.rect.right - this.rect.left)) * 2 - 1;
        this.pointer.y = -((event.clientY - this.rect.top) / (this.rect.bottom - this.rect.top)) * 2 + 1;
        // this.interactions.intersectObjects({ pointer: this.pointer, camera: this.camera, scene: this.scene });
    }

    render () {
        const delta = this.clock.getDelta();

        // update controls
        this.controllerService.updateControls();

        // run renderFunctions
        this.renderFunctions.forEach(func => func(delta));

        // render
        this.renderer.render(this.scene, this.camera);

    }

    addToScene (obj: any) {
        if (obj instanceof Array)
        {
            this.scene.add(...obj);
        }
        else
        {
            this.scene.add(obj);
        }
    }

    onResize (e: Event, w?: any, h?: any) {
        console.log('Resizing ', e);
        w = w || window.innerWidth;
        h = h || window.innerHeight;

        // Set the camera's aspect ratio
        // @ts-ignore
        this.camera.aspect = w / h;
        // update the camera's frustum
        // @ts-ignore
        this.camera.updateProjectionMatrix();

        // update the size of the renderer & the canvas
        this.renderer.setSize(w, h);
        // set the pixel ratio (for mobile devices)
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    onDeviceChange (e: Event) { }
}
