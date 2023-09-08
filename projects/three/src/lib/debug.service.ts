import { Injectable } from '@angular/core';
import GUI from 'lil-gui';

@Injectable({
  providedIn: 'root'
})
export class DebugService {
  gui: any;
  positionOptions = {
    min: -20,
    max: 20,
  };

  intensityOptions = {
    min: 0,
    max: 1000,
    precision: 10,
  };


  constructor() { }

  addToDebug (options: any) {
    // console.log(`Adding ${options.name || options.obj.name} to Debug addToDebug options: `, options);

    if (!this.gui)
    {
      this.gui = new GUI({ closeFolders: true, });
      this.gui.open(false);
    }

    const folder = this.gui.addFolder(`${options.name || options.obj.name}`);

    for (const [key, values] of Object.entries(options.properties))
    {
      switch (key)
      {
        case 'Position' || 'position':
          this.addPosition(options, folder, values); break;
        case 'Color' || 'color':
          this.addColor(options, folder, values); break;
        case 'Intensity' || 'intensity':
          this.addIntensity(options, folder, values); break;
        case 'Rotation' || 'rotation':
          this.addRotation(options, folder, values); break;
        case 'Scale' || 'scale':
          this.addScale(options, folder, values); break;
        case 'LookAt' || 'lookAt':
          const lookAtfolder = folder.addFolder('LookAt');
          this.addPosition(options, lookAtfolder, values); break;
        default:

          break;
      }
    }
  }

  addScale (ops: any, folder: any, values?: any) {
    const scale = folder.addFolder('Scale');
    const vals = Object.assign({}, { min: 0, max: 100, precision: 1 }, values);

    scale.add(ops.obj.scale, 'x', vals.min, vals.max, vals.precision);
    scale.add(ops.obj.scale, 'y', vals.min, vals.max, vals.precision);
    scale.add(ops.obj.scale, 'z', vals.min, vals.max, vals.precision);

  }

  addRotation (ops: any, folder: any, values?: any) {
    // console.log(`Adding Rotations for ${ops.name || ops.obj.name} to Debug addToDebug options, values: `, ops, values);

    const rotation = folder.addFolder('Rotation');
    const vals = Object.assign({}, { min: 0, max: 360, precision: 1 }, values);

    rotation.add(ops.obj.rotation, 'x', vals.min, vals.max, vals.precision);
    rotation.add(ops.obj.rotation, 'y', vals.min, vals.max, vals.precision);
    rotation.add(ops.obj.rotation, 'z', vals.min, vals.max, vals.precision);
  }

  addIntensity (ops: any, folder: any, values?: any) {
    const intensity = folder.addFolder('Intensity');
    const vals = Object.assign({}, this.intensityOptions, values);

    intensity.add(ops.obj, 'intensity', vals.min, vals.max, vals.precision);

  }

  /**
   * addColor - adds a color picker to the debug panel 
   * obj, properties, folder
   * @param ops 
   * @param folder 
   */
  addColor (ops: any, folder: any, values?: any) {
    const color = folder.addFolder('Color');
    // console.log('Debug addColor ops', ops.obj.name, ops.obj.backgroundMaterial)
    // folder.addColor(ops.obj, ops.obj.backgroundMaterial.color)
    // color.addColor(ops.obj.material, 'color')
    // .onChange((e: any) => {
    //   ops.obj.material.color.set(e);
    //   console.log('Debug changed color ', e);
    // });
    // color.open();
  };

  addPosition (ops: any, folder: any, values?: any) {

    // console.log(`Adding Position for ${ops.name || ops.obj.name} to  addToDebug options, values: `, ops, values);

    const pos = folder.addFolder('Position');
    const vals = Object.assign({}, this.positionOptions, values);

    pos.add(ops.obj.position, 'x', vals.min, vals.max, vals.precision)
      .onChange((e: any) => {
        // ops.obj.position.x = e;
        console.log('Debug changed x ', e);
      });
    pos.add(ops.obj.position, 'y', vals.min, vals.max, vals.precision)
      .onChange((e: any) => {
        // ops.obj.position.y = e;
        console.log('Debug changed y ', e);
      });
    pos.add(ops.obj.position, 'z', vals.min, vals.max, vals.precision)
      .onChange((e: any) => {
        // ops.obj.position.z = e;
        console.log('Debug changed z', e);
      });
    pos.open();
  }
}
