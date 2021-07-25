const esbuild = require('esbuild');
const chokidar = require('chokidar');
const liveserver = require('live-server');

const files_to_build = [ 'src/main.js' ];

const path_to_watch = "src/**/*.*";

const compile_js = () => {
  esbuild.build({
    entryPoints: files_to_build,
    bundle: true,
    minify: false,
    sourcemap: true,

    // make sure to copy common webfont formats over
    // to the pub directory, and update the paths.
    loader: {
      '.eot': 'file',
      '.woff': 'file',
      '.woff2': 'file',
      '.ttf': 'file'
    },

    platform: 'node',
    target: ['node10.4'],

    outfile: 'pub/bundle.js'
  })
  .then(() => {
    console.log('successful build.');
  })
  .catch(() => {
    console.log('build failed.');
  });
};


let watcher = chokidar.watch(path_to_watch, {
  // ignored: [],
  persistent: true
});


watcher.on('ready', async () => {
  compile_js();

  watcher.on('add', compile_js);
  watcher.on('change', compile_js);
})


liveserver.start({
  open: true,
  host: '0.0.0.0',
  port: 8080,
  root: "pub",
  loglevel: 0
});
