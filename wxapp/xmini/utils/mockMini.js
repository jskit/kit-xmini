export function App(opts) {
  const err = {
    err: 'xxx',
    message: '错误消息',
  };
  opts.onError(err);
  opts.onLaunch();

  // opts.data;

  opts.onShow();
}

export function Page(opts) {
  opts.onLoad({});

  // opts.data;

  opts.onShow();
}
