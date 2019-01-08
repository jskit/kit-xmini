import PluginBase from '../core/plugin-base';
import xmini from '../core/xmini';

class PluginDemo extends PluginBase {
  name = 'demo1';
  events = {
    prePageOnShow: 'preOnShow',
    postPageOnShow: 'postOnShow',
    postPageOnHide: 'postOnHide',
  };

  constructor(config) {
    super(config);
  }

  preOnShow(e, ctx) {
    console.log('plugin-1: preOnShow');
    console.log('xxx', xmini.getConfig());
    // console.log(this);
    // console.log(PluginBase.getConfig());
    console.log('get:', this.getConfig());
    console.log('set:', this.setConfig({ appName: 'edited' }));
    // console.log(this.getConfig());
    // console.log(this.getPluginConfig());
    // console.log(this.setPluginConfig({ ttt: 1 }));

    const tt = [];
    for (let i = 0; i < 100000; i++) {
      tt.push(i);
    }
    console.log(tt.length);
  }

  postOnShow(e, ctx) {
    console.log('plugin-1: postOnShow');
  }

  postOnHide(e, ctx) {
    // console.log('plugin-1: postOnHide');
    // console.log('e', e);
  }
}

export default PluginDemo;
