import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../webpack.config.dev';
import proxy from 'http-proxy-middleware';

const apiProxy = proxy('/api', {
    target: 'http://localhost:8888',
    changeOrigin: false   // for vhosted sites
});

const bundler = webpack(config);

browserSync({
  port: 8080,
  ui: {
    port: 8081
  },
  server: {
    baseDir: 'src',
    middleware: [
      historyApiFallback(),
      apiProxy,
      webpackDevMiddleware(bundler, {
        publicPath: config.output.publicPath,
        noInfo: false,
        quiet: false,
        stats: {
          assets: false,
          colors: true,
          version: false,
          hash: false,
          timings: false,
          chunks: false,
          chunkModules: false
        },
      }),
      webpackHotMiddleware(bundler),
    ]
  },
  files: [
    'src/*.html'
  ]
});
