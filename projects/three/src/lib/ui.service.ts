import { Injectable } from '@angular/core';
import { Color, HemisphereLight, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';

import * as ThreeMeshUI from 'three-mesh-ui';
// import { InteractionsService } from './interactions.service';
// import { DebugService } from './debug.service';
import { Colors } from './colors';


@Injectable({
  providedIn: 'root'
})
export class UIService {

  FontJSON = 'assets/fonts/Roboto-msdf.json';
  FontImage = 'assets/fonts/Roboto-msdf.png';
  public selectState = false;
  private container: any;
  votes: any;
  description: any;
  title: any;

  private containerOptions: any = {
    justifyContent: 'center',
    contentDirection: 'row-reverse',
    fontSize: 0.07,
    padding: 0.02,
    borderRadius: 0.11,
    height: 0.5,
    width: 1.3,
    textAlign: 'left',
    fontFamily: this.FontJSON,
    fontTexture: this.FontImage,
    backgroundColor: Colors.red,
    rotations: { x: -0.55, y: 0, z: 0 },
    position: { x: 0, y: 0, z: 3 },
    name: 'ui panel container',
    buttons: {
      prev: {},
      next: {},
      upvote: {},
      moreInfo: {},
      tweet: {},
      takePicture: {},
    },
    hoveredStateAttributes: {
      state: 'hovered',
      attributes: {
        offset: 0.035,
        backgroundColor: new Color(0x999999),
        backgroundOpacity: 1,
        fontColor: new Color(0xffffff)
      },
    },
    idleStateAttributes: {
      state: 'idle',
      attributes: {
        offset: 0.035,
        backgroundColor: new Color(0x666666),
        backgroundOpacity: 0.3,
        fontColor: new Color(0xffffff)
      },
    },
    selectedAttributes: {
      offset: 0.02,
      backgroundColor: Colors.buttonBackground,
      fontColor: Colors.buttonFontColor,
    }
  };

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
      onClick: (e: Event) => { console.log(`Next Button is clicked`); },
      onHover: (e: Event) => { console.log(`Next Button is hovered`); },
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
      onClick: (e: Event) => { console.log(`Previous Button is clicked`); },
      onHover: (e: Event) => { console.log(`Previous Button is hovered`); },
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
      backgroundColor: new Color(0x666666),
      backgroundOpacity: 0.3,
      fontColor: new Color(0xffffff)
    },
    onSet: (e: any) => { }
  };

  private hoveredStateAttributes = {
    state: 'hovered',
    attributes: {
      width: 0.4,
      height: 0.15,
      offset: 0.035,
      backgroundColor: new Color(0x999999),
      backgroundOpacity: 1,
      fontColor: new Color(0xffffff)
    },
    onSet: (e: any) => {
      // console.log('hovered state ', e) 
    }
  };

  private selectedAttributes =
    {
      offset: 0.02,
      backgroundColor: new Color(0x777777),
      fontColor: new Color(0x222222)
    };

  light: any;
  hemLight = new HemisphereLight(0x808080, 0x606060);

  lightsService: any;
  selected: number = 0;
  selection: any[] = [1, 2, 3];

  constructor(
    // private interactions: InteractionsService,
    // private debug: DebugService,
  ) { }

  // TODO: Needs to calculate position based on the artwork or the biggest width
  createMoreInfoPanels (ops?: any) {

    // Container
    const container = new ThreeMeshUI.Block({
      ref: "container",
      padding: 0.025,
      fontFamily: this.FontJSON,
      fontTexture: this.FontImage,
      fontColor: new Color(0xffffff),
      backgroundOpacity: 0.5,
      width: 1,
      height: 1
    });

    // Rotate container to towards the painting
    container.rotation.y = -0.5;
    container.name = `More Info Panel ${ops.id}`;
    // this.debug.addToDebug({
    //   obj: container, name: 'More info Panel', properties: {
    //     'Position': { min: 0, max: 2, precision: 0.2 }
    //   }
    // })// - Container

    // Title
    const title = new ThreeMeshUI.Block({
      height: 0.2,
      width: 0.9,
      margin: 0.025,
      justifyContent: "center",
      fontSize: 0.09,
    });

    const titleText = new ThreeMeshUI.Text({
      content: `${ops.title}: ${ops.votes} `,
    });

    titleText.name = `${ops.id} Text`;

    title.add(titleText);
    title.name = `Painting ${ops.id} title`;
    this.title = title;
    container.add(this.title); // - Title

    // this.debug.addToDebug({
    //   obj: container, name: 'More info Caption', properties: {
    //     'Position': { min: 0, max: 2, precision: 0.2 }
    //   }
    // });

    // Description
    const description = new ThreeMeshUI.Block({
      height: 0.53,
      width: 0.9,
      margin: 0.01,
      padding: 0.02,
      fontSize: 0.025,
      alignItems: "start",
      textAlign: 'justify',
      backgroundOpacity: 0,
      bestFit: 'auto',
    }).add(
      new ThreeMeshUI.Text({
        content:
          ops.description,
      })
    );
    description.name = 'Artwork Description';

    const contentContainer = new ThreeMeshUI.Block({
      contentDirection: "row",
      padding: 0.02,
      margin: 0.025,
      backgroundOpacity: 0.2,
      height: 0.65,
      width: 0.9,
      justifyContent: "center",
      bestFit: 'auto'
    });

    contentContainer.name = 'Content Container';
    this.description = description;

    contentContainer.add(this.description);
    container.add(contentContainer);

    return container;

  }

  updateInfoPanel (ops?: any) {
    this.description.children[1].set({ content: String(ops.description) });
    this.title.children[1].set({ content: String(`${ops.title}: ${ops.votes} `) });
  }

  //TODO: only update the vote onPanel
  updateVote (ops?: any) {
    const c = `${ops.text.content.split(':')[0]} : ${ops.votes}`;
    ops.text.set({ content: c });
  }

  createInteractiveButtons (options?: any) {
    const ops = Object.assign({}, this.defaultOptions, options);
    const container = new ThreeMeshUI.Block(
      {
        justifyContent: 'center',
        contentDirection: 'row-reverse',
        fontFamily: this.FontJSON,
        fontTexture: this.FontImage,
        fontSize: 0.07,
        padding: 0.02,
        borderRadius: 0.11,
        height: 0.2,
        width: options.buttons.length / 2,
      }
    );

    container.name = ops.name;
    container.position.set(0, 0.6, -1.2);
    container.rotation.x = -0.55;
    this.container = container;

    ops.buttons.forEach((ops: any) => {
      const button = this.createButton(ops);
      this.container.add(button);
    });

    return container;

  };

  createButton (ops?: any) {
    const btn = new ThreeMeshUI.Block(this.buttonOptions);
    btn.name = ops.name;

    btn.add(new ThreeMeshUI.Text({
      content: ops.text,
      name: `${ops.name} Text`,
    }));

    // @ts-ignore
    btn.setupState({
      state: 'selected',
      attributes: this.selectedAttributes,
      onSet: (e: any) => {
        console.log('button state set to selected ', ops.onClick);
        // ops.onClick();
        console.log(`Button onSet  ${ops.name}`, e);
      }
    });

    // @ts-ignore
    btn.setupState(this.idleStateAttributes);
    // @ts-ignore
    btn.setupState(this.hoveredStateAttributes);

    btn.position.set(-0.5, 0, 0);

    // this.interactions.addToColliders({ mesh: btn, name: ops.name, cb: ops.onClick })

    // this.container.add(btn);
    return btn;
  }

  updateButtons () {
    console.log('Update buttons ');
  }

  update () {
    ThreeMeshUI.update();
  }

}


