import { Injectable } from '@angular/core';
import { Color, HemisphereLight } from 'three';

import * as ThreeMeshUI from 'three-mesh-ui';
import { DebugService } from './debug.service';
import { InteractionsService } from './interactions.service';


@Injectable( {
  providedIn: null
} )
export class UIService {

  public selectState = false;
  private FontJSON = 'assets/fonts/Roboto-msdf.json';
  private FontImage = 'assets/fonts/Roboto-msdf.png';
  private container: any;
  private votes: any;
  private description: any;
  private title: any;

  private buttonOptions = {
    width: 0.4,
    height: 0.15,
    justifyContent: 'center',
    offset: 0.05,
    margin: 0.02,
    borderRadius: 0.075
  };

  defaultOptions = {
    name: 'Button Panel Container',
    buttons: [{
      name: 'Next Button',
      text: 'Next',
      onHover: ( e: Event ) => { console.log( `Next Button is hovered` ); },
      buttonOptions: {
        width: 0.4,
        height: 0.15,
        justifyContent: 'center',
        offset: 0.05,
        margin: 0.02,
        borderRadius: 0.075
      }
    }, {
      name: 'Prev Button',
      text: 'Previous',
      onHover: ( e: Event ) => { console.log( `Previous Button is hovered` ); },
      buttonOptions: {
        width: 0.4,
        height: 0.15,
        justifyContent: 'center',
        offset: 0.05,
        margin: 0.02,
        borderRadius: 0.075
      }
    }]

  };

  private idleStateAttributes = {
    state: 'idle',
    attributes: {
      width: 0.4,
      height: 0.15,
      offset: 0.035,
      backgroundColor: new Color( 0x666666 ),
      backgroundOpacity: 0.3,
      fontColor: new Color( 0xffffff )
    },
    onSet: ( e: any ) => { }
  };

  private hoveredStateAttributes = {
    state: 'hovered',
    attributes: {
      width: 0.4,
      height: 0.15,
      offset: 0.035,
      backgroundColor: new Color( 0x999999 ),
      backgroundOpacity: 1,
      fontColor: new Color( 0xffffff )
    },
    onSet: ( e: any ) => {
    }
  };

  private selectedAttributes =
    {
      offset: 0.02,
      backgroundColor: new Color( 0x777777 ),
      fontColor: new Color( 0x222222 )
    };

  light: any;
  hemLight = new HemisphereLight( 0x808080, 0x606060 );

  lightsService: any;
  selected: number = 0;
  selection: any[] = [1, 2, 3];

  constructor(
    private interactions: InteractionsService,
    private debug: DebugService,
  ) { }

  // TODO: Needs to calculate position based on the artwork or the biggest width
  createMoreInfoPanels ( ops?: any ) {

    // Container
    const container = new ThreeMeshUI.Block( {
      ref: "container",
      padding: 0.02,
      fontFamily: this.FontJSON,
      fontTexture: this.FontImage,
      fontColor: new Color( 0xffffff ),
      fontSize: 0.3,
      backgroundOpacity: 0.5,
      width: 1,
      height: 2,
    } );

    // Rotate container to towards the painting
    container.rotation.y = -0.5;
    container.name = `More Info Panel ${ops.id}`;

    // Title
    const title = new ThreeMeshUI.Block( {
      height: 0.2,
      width: 0.9,
      margin: 0.05,
      justifyContent: "center",
      fontSize: 0.1,
    } );

    const titleText = new ThreeMeshUI.Text( {
      content: `${ops.title} `,
    } );

    titleText.name = `${ops.id} Text`;

    title.add( titleText );
    title.name = `Painting ${ops.id} title`;
    this.title = title;
    container.add( this.title );
    // - Title

    // Description
    const description = new ThreeMeshUI.Block( {
      height: 1.6,
      width: 0.9,
      margin: 0.01,
      padding: 0.02,
      fontSize: 0.15,
      alignItems: "start",
      textAlign: 'justify',
      backgroundOpacity: 0,
      bestFit: 'auto',
    } ).add(
      new ThreeMeshUI.Text( {
        content:
          ops.description,
      } )
    );
    description.name = 'Artwork Description';

    const contentContainer = new ThreeMeshUI.Block( {
      padding: 0.02,
      margin: 0.025,
      backgroundOpacity: 0.2,
      height: 1.6,
      width: 0.9,
      justifyContent: "center",
      bestFit: 'grow',
      fontSize: 5,
    } );

    contentContainer.name = 'Content Container';
    this.description = description;

    contentContainer.add( this.description );
    container.add( contentContainer );

    return container;

  }

  updateInfoPanel ( ops?: any ) {
    this.description.children[1].set( { content: String( ops.description ) } );
    this.title.children[1].set( { content: String( `${ops.title}: ${ops.votes} likes` ) } );
  }

  //TODO: only update the vote onPanel
  updateVote ( ops?: any ) {
    const c = `${ops.text.content.split( ':' )[0]} : ${ops.votes} likes`;
    ops.text.set( { content: c } );
  }

  createInteractiveButtons ( options: any ) {

    const ops = Object.assign( {}, this.defaultOptions, options );
    const container = new ThreeMeshUI.Block(
      {
        justifyContent: 'center',
        contentDirection: 'row-reverse',
        fontFamily: this.FontJSON,
        fontTexture: this.FontImage,
        fontSize: 0.1,
        padding: 0.02,
        borderRadius: 0.11,
        height: 0.2,
        width: options.buttons.length / 2,
      }
    );
    container.name = ops.name;
    this.container = container;

    ops.buttons.forEach( ( o: any, i: number ) => {
      const button = this.createButton( ops.id, o );
      this.container.add( button );
    } );

    return container;

  };

  createButton ( id: number, ops?: any ) {
    const btn = new ThreeMeshUI.Block( this.buttonOptions );
    btn.name = `Frame ${id} ${ops.name}`;

    btn.add( new ThreeMeshUI.Text( {
      content: ops.text,
      name: `${ops.name} Text`,
    } ) );

    // @ts-ignore
    btn.setupState( {
      state: 'selected',
      attributes: this.selectedAttributes,
      // onSet: (e: any) => {

      // }
    } );

    // @ts-ignore
    btn.setupState( this.idleStateAttributes );
    // @ts-ignore
    btn.setupState( this.hoveredStateAttributes );

    btn.position.set( -0.5, 0, 0 );
    this.interactions.addToInteractions( btn );
    this.interactions.addToColliders( { mesh: btn, name: ops.name, cb: () => { ops.onClick( id ); } } );
    // @ts-ignore
    btn.addEventListener( 'click', () => { ops.onClick( id ); } );

    return btn;
  }

  update () {
    ThreeMeshUI.update();
  }

}
