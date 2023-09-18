import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, WritableSignal, effect, signal, computed } from '@angular/core';

import { Group } from 'three';

import { Artwork } from 'projects/three/src/lib/artwork';
import { ArtworkFramesService, LightsService, LoadersService, SceneService, UIService } from 'projects/three/src/public-api';
import { ArtworksService } from '../artworks.service';
import { InteractiveEvent } from 'three.interactive';
import { DebugService } from '../../../projects/three/src/lib/debug.service';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'art-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {

  private artworks: Artwork[] = [];
  private artworksLength = 0;
  private selectedIndex: WritableSignal<number> = signal(0);
  public frames: Group;
  private buttons: Object;
  private focused = 0;
  // TODO: nope
  private info = computed(() => {
    this.artworks[this.selectedIndex()];
  });
  // WritableSignal<Object> = {
  //   title: '',
  //   description: '',
  //   votes: 0,
  //   audio?: '',
  // };
  selectedArtwork: WritableSignal<Artwork>;
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  private get canvasEl (): HTMLCanvasElement {
    return this.canvas!.nativeElement;
  }
  constructor(
    private artworksService: ArtworksService,
    private debugService: DebugService,
    private framesService: ArtworkFramesService,
    private lightsService: LightsService,
    private loadersService: LoadersService,
    public sceneService: SceneService,
    private ui: UIService,
  ) {
    effect(() => {
      // const focus = this.selectedArtwork().id || 0;

      //  if() {
      //     console.log('Selection change ', this.selectedArtwork());
      //     this.framesService.focusFrame(this.selectedArtwork().id);
      //   }
      // this.framesService.focusFrame(focus);
    });
  }

  // Init the WebXR scene with Artworks
  ngOnInit () {
    this.artworks = this.artworksService.getArtworks();
    const afterSceneInitCB = this.sceneService.initScene(this.canvasEl);

    // Model
    const model = this.loadersService.loadModel({
      path: 'assets/models/VRGalleryOriginal150901.glb',
      scene: this.sceneService.scene
    });

    // Frames
    this.buttons = [
      {
        name: 'Next Button',
        text: 'Next',
        shape: 'triangle',
        onClick: (ind: number) => { this.changeSelection(ind, 1); },
        position: { x: -0.75, y: 0, z: -0.0 },
        rotation: {}
      },

      {
        name: 'Upvote Button',
        text: 'Upvote',
        shape: 'heart',
        onClick: (ind: number) => { this.upvoteSelection(ind); },
        position: { x: -0.8, y: 0.8, z: -0.1 },
        rotation: {}
      },
      {
        name: 'Previous Button',
        text: 'Previous',
        shape: 'triangle',
        onClick: (ind: number) => { this.changeSelection(ind, -1); },
        position: { x: 0.75, y: 0, z: -0. },
        rotation: {}
      },



      // {
      //   name: 'Info Button',
      //   text: 'Info',
      //   onClick: (e: any) => { },
      //   position: { x: -0.9, y: 0.6, z: 0.1 }
      // }

    ];
    // @ts-ignore
    this.frames = this.framesService.createFrames(this.artworks, this.buttons, afterSceneInitCB);
    this.sceneService.addToScene(this.frames);

    // this.sceneService.spotlight.target = this.frames.children[1];
    // console.log('this.frames.children[0] ', this.frames.children[0]);

    // @ts-ignore
    // this.sceneService.spotlight.target = this.frames[0];
    // @ts-ignore


    // console.log('GLTF Gallery model', model);

    // UI
    //TODO: move the group to ui
    const UIGroup = new Group();

    // Next/Prev
    // const buttonsPanel = this.ui.createInteractiveButtons({ buttons: this.buttons });
    this.sceneService.renderFunctions.push(this.ui.update);
    // buttonsPanel.position.set(0, -0, -4);
    // this.sceneService.addToScene(buttonsPanel);
    this.artworksLength = this.artworks.length;

    this.selectedArtwork = signal(this.artworks[0], { equal: this.compareSelected });
  }

  compareSelected (o: Artwork, n: Artwork) {
    return o ? o.id === n.id : true;
  }

  showInfo (e: Event) {
    // @ts-ignore
    const ind = e.target.userData['artworkId'];

  }

  // Handle Artwork selection events
  onSelectArtwork (e: Event, i: number) {
    this.framesService.focusFrame(this.selectedArtwork().id);
  }

  /**
   * TODO: Select next artwork and show info panel?
   * @param e 
   */
  changeSelection (ind: any, n: number) {
    console.log('Change selection event ', ind, n);
    this.framesService.resetPosition(this.focused);
    let i;
    if (n === 1)// Next
    {
      // i = (ind === 0) ? this.artworksLength - 1 : ind - 1;
      i = ind < (this.artworksLength - 1) ? (ind + 1) : 0;
      console.log('selected ', i);
      this.framesService.rotateFrames(72);//Saga don
    } else if (n === -1)// Previous
    {
      i = (ind === 0) ? this.artworksLength - 1 : ind - 1;
      // i = ind < (this.artworksLength - 1) ? (ind + 1) : 0;
      this.framesService.rotateFrames(-72);
    }
    this.focused = i;
    this.framesService.focusFrame(i);
  }

  upvoteSelection (i: number): void {
    const name = `${i} Text`;
    const textMesh = this.frames.children[i].getObjectByName(name);
    const votes = this.artworksService.upvoteArtwork(i);
    this.ui.updateVote({ votes: votes, text: textMesh });
  };

  onKeyDown (e: KeyboardEvent) {
    // switch (e.key)
    // {
    //   case 'ArrowRight': this.changeSelection(e, 1); break;
    //   case 'ArrowLeft': this.changeSelection(e, -1); break;
    //   // TODO: What you are looking at might not be what's last selected.
    //   // case 'ArrowUp': this.upvoteSelection(); break;
    // }
  }

  onPointerDown (e: Event) { }

  onTouchStart (e: Event) { }

  onPointerMove (e: Event) {

  }

  onPointerUp (e: Event) {

  }

  onCanvasClick (e: Event) {

  }

  onObjectHover (e: Event) { }

  onDeviceChange (e: Event) { }

  onTouchEnd (e: Event) { }

  // Take a picture
  // Pointer events 
}
