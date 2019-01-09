import PluginBase from '../core/plugin-base';

class PluginDemo extends PluginBase {
  name = 'demo2';
  events = {
    prePageOnShow: 'preOnShow',
    postPageOnHide: 'postOnHide',
  };

  constructor(config) {
    super(config);
  }

  // invokeMethod(method, params) {
  //   if (!method) {
  //     return {
  //       handled: false,
  //     };
  //   }
  //   let result = {};
  //   switch (method) {
  //     case 'getDemo2': {
  //       result.handled = true;
  //       break;
  //     }
  //     case 'test1': {
  //       result.handled = false;
  //       break;
  //     }
  //     default: {
  //       console.log('pass');
  //       break;
  //     }
  //   }
  //   return result;
  // }

  preOnShow(opts, ctx) {
    // console.log('plugin-2: preOnShow');
  }

  postOnHide(e, ctx) {
    // console.log('e', e);
  }
}

export default PluginDemo;
