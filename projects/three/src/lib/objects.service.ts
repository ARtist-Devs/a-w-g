import { Injectable } from '@angular/core';

import { BackSide, BoxGeometry, Color, CylinderGeometry, EdgesGeometry, GridHelper, Group, IcosahedronGeometry, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, PlaneGeometry, RingGeometry, ShaderMaterial, SphereGeometry } from 'three';

import { InteractionsService } from './interactions.service';
import { MaterialsService } from './materials.service';
import { DebugService } from './debug.service';
import { Colors } from './colors';

@Injectable({
  providedIn: 'root'
})
export class ObjectsService {
  private boxGeometry = new BoxGeometry(1, 1, 1);
  private sphereGeometry = new SphereGeometry(15, 32, 16);
  private material = new MeshBasicMaterial({ color: 0xffff00 });

  private reticle: Mesh;
  boxDefaultOptions = {
    scale: 1,
    position: { x: 0, y: 1.6, z: 2 },
    name: 'box',
    material: this.material,
    cb: (e: Event) => { console.log('Collided with a box ', e); }
  };

  sphereDefaultOptions = {
    name: 'sphere',
    interactive: true,
  };

  constructor(
    private interactions: InteractionsService,
    private materials: MaterialsService,
    // private debug: DebugService
  ) {
    this.material = this.materials.getRandomColoredMaterial();
  }

  createReticle () {
    const reticle = new Mesh(
      new RingGeometry(0.15, 0.2, 32).rotateX(- Math.PI / 2),
      new MeshBasicMaterial()
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    this.reticle = reticle;
    return this.reticle;
  }

  createIcosahedron (ops?: any) {
    const shape = new Mesh(
      new IcosahedronGeometry(ops),
      this.material
    );
    return shape;
  }

  createGround () {
    const groundGeo = new PlaneGeometry(10000, 10000);
    const groundMat = new MeshLambertMaterial({ color: 0xffffff });
    groundMat.color.setHSL(0.095, 1, 0.75);

    const ground = new Mesh(groundGeo, groundMat);
    ground.position.y = - 33;
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    return ground;

  }

  createSkyDom (ops?: any) {


    const vertexShader = document.getElementById('vertexShader').textContent;
    const fragmentShader = document.getElementById('fragmentShader').textContent;
    const uniforms = {
      'topColor': { value: new Color(0x0077ff) },
      'bottomColor': { value: new Color(0xffffff) },
      'offset': { value: 33 },
      'exponent': { value: 0.6 }
    };
    uniforms['topColor'].value.copy(ops.color);

    // scene.fog.color.copy(uniforms['bottomColor'].value);

    const skyGeo = new SphereGeometry(4000, 32, 15);
    const skyMat = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: BackSide
    });

    const sky = new Mesh(skyGeo, skyMat);
    return sky;
  }

  createBackground (ops?: any) { }

  createSphere (options?: any) {
    const ops = Object.assign({}, this.sphereDefaultOptions, options);
    const sphere = new Mesh(this.sphereGeometry, ops.material || this.materials.getRandomColoredMaterial());
    sphere.name = ops.name;

    if (ops.interactive)
    {
      // this.interactions.addToColliders({ name: ops.name, mesh: sphere, cb: ops.cb });
    }

    return sphere;
  }

  createBox (options?: any) {
    const ops = Object.assign({}, this.boxDefaultOptions, options);
    const object = new Mesh(this.boxGeometry, ops.material || this.materials.getRandomColoredMaterial());

    object.position.set(ops.position.x, ops.position.y, ops.position.z);
    object.name = ops.name;
    // this.interactions.addToColliders({ name: ops.name, mesh: object, cb: ops.cb });
    return object;
  }

  // createGround (ops?: any) {
  //   // ground
  //   const ground = new Mesh(new PlaneGeometry(200, 200), new MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
  //   ground.rotation.x = - Math.PI / 2;
  //   this.scenes.addToScene(ground);

  //   var grid = new GridHelper(200, 40, 0x000000, 0x000000);
  //   this.scenes.addToScene(grid);

  // }

  createNav (ops?: any) {
    const nav = new Group();
    const geometry = new BoxGeometry(5, 5, 5);
    const material = new MeshPhongMaterial({ color: 0xAAAA22 });
    const edges = new EdgesGeometry(geometry);
    const line = new LineSegments(edges, new LineBasicMaterial({ color: 0x000000, linewidth: 2 }));
    for (let x = -100;x < 100;x += 10)
    {
      for (let z = -100;z < 100;z += 10)
      {
        if (x == 0 && z == 0) continue;
        const box = new Mesh(geometry, material);
        box.position.set(x, 2.5, z);
        const edge = line.clone();
        edge.position.copy(box.position);
        nav.add(box);
        nav.add(edge);
        // this.colliders.push(box);
      }
    }
    nav.name = 'nav';
    // this.scenes.addToScene(nav);
    return nav;
  }

  createBoxes (ops?: any) {
    const length = ops.number || 1000;
    const position = ops.position || 40;
    const boxes = [];
    for (let i = 0;i < length;i++)
    {

      const object = new Mesh(this.boxGeometry, this.materials.getRandomColoredMaterial());

      object.position.x = Math.random() * 40 - 20;
      object.position.y = Math.random() * 1.6;
      object.position.z = Math.random() * position - 20;

      object.rotation.x = Math.random() * 2 * Math.PI;
      object.rotation.y = Math.random() * 2 * Math.PI;
      object.rotation.z = Math.random() * 2 * Math.PI;

      object.scale.x = Math.random() + 0.5;
      object.scale.y = Math.random() + 0.5;
      object.scale.z = Math.random() + 0.5;
      // this.scenes.addToScene(object);
      // this.debug.addToDebug({ obj: object,  properties: ['Position', 'Color'] });
      object.name = 'box' + i;
      // TODO: add interactions
      // this.interactions.addToColliders({ name: object.name, mesh: object, cb: (e: Event) => { console.log('Collided with a box ', e); } });
      boxes.push(object);
    }
    return boxes;
  }
}
