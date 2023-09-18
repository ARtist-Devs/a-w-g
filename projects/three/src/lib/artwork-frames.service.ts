import { Injectable } from '@angular/core';

import gsap from 'gsap';
import { BoxGeometry, Group, LinearFilter, MathUtils, Mesh, MeshBasicMaterial, MeshPhongMaterial, MeshStandardMaterial, Object3D, SRGBColorSpace, UVMapping, Vector3, } from 'three';

import { Artwork } from './artwork';
import { ObjectsService } from './objects.service';
import { InteractionsService } from './interactions.service';
import { UIService } from './ui.service';
import { DebugService } from './debug.service';
import { LoadersService } from './loaders.service';
import { MaterialsService } from './materials.service';
import { LightsService } from './lights.service';

@Injectable({
  providedIn: 'root'
})
export class ArtworkFramesService {
  frameDistance = 7;
  angle = 0;
  frames: Group[] = [];
  focusPosition: any;
  locations: any[] = [];
  focusFactor = 4;

  framesGroup = new Group();
  artworksWithLocation: Artwork[];
  frameButton = this.objectsService.createIcosahedron(0.12);
  likeButton = this.objectsService.createHeart();

  constructor(
    private objectsService: ObjectsService,
    private interactionsService: InteractionsService,
    private lightsService: LightsService,
    private loadersService: LoadersService,

    private materialsService: MaterialsService,
    private uiService: UIService,
    private debug: DebugService,

  ) { }

  createFrames (artworks: Artwork[] = [], btns: any[] = [], cb?: Function): Group {
    this.framesGroup.name = 'Frames Group';
    this.angle = (Math.PI * 2) / artworks.length;
    this.frames = artworks.map((artwork, i) => {
      const f = this.placeFrame(this.createFrame(artwork, btns), i);
      return f;
    });

    this.framesGroup.add(...this.frames);

    this.framesGroup.position.set(0, 1.6, 0);
    this.focusFrame(0);
    if (cb) cb();
    return this.framesGroup;
  }

  /**
   * Distributes frames based on their index
   * @param frame artframe
   * @param i index
   * @returns frame with location
   */
  placeFrame (frame: Group, i: number = 0) {
    const alpha = Math.PI - i * this.angle;
    const x = Math.sin(alpha) * this.frameDistance;// 0 - 1
    const z = Math.cos(alpha) * this.frameDistance;// 0 - 0 
    frame.position.set(x, 0, z);
    frame.scale.set(1.3, 1.3, 1.3);
    frame.rotation.y = alpha;
    frame.userData['originalPosition'] = frame.position.clone();
    console.log("frame.userData['originalPosition'] ", frame.userData['originalPosition']);
    const light = this.lightsService.createDirLight({ intensity: 0.4, helper: true })[0]; //, helper: false
    light.castShadow = true;
    // @ts-ignore
    light.position.set(Math.sin(alpha), 2, Math.cos(alpha));
    // @ts-ignore
    light.name = `${frame.name} dir light`;
    // @ts-ignore
    light.target.position.set(x, 0, z);
    // @ts-ignore
    light.target.updateWorldMatrix();


    // @ts-ignore
    // const l = this.lightsService.createSpotLight();
    // // @ts-ignore
    // l.target = frame.children[0];
    // @ts-ignore

    // frame.add(l, l.target);
    console.log(frame);
    return frame;
  }

  /**
   * Creates artframes with the textured canvas in the middle
   * @param artwork 
   * @param i 
   * @returns 
   */
  createFrame (artwork: Artwork, btns: any[] = []): Group {
    const frameGroup = new Group();
    frameGroup.name = ` ${artwork.title} frame group`;
    //Use the componenet options or take the default values

    // Create the frame geometry & canvas geometry
    const frameGeometry: any = new BoxGeometry(1.5, 2, 0.2);
    // @ts-ignore
    const canvasGeometry = new BoxGeometry(artwork?.width / 100, artwork?.height / 100, 0.3);

    // Create the canvas material with the texture
    const texture = this.loadersService.loadTexture(artwork.textureUrl);
    texture.colorSpace = SRGBColorSpace;
    texture.minFilter = texture.magFilter = LinearFilter;
    texture.mapping = UVMapping;

    const canvasMaterial = new MeshPhongMaterial({ map: texture, color: 0xffffff });
    const frameMaterial = new MeshStandardMaterial({ color: 0xffffff });


    // Create the frame & canvas mesh

    const frameMesh = new Mesh(frameGeometry, frameMaterial);

    const canvasMesh = new Mesh(canvasGeometry, canvasMaterial);
    frameMesh.name = ` ${artwork.title} frame mesh` || 'frame';
    canvasMesh.name = ` ${artwork.title} canvas mesh` || 'frame canvas';

    const l = this.lightsService.createSpotLight();
    // @ts-ignore
    l.target = frameMesh;
    // @ts-ignore
    frameGroup.add(frameMesh, canvasMesh, l);
    btns.forEach((b, i) => {
      const button = this.createButton(b, artwork.id);
      frameGroup.add(button);
    });
    // console.log('InteractionManager after button creation ', this.interactionsService.interactionManager.interactiveObjects);
    // this.debug.addToDebug({ obj: l, name: 'Frame Spot Lights', properties: { 'Position': {}, 'Rotation': {}, 'Intensity': {}, Color: {} } });
    const moreInfoPanel = this.uiService.createMoreInfoPanels({
      id: artwork.id,
      title: artwork.title,
      description: artwork.description,
      votes: artwork.votes
    });

    moreInfoPanel.quaternion.copy(frameMesh.quaternion);
    moreInfoPanel.position.x = 1.3;
    moreInfoPanel.rotateY(-72);//TODO: look at the angle it is created
    // this.debug.addToDebug({ obj: moreInfoPanel, name: 'UI Panel', properties: { 'Position': {}, 'Rotation': {} } });
    frameGroup.add(moreInfoPanel);

    return frameGroup;
  }


  createButton (ops: any, i: number) {
    let button;
    if (ops.shape === 'heart')
    {
      button = this.likeButton.clone();
      button.rotateZ(Math.PI / 4);
    } else
    {
      button = this.frameButton.clone();
    }

    button.name = `Frame ${i} ${ops.name}`;
    button.position.set(ops.position.x, ops.position.y, ops.position.z);
    this.interactionsService.addToInteractions(button);
    this.interactionsService.addToColliders({ mesh: button, name: ops.name, cb: () => { ops.onClick(i); } });
    // @ts-ignore
    button.addEventListener('click', (e) => { ops.onClick(i); });

    return button;
  }


  focusFrame (i: number) {

    const f = this.frames[i];
    const x = f.position.x / this.frameDistance * this.focusFactor;
    const z = f.position.z / this.frameDistance * this.focusFactor;
    const p = new Vector3(x, f.position.y, z);
    this.moveFrame(f, p);

  }

  resetPosition (i: number) {
    const f = this.frames[i];
    const p = f.userData['originalPosition'];
    this.moveFrame(f, p);
  }

  // TODO: use Three animation system?
  moveFrame (f: any, p: any) {
    gsap.to(f.position, {
      // @ts-ignore
      x: p.x, y: p.y, z: p.z, duration: 2.5
    });
  }

  rotateFrames (angle: number = 72) {
    const y = MathUtils.degToRad(angle) + this.framesGroup.rotation.y;
    gsap.to(this.framesGroup.rotation, { y: y, duration: 1 });
    // this.framesGroup.rotateY(MathUtils.degToRad(angle));
  }

};
