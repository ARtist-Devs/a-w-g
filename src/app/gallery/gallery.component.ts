import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, WritableSignal, effect, signal } from '@angular/core';

import { Group, Vector3 } from 'three';
import { ArtworksService } from '../artworks.service';
import { SceneService, ArtworkFramesService, UIService } from 'projects/three/src/public-api';
import { Artwork } from 'projects/three/src/lib/artwork';

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
  selectedArtwork: WritableSignal<Artwork> = signal(this.artworks[0]);

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
      if (this.selectedArtwork()) { this.framesService.focusFrame(this.selectedArtwork().id); }
    });
  }

  // Init the WebXR scene with Artworks
  ngOnInit () {
    this.artworks = this.artworksService.getArtworks();
    this.sceneService.initScene(this.canvasEl);
    this.frames = this.framesService.createFrames(this.artworks);
    this.sceneService.renderFunctions.push(this.framesService.update);
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
          onClick: (e: Event) => { this.onNextSelection(e); },
        },
        {
          name: 'Upvote Button',
          text: 'Upvote',
          onClick: (e: Event) => { this.upvoteSelection(e); },
        },
        {
          name: 'Previous Button',
          text: 'Previous',
          onClick: (e: Event) => { this.onPreviousSelection(e); }
        }
      ]

    });
    buttonsPanel.position.set(0, -1, -2);
    this.sceneService.addToScene(buttonsPanel);
    this.artworksLength = this.artworks.length;
    this.selectedArtwork = signal(this.artworks[0], { equal: this.compareSelected });
    this.framesService.focusFrame(this.selectedArtwork().id);
  }

  compareSelected (o: Artwork, n: Artwork) {
    return o.id === n.id;
  }

  // Handle Artwork selection events
  onSelectArtwork (e: Event, i: number) {

    this.framesService.focusFrame(this.selectedArtwork().id);
  }


  /**
   * TODO: Select next artwork and show info panel?
   * @param e 
   */
  onNextSelection (e: Event) {
    const ind = this.selectedIndex();
    this.framesService.resetPosition(ind);
    const i = this.selectedIndex() < (this.artworksLength - 1) ? (this.selectedIndex() + 1) : 0;
    this.selectedIndex.set(i);
    this.artworksService.changeSelected(i);
    // TODO: Animate to the frame
    this.framesService.rotateFrames(-72);
    this.framesService.focusFrame(i);
  }

  onPreviousSelection (e: Event) {
    const ind = this.selectedIndex();
    this.framesService.resetPosition(ind);
    const i = (ind === 0) ? this.artworksLength - 1 : ind - 1;
    this.artworksService.changeSelected(i);
    this.selectedIndex.set(i);
    this.framesService.rotateFrames(72);
    this.framesService.focusFrame(i);

  }

  upvoteSelection (e: Event) {
    this.artworksService.upvoteSelected();
  }

  onKeyDown (e: KeyboardEvent) {
    switch (e.key)
    {
      case 'ArrowRight': this.onNextSelection(e); break;
      case 'ArrowLeft': this.onPreviousSelection(e); break;
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
