import { APP_HOOKS, PAGE_HOOKS, upperFirst, emitter } from '../utils/index';
import Core from './core';

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
    super(config, true);
  }

  init(config = {}) {
    const { plugins = [], ...rest } = config;
    // rest.plugin = {};
    this.setConfig(rest);
    this.me = rest.me;
    // this.plugin = rest.plugin;
    this.addPlugin(plugins);
  }

  addPlugin(plugin) {
    if (Array.isArray(plugin)) {
      plugin.forEach(p => {
        this.addPlugin(p);
      });
    } else {
      const { events = {}, methods = {} } = plugin;
      Object.keys(events).forEach(key => {
        const cbName = events[key];
        const fn = plugin[cbName];
        emitter.on(key, fn.bind(plugin));
      });
      Object.keys(methods).forEach(key => {
        const fnName = methods[key];
        if (!this[key] && plugin[key]) {
          this[key] = function(...rest) {
            return plugin[fnName](...rest);
          }.bind(plugin);
        } else {
          console.error(
            `${
              plugin.name
            } 下的公开方法 ${key} 存在冲突，请使用别名，修改对应插件的 methods 值`
          );
        }
      });
      // this.installPlugin(plugin);
      // this.plugin[plugin.name] = plugin;
      // plugin.$x = this;
      console.log(`:::add plugin::: ${plugin.name}`);
    }
  }

  // bindEvent(name, fn, ctx) {
  //   emitter.$on(event, fn.bind(ctx));
  // }

  create(options = {}, config = {}) {
    const { type, hooks, hooksFn, cb } = config;
    // 如果 options 没实现的方法，这里补上
    const newOpts = { ...hooksFn, ...options };
    // 只添加生命周期的 还是全加
    // Object.keys(newOpts).forEach((key, index) => {
    hooks.forEach((key, index) => {
      const oldFn = newOpts[key] || noop;
      newOpts[key] = function(opts) {
        // 这里应该使用 this 而不是 newOpts
        emitter.emit(`pre${type}${upperFirst(key)}`, opts);
        const result = oldFn.call(this, opts);
        emitter.emit(`post${type}${upperFirst(key)}`, opts);
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

// const xmini = new XMini({});

// export default xmini;

// // usage
// import xmini from './xmini';

// xmini.init({});
// xmini.addPlugin();
// xmini.getConfig();
// xmini.create();

// // plugin-base
// class PluginCore {
//   call(...reset) {
//     xmini.call(...rest).bind(this);
//   }
// }
//   // plugin
// this.call('fnName', cb);
// this.call('fnName', cb);

// export const core = {
//   me,
//   getConfig() {
//     return { ...config };
//   },
//   setConfig(newConfig) {
//     return Object.assign(config, newConfig);
//   },
//   getSystemInfo(needString) {
//     return !needString ? { system: 'test' } : '{"system":"test"}';
//   },
//   getFn(fnName) {
//     return fnName && core.me[fnName];
//   },
// };

// let inited;
// xmini.initConfig = function(options) {
//   if (inited) return xmini;
//   const { plugins = [], ...rest } = options;
//   // this.setConfig(rest);
//   core.setConfig(rest);
//   plugins.forEach(plugin => {
//     // console.log(plugin.events);
//     const { events = {} } = plugin;
//     Object.keys(events).forEach(
//       function pluginFn(event) {
//         const cbName = events[event];
//         const fn = plugin[cbName];
//         emitter.$on(event, fn.bind(plugin));
//       }.bind(plugin)
//     );
//     console.log(`add plugin: ${plugin.name}`);
//   });
//   inited = true;
//   return xmini;
// };

// function xmini(options = {}) {
//   // console.log('plugins:', plugins)
//   // console.log('config:', rest);

//   return function xFn(type) {
//     // Object.assign(xFn.prototype, core);
//     const types = ['config', 'App', 'Page'];
//     if (types.indexOf(type) === -1) {
//       console.error(`不支持的 type 类型 ${type}`);
//       return;
//     }
//     // if (type === 'config') {

//     // }

//     // 页面调用
//     const isPage = type !== 'App';
//     const cb = isPage ? Page : App;
//     const hooks = isPage ? PAGE_HOOKS : APP_HOOKS;
//     const hooksFn = isPage ? pageFns : appFns;

//     // 如果 options 没实现的方法，这里补上
//     const newOpts = { ...hooksFn, ...options };
//     // 只添加生命周期的 还是全加
//     // Object.keys(newOpts).forEach((key, index) => {
//     hooks.forEach((key, index) => {
//       const oldFn = newOpts[key] || noop;
//       newOpts[key] = function(opts) {
//         // 这里应该使用 this 而不是 newOpts
//         emitter.$emit(`pre${upperFirst(key)}`, this);
//         const result = oldFn.call(this, opts);
//         emitter.$emit(`post${upperFirst(key)}`, this);
//         return result;
//       };
//     });

//     cb(newOpts);
//     return core;
//   };
// }

// export default xmini;
