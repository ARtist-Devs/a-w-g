import { Injectable } from '@angular/core';

import { BackSide, BoxGeometry, Color, CylinderGeometry, EdgesGeometry, ExtrudeGeometry, Group, IcosahedronGeometry, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, PlaneGeometry, RingGeometry, ShaderMaterial, Shape, SphereGeometry } from 'three';

import { DebugService } from './debug.service';
import { InteractionsService } from './interactions.service';
import { MaterialsService } from './materials.service';

@Injectable({
  providedIn: 'platform'
})
export class ObjectsService {
  private boxGeometry = new BoxGeometry(1, 1, 1);
  private sphereGeometry = new SphereGeometry(15, 32, 16);
  private basicMaterial = new MeshBasicMaterial({ color: 0xffff00 });
  private material = this.materials.getRandomColoredMaterial();
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
    private debug: DebugService
  ) {
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

  createIcosahedron (options?: any) {
    const ops = Object.assign({ radius: 1.5, detail: 0 }, options);
    let material = this.materials.getRandomColoredMaterial();
    if (ops.material)
    {
      this.materials.getMaterial(ops.material);
    }
    const shape = new Mesh(
      new IcosahedronGeometry(ops.radius, ops.detail),
      this.materials.getRandomColoredMaterial()
    );


    shape.scale.x = 1.3;
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

  createFrame () {


    const geometry = new CylinderGeometry(3, 3, 20, 32);

  }

  createHeart () {
    const extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
    const x = 0, y = 0;

    const heartShape = new Shape()
      .moveTo(x + 25, y + 25)
      .bezierCurveTo(x + 25, y + 25, x + 20, y, x, y)
      .bezierCurveTo(x - 30, y, x - 30, y + 35, x - 30, y + 35)
      .bezierCurveTo(x - 30, y + 55, x - 10, y + 77, x + 25, y + 95)
      .bezierCurveTo(x + 60, y + 77, x + 80, y + 55, x + 80, y + 35)
      .bezierCurveTo(x + 80, y + 35, x + 80, y, x + 50, y)
      .bezierCurveTo(x + 35, y, x + 25, y + 25, x + 25, y + 25);
    const heartMesh = this.addShape(heartShape, extrudeSettings, 0xf00000, 60, 100, 0, 0, 0, Math.PI, 0.003);
    return heartMesh;

  }

  createRoundedRect (ops: { x: number, y: number, width: number, height: number, radius: number, }) {
    const extrudeSettings = { depth: 1, bevelEnabled: true, bevelSegments: 3, steps: 3, bevelSize: 2, bevelThickness: 0.5 };
    const roundedRectShape = new Shape();
    roundedRectShape.moveTo(ops.x, ops.y + ops.radius);
    roundedRectShape.lineTo(ops.x, ops.y + ops.height - ops.radius);
    roundedRectShape.quadraticCurveTo(ops.x, ops.y + ops.height, ops.x + ops.radius, ops.y + ops.height);
    roundedRectShape.lineTo(ops.x + ops.width - ops.radius, ops.y + ops.height);
    roundedRectShape.quadraticCurveTo(ops.x + ops.width, ops.y + ops.height, ops.x + ops.width, ops.y + ops.height - ops.radius);
    roundedRectShape.lineTo(ops.x + ops.width, ops.y + ops.radius);
    roundedRectShape.quadraticCurveTo(ops.x + ops.width, ops.y, ops.x + ops.width - ops.radius, ops.y);
    roundedRectShape.lineTo(ops.x + ops.radius, ops.y);
    roundedRectShape.quadraticCurveTo(ops.x, ops.y, ops.x, ops.y + ops.radius);
    const rectMesh = this.addShape(roundedRectShape, extrudeSettings, 0xffffff, ops.width / 2, 0, 0, 0, 0, 0, 1);


    return rectMesh;

  }

  // @ts-ignore
  addShape (shape, extrudeSettings, color, x, y, z, rx, ry, rz, s) {

    let geometry = new ExtrudeGeometry(shape, extrudeSettings);

    let mesh = new Mesh(geometry, new MeshPhongMaterial({ color: color }));
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.scale.set(s, s, s);
    return mesh;

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
