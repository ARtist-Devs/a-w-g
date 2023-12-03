/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';

import { Artwork } from 'projects/three/src/lib/artwork';
import { ArtworkFramesService, LoadersService, SceneService, UIService } from 'projects/three/src/public-api';
import { ArtworksService } from '../artworks.service';
import * as  TWEEN from 'three/examples/jsm/libs/tween.module';
import { Color } from 'three';

@Component( {
  selector: 'art-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
} )
export class GalleryComponent implements OnInit {

  public loadingBar = true;
  public loadingClass = 'loading';
  public loadingProgress: WritableSignal<number> = signal( 0 );
  public frames: any;
  private artworks: Artwork[] = [];
  private artworksLength = 0;

  private buttons: any[];
  private focused = 0;
  tweens: any[] = [];

  private selectedArtwork: WritableSignal<Artwork>;
  @ViewChild( 'canvas', { static: true } )
  canvas!: ElementRef<HTMLCanvasElement>;

  private get canvasEl (): HTMLCanvasElement {
    return this.canvas?.nativeElement;
  }

  constructor(
    public loadersService: LoadersService,
    public sceneService: SceneService,
    private artworksService: ArtworksService,
    private framesService: ArtworkFramesService,
    private ui: UIService,
  ) { }

  // Init the WebXR scene with Artworks
  ngOnInit () {
    const start = Date.now();
    this.artworks = this.artworksService.getArtworks();
    const afterSceneInitCB = this.sceneService.initScene( this.canvasEl );

    // Model for Floor
    const model = this.loadersService.loadModel( {
      path: "assets/models/VRGallery0110NoFloorTexture.glb",
      scene: this.sceneService.scene,
      onLoadProgress: this.onLoadProgress.bind( this ),
      onLoadCB: () => {
        this.sceneService.addToScene( this.frames );
        this.loadingBar = false;
      }
    } );

    // Model for Walls
    const modelWalls = this.loadersService.loadModel( {
      path: "assets/models/VRGalleryInnerWalls0110Merge.glb",
      scene: this.sceneService.scene,
      onLoadProgress: this.onLoadProgress.bind( this ),
      onLoadCB: () => {
        afterSceneInitCB( start );
      }
    } );

    // Frames
    // Buttons
    this.buttons = [
      {
        name: 'Next Button',
        text: 'Next',
        onClick: ( ind: number ) => { this.changeSelection( ind, 1 ); },
        position: { x: -0.75, y: 0, z: -0.0 },
        rotation: {}
      },

      {
        name: 'Upvote Button',
        text: 'Upvote',
        onClick: ( ind: number ) => { this.upvoteSelection( ind ); },
        position: { x: -0.8, y: 0.8, z: -0.1 },
        rotation: {}
      },
      {
        name: 'Previous Button',
        text: 'Previous',
        onClick: ( ind: number ) => { this.changeSelection( ind, -1 ); },
        position: { x: 0.75, y: 0, z: -0. },
        rotation: {}
      }
    ];

    this.frames = this.framesService.createFrames( this.artworks, this.buttons, afterSceneInitCB );
    console.log( this.frames.children );

    this.frames.children.forEach( ( frame: any ) => {
      const col = new Color( Math.random() * 0xffffff );
      const tween = new TWEEN.Tween( frame.children[0].material.color )
        .to(
          col,
          1000
        );
      this.tweens.push( tween );
      this.sceneService.renderFunctions.push( () => tween.update() );

      // Target color
      // easing: TWEEN.Easing.Cubic.In, // Easing function
      // duration: 1000 // Duration in milliseconds

      // this.sceneService.renderFunctions.push( this.ui.update );
    } );

    // UI
    this.sceneService.renderFunctions.push( this.ui.update );

    this.artworksLength = this.artworks.length;

    this.selectedArtwork = signal( this.artworks[0], { equal: this.compareSelected } );
  }

  onLoadProgress ( xhr: ProgressEvent ) {
    // console.log( 'OnProgress is running loaded ', xhr );
    // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  }


  compareSelected ( o: Artwork, n: Artwork ) {
    return o ? o.id === n.id : true;
  }

  // Handle Artwork selection events
  onSelectArtwork () {
    this.framesService.focusFrame( this.selectedArtwork().id );
  }

  /**
   * TODO: Select next artwork and show info panel?
   * @param e
   */
  changeSelection ( ind: any, n: number ) {
    console.log( "Selection is changing", ind, n );
    this.framesService.resetPosition( this.focused );
    let i;
    if ( n === 1 )// Next
    {
      i = ind < ( this.artworksLength - 1 ) ? ( ind + 1 ) : 0;
      this.framesService.rotateFrames( 72 );//Rotate right
    } else if ( n === -1 ) { // Previous
      i = ( ind === 0 ) ? this.artworksLength - 1 : ind - 1;
      this.framesService.rotateFrames( -72 );
    }
    this.focused = i;
    this.tweens[ind].start();
    this.framesService.focusFrame( i );

  }

  upvoteSelection ( i: number ): void {
    this.artworksService.upvoteArtwork( i );
    const name = `${i} Text`;
    const textMesh = this.frames.children[i].getObjectByName( name );
    this.ui.updateVote( { votes: this.artworks[i].votes, text: textMesh } );
  }
}
