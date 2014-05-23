THREE.Bootstrap.registerPlugin('rstats', {

  listen: ['update', 'render', 'post'],

  install: function (three) {
    var settings = {
      CSSPath: 'lib/',
      values: {
        render: { caption: 'Render time (ms)', over: 16 },
        fps: { caption: 'FPS', below: 30 },
        update: { caption: 'Update time (ms)', over: 5 }
      },
      groups: [ { caption: 'Performance', values: [ 'engine', 'frame', 'fps' ] } ],
      //plugins: [threestats]
    };
    var rstats = this.rstats = new rStats(settings); // TODO do not understand the nuance here
    three.rstats = rstats;
  },

  uninstall: function (three) {
    // FIXME document.body.removeChild(this.stats.domElement);

    delete three.rstats;
  },

  update: function (event, three) {
    this.rstats('update').start();
  },

  render: function (event, three) {
    this.rstats('update').end();
    this.rstats('FPS').frame();
    this.rstats('render').start();
  },

  post: function (event, three) {
    this.rstats('render').end();
    this.rstats().update();
  },

});