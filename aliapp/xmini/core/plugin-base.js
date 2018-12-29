// import { Emitter } from '../utils/index';
import Core from './core';

class PluginBase extends Core {
  name = 'base';
  constructor(config) {
    super(config);
    // this.bindEvents();
  }

  // bindEvents() {}

  // getConfig() {
  //   return core.getConfig();
  // }
}

export default PluginBase;
