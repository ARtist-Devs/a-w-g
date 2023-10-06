import { Colors } from './colors';

export const uiButtonDefaults = {
  width: 0.4,
  height: 0.15,
  justifyContent: 'center',
  offset: 0.05,
  margin: 0.02,
  borderRadius: 0.075,
  backgroundColor: Colors.buttonBackground,
  fontColor: Colors.buttonFontColor,
};

/**
 * TODO: Currently not being used
 */
export const uiDefaults = {
  container: {
    height: 0.5,
    width: 1.3,
    justifyContent: 'center',
    textAlign: 'left',
    contentDirection: 'row-reverse',
    fontFamily: 'assets/fonts/Roboto-msdf.json',
    fontTexture: 'assets/fonts/Roboto-msdf.png',
    fontSize: 0.07,
    padding: 0.02,
    borderRadius: 0.11,
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
        backgroundColor: Colors.hoveredBackground,
        backgroundOpacity: 0.9,
        fontColor: Colors.hoveredFontColor,
      },
    },
    selectedAttributes: {
      offset: 0.02,
      backgroundColor: Colors.buttonBackground,
      fontColor: Colors.buttonFontColor,
    }
  },
  moreInfoButton: {

  },
};

export const cameraDefaults = {
  name: 'Default Camera',
  type: 'Perspective',
  near: 0.1,
  far: 200,// TODO: lower for production
  fov: 40,
  width: window.innerWidth || 500,
  height: window.innerHeight || 700,
  position: { x: 0, y: 1.6, z: 0 },//important for xr
  rotation: { x: 0, y: 0, z: 0 },

};

export const lightDefaults = {
  name: 'Default Light',
  type: 'directional',
  x: 2,
  y: 10,
  z: -2,
  color: 0xffffff,
  intensity: 2,
  width: 10,
  near: 0.1,
  far: 30,
  castShadow: true,
  useHelpers: false,
  helper: true
};

export const controlDefaults = {
  type: 'orbit',
};

export const sceneDefaults = {
  camera: cameraDefaults,
  width: window.innerWidth || 400,
  height: window.innerHeight || 700,
  lights: lightDefaults,
  xrMode: 'inline',
  controls: controlDefaults,
  background: Colors.background,
  fog: { color: 0x000000, near: 1500, far: 4000 },
};

export const containerOptions = {
  height: 0.5,
  width: 1.3,
  justifyContent: 'center',
  textAlign: 'left',
  contentDirection: 'row-reverse',
  fontFamily: 'assets/fonts/Roboto-msdf.json', // this.FontJSON,
  fontTexture: 'assets/fonts/Roboto-msdf.png',// this.FontImage,
  fontSize: 0.07,
  padding: 0.02,
  borderRadius: 0.11,
};
