
// 修改原 Page 的一些方法

// function hooks(func, opts = {
//   pre() {},
//   post() {},
// }) {
//   if (typeof opts === 'function') {
//     opts = {
//       pre: opts,
//       post: noop,
//     };
//   }
//   const funcTemp = func;
//   func = function(...rest) {
//     opts.pre(...rest);
//     funcTemp(...rest);
//     opts.post(...rest);
//   };
// };
