import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, WritableSignal, effect, signal } from '@angular/core';

import { Group } from 'three';

import { Artwork } from 'projects/three/src/lib/artwork';
import { ArtworkFramesService, SceneService, UIService } from 'projects/three/src/public-api';
import { ArtworksService } from '../artworks.service';

@Component({
  selector: 'art-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {

  artworks: Artwork[] = [];
  private artworksLength = 0;
  private selectedIndex: WritableSignal<number> = signal(0);
  private frames: Group;
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
    this.frames = this.framesService.createFrames(this.artworks);
    this.sceneService.addToScene(this.frames);

    // UI
    //TODO: move the group to ui
    const UIGroup = new Group();
    // Next/Prev
    const buttonsPanel = this.ui.createInteractiveButtons({
      buttons: [
        {
          name: 'Next Button',
          text: 'Next',
          onClick: (e: Event) => { this.changeSelection(1); },
        },
        {
          name: 'Upvote Button',
          text: 'Upvote',
          onClick: (e: Event) => { this.upvoteSelection(e); },
        },
        {
          name: 'Previous Button',
          text: 'Previous',
          onClick: (e: Event) => { this.changeSelection(-1); }
        }
      ]

    });
    buttonsPanel.position.set(0, -1, -2);
    this.sceneService.addToScene(buttonsPanel);
    this.artworksLength = this.artworks.length;
    this.selectedArtwork = signal(this.artworks[0], { equal: this.compareSelected });

    // console.log('this.selectedArtwork(', this.selectedArtwork());
    this.framesService.focusFrame(this.selectedArtwork().id);
  }

  compareSelected (o: Artwork, n: Artwork) {
    return o ? o.id === n.id : true;
  }

  // Handle Artwork selection events
  onSelectArtwork (e: Event, i: number) {
    this.framesService.focusFrame(this.selectedArtwork().id);
  }

  /**
   * TODO: Select next artwork and show info panel?
   * @param e 
   */
  changeSelection (n: number) {
    const ind = this.selectedArtwork().id;
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
    this.selectedArtwork.set(this.artworks[i]);
    this.artworksService.changeSelected(i);
    this.framesService.focusFrame(i);
  }

  upvoteSelection (e: Event) {
    this.artworksService.upvoteSelected();
  }

  onKeyDown (e: KeyboardEvent) {
    switch (e.key)
    {
      case 'ArrowRight': this.changeSelection(1); break;
      case 'ArrowLeft': this.changeSelection(-1); break;
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

  onObjectHover (e: Event) {

  }



  onDeviceChange (e: Event) {

  }

  onTouchEnd (e: Event) {

  }

  // Take a picture
  // Pointer events 
}
