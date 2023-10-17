import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, WritableSignal, computed, signal } from '@angular/core';

import { Artwork } from 'projects/three/src/lib/artwork';
import { ArtworkFramesService, LoadersService, SceneService, UIService } from 'projects/three/src/public-api';
import { ArtworksService } from '../artworks.service';

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
  public loadingProgress: WritableSignal<number> = signal(0);
  public frames: any;
  private buttons: Object[];
  private focused = 0;


  private info = computed(() => {
    this.artworks[this.selectedIndex()];
  });

  selectedArtwork: WritableSignal<Artwork>;
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  private get canvasEl (): HTMLCanvasElement {
    return this.canvas!.nativeElement;
  }
  constructor(
    public sceneService: SceneService,
    private artworksService: ArtworksService,
    private framesService: ArtworkFramesService,
    private loadersService: LoadersService,
    private ui: UIService,
  ) {
  }

  // Init the WebXR scene with Artworks
  ngOnInit () {
    const start = Date.now();
    this.artworks = this.artworksService.getArtworks();
    const afterSceneInitCB = this.sceneService.initScene(this.canvasEl);

    // Model for Floor
    const model = this.loadersService.loadModel({
      path: "assets/models/VRGallery0110NoFloorTexture.glb",

      scene: this.sceneService.scene,
      onLoadProgress: this.onLoadProgress.bind(this),
      onLoadCB: () => {
        afterSceneInitCB(start);
        this.sceneService.addToScene(this.frames);
        const millis = Date.now() - start; console.log(`seconds elapsed = ${Math.floor(millis / 1000)}`);
      }

    });

    // Model for Walls
    const modelWalls = this.loadersService.loadModel({
      path: "assets/models/VRGalleryInnerWalls0110Merge.glb",
      scene: this.sceneService.scene,
      onLoadProgress: this.onLoadProgress.bind(this),
      onLoadCB: () => {
        afterSceneInitCB(start);
        this.sceneService.addToScene(this.frames);
      }
    });

    // Frames
    // Buttons
    this.buttons = [
      {
        name: 'Next Button',
        text: 'Next',
        onClick: (ind: number) => { this.changeSelection(ind, 1); },
        position: { x: -0.75, y: 0, z: -0.0 },
        rotation: {}
      },

      {
        name: 'Upvote Button',
        text: 'Upvote',
        onClick: (ind: number) => { this.upvoteSelection(ind); },
        position: { x: -0.8, y: 0.8, z: -0.1 },
        rotation: {}
      },
      {
        name: 'Previous Button',
        text: 'Previous',
        onClick: (ind: number) => { this.changeSelection(ind, -1); },
        position: { x: 0.75, y: 0, z: -0. },
        rotation: {}
      }
    ];

    this.frames = this.framesService.createFrames(this.artworks, this.buttons, afterSceneInitCB);

    // UI
    this.sceneService.renderFunctions.push(this.ui.update);

    this.artworksLength = this.artworks.length;

    this.selectedArtwork = signal(this.artworks[0], { equal: this.compareSelected });
  }

  onLoadProgress (xhr: ProgressEvent) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    this.loadingProgress.set(xhr.loaded / xhr.total);
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

    this.framesService.resetPosition(this.focused);
    let i;
    if (n === 1)// Next
    {
      i = ind < (this.artworksLength - 1) ? (ind + 1) : 0;
      this.framesService.rotateFrames(72);//Rotate right
    } else if (n === -1)// Previous
    {
      i = (ind === 0) ? this.artworksLength - 1 : ind - 1;
      this.framesService.rotateFrames(-72);
    }
    this.focused = i;
    this.framesService.focusFrame(i);

  }

  upvoteSelection (i: number): void {
    const votes = this.artworksService.upvoteArtwork(i);
    const name = `${i} Text`;
    const textMesh = this.frames.children[i].getObjectByName(name);
    this.ui.updateVote({ votes: this.artworks[i].votes, text: textMesh });
  };

}
