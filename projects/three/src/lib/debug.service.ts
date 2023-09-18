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
    max: 10,
    precision: 1,
  };


  constructor() { }

  addToDebug (options: any) {

    if (!this.gui)
    {
      this.gui = new GUI({ closeFolders: true });
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

    color.addColor(ops.obj, 'color')
      .onChange((e: any) => {
        ops.obj.color.set(e);
      });
    color.open();
  };

  addPosition (ops: any, folder: any, values?: any) {

    const pos = folder.addFolder('Position');
    const vals = Object.assign({}, this.positionOptions, values);

    pos.add(ops.obj.position, 'x', vals.min, vals.max, vals.precision)
      .onChange((e: any) => {
        ops.obj.position.x = e;
      });
    pos.add(ops.obj.position, 'y', vals.min, vals.max, vals.precision)
      .onChange((e: any) => {
        // ops.obj.position.y = e;
      });
    pos.add(ops.obj.position, 'z', vals.min, vals.max, vals.precision)
      .onChange((e: any) => {
        // ops.obj.position.z = e;
      });
    pos.open();
  }
}
