import { APP_HOOKS, PAGE_HOOKS, upperFirst, emitter } from '../utils/index';
import Core from './core';
// import Bridge from './bridge';

// const bridge = new Bridge();

const noop = () => {};

const appFns = APP_HOOKS.reduce((obj, key) => {
  // console.log(obj, key);
  obj[key] = noop;
  return obj;
}, {});
const pageFns = PAGE_HOOKS.reduce((obj, key) => {
  obj[key] = noop;
  return obj;
}, {});

// Core 加入必备功能或插件，如 wxapp aliapp config支持 addPlugin 等
// XMini 在此基础上扩展
class XMini extends Core {
  constructor(config = {}) {
    super(config);
  }

  init(config = {}) {
    const { plugins = [], ...rest } = config;
    // rest.plugin = {};
    this.setConfig(rest);
    this.me = rest.me;
    this.getCurrentPages = rest.getCurrentPages;
    // this.plugin = rest.plugin;
    this.addPlugin(plugins);
  }

  addPlugin(plugin) {
    if (Array.isArray(plugin)) {
      plugin.forEach(p => {
        this.addPlugin(p);
      });
      return this;
    }
    this.use(plugin);
    const { events = {}, methods = {} } = plugin;
    Object.keys(events).forEach(key => {
      const cbName = events[key];
      const fn = plugin[cbName];
      emitter.on(key, fn.bind(plugin));
    });
    // 后面通过 bridge 来解决通信问题
    // this.addMethods(methods, plugin);
    Object.keys(methods).forEach(key => {
      const fnName = methods[key];
      if (!this[key] && plugin[key]) {
        this[key] = plugin[fnName].bind(plugin);
      } else {
        if (!this[key]) {
          console.error(`插件 ${plugin.name} 下的公开方法 ${key} 不存在`);
        }
        if (plugin[key]) {
          console.error(
            `插件 ${
              plugin.name
            } 下的公开方法 ${key} 存在冲突，请使用别名，修改对应插件的 methods 值`
          );
        }
      }
    });
    // console.log(`:::add plugin::: ${plugin.name}`);
    return this;
  }

  // addPlugin
  use(plugin, ...rest) {
    const installedPlugins =
      this._installedPlugins || (this._installedPlugins = []);
    if (installedPlugins.indexOf(plugin) > -1) return this;

    if (typeof plugin.install === 'function') {
      plugin.install.call(plugin, ...rest);
    } else if (typeof plugin === 'function') {
      plugin.call(null, ...rest);
    }
    installedPlugins.push(plugin);
    return this;
  }

  create(options = {}, config = {}) {
    const { type, hooks, hooksFn, cb } = config;
    // 如果 options 没实现的方法，这里补上
    const newOpts = { ...hooksFn, ...options };
    // 只添加生命周期的 还是全加(page 也应用在 component 组件上)
    // Object.keys(newOpts).forEach((key, index) => {
    hooks.forEach((key, index) => {
      const oldFn = newOpts[key] || noop;
      newOpts[key] = function(opts) {
        // 这里应该使用 this 而不是 newOpts
        emitter.emit(`pre${type}${upperFirst(key)}`, opts, this);
        const result = oldFn.call(this, opts);
        emitter.emit(`post${type}${upperFirst(key)}`, opts, this);
        return result;
      };
    });

    cb(newOpts);
    return this;
  }

  xApp = options => {
    return fn => {
      this.create(options, {
        type: 'App',
        cb: fn,
        hooks: APP_HOOKS,
        hooksFn: appFns,
      });
    };
  };
  xPage = options => {
    return fn => {
      this.create(options, {
        type: 'Page',
        cb: fn,
        hooks: PAGE_HOOKS,
        hooksFn: pageFns,
      });
    };
  };
}

export default new XMini();
