import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';

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

  private artworks: Artwork[];

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
  ) { }

  // Init the WebXR scene with Artworks
  ngOnInit () {
    this.artworks = this.artworksService.getArtworks();
    this.sceneService.initScene(this.canvasEl);
    const frames = this.framesService.createFrames(this.artworks);
    this.sceneService.renderFunctions.push(this.framesService.update);
    this.sceneService.addToScene(frames);

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
  }

  // Handle Artwork selection events
  onSelectArtwork (e: Event) {

  }

  onNextSelection (e: Event) {

  }

  onPreviousSelection (e: Event) { }

  upvoteSelection (e: Event) { }

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
