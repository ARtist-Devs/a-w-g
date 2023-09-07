import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, WritableSignal, effect, signal, computed } from '@angular/core';

import { Group } from 'three';

import { Artwork } from 'projects/three/src/lib/artwork';
import { ArtworkFramesService, SceneService, UIService } from 'projects/three/src/public-api';
import { ArtworksService } from '../artworks.service';
import { InteractiveEvent } from 'three.interactive';

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
  private frames: Group;
  private buttons: Object;
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
    public sceneService: SceneService,
    private framesService: ArtworkFramesService,
    private artworksService: ArtworksService,
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
    this.sceneService.initScene(this.canvasEl);

    // Frames
    this.buttons = [
      {
        name: 'Next Button',
        text: 'Next',
        onClick: (e: any) => { this.changeSelection(e, 1); },
        position: { x: -0.9, y: 0, z: 0.1 }
      },
      {
        name: 'Previous Button',
        text: 'Previous',
        onClick: (e: any) => { this.changeSelection(e, -1); },
        position: { x: 0.9, y: 0, z: 0.1 }
      },
      {
        name: 'Upvote Button',
        text: 'Upvote',
        onClick: (e: any) => { this.upvoteSelection(e); },
        position: { x: -0.9, y: 0.8, z: 0.1 }
      },
      {
        name: 'Info Button',
        text: 'Info',
        onClick: (e: any) => { },
        position: { x: -0.9, y: 0.6, z: 0.1 }
      }

    ];
    // @ts-ignore
    this.frames = this.framesService.createFrames(this.artworks, this.buttons);
    this.sceneService.addToScene(this.frames);

    // UI
    //TODO: move the group to ui
    const UIGroup = new Group();

    // Next/Prev
    const buttonsPanel = this.ui.createInteractiveButtons({ buttons: this.buttons });
    buttonsPanel.position.set(0, -1, -2);
    this.sceneService.addToScene(buttonsPanel);
    this.artworksLength = this.artworks.length;
    this.selectedArtwork = signal(this.artworks[0], { equal: this.compareSelected });

    // console.log('this.selectedArtwork(', this.selectedArtwork());
    // this.framesService.focusFrame(0);
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
  changeSelection (e: any, n: number) {
    // @ts-ignore
    const ind = typeof e === "number" ? e : e.target.userData['artworkId'];

    console.log('Changing the selection ', n, ind);

    this.framesService.resetPosition(ind);
    let i = ind;
    if (n === 1)
    {
      i = (ind === 0) ? this.artworksLength - 1 : ind - 1;
      this.framesService.rotateFrames(72);
    } else if (n === -1)
    {
      i = ind < (this.artworksLength - 1) ? (ind + 1) : 0;
      this.framesService.rotateFrames(-72);
    }

    // TODO: fix selected on two places
    // this.artworksService.changeSelected(i);
    this.framesService.focusFrame(i);
  }

  upvoteSelection (e: InteractiveEvent | Event, i?: number): void {
    // @ts-ignore
    this.artworksService.upvoteArtwork(e.target.userData['artworkId']);
  };

  onKeyDown (e: KeyboardEvent) {
    switch (e.key)
    {
      case 'ArrowRight': this.changeSelection(e, 1); break;
      case 'ArrowLeft': this.changeSelection(e, -1); break;
      case 'ArrowUp': this.upvoteSelection(e); break;
    }
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
