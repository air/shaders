THREE.Bootstrap.registerPlugin('rstats', {

  listen: ['pre', 'post'],

  install: function (three) {
    var settings = {
      CSSPath: 'lib/',
      values: {
        update: { caption: 'Update time (ms)', over: 10 },
        fps: { caption: 'FPS', below: 30 }
      },
      groups: [ { caption: 'Performance', values: [ 'fps', 'update' ] } ],
      //plugins: [threestats]
    };
    var rstats = this.rstats = new rStats(settings); // TODO do not understand the nuance here
    three.rstats = rstats;
  },

  uninstall: function (three) {
    // FIXME document.body.removeChild(this.stats.domElement);

    delete three.rstats;
  },

  pre: function (event, three) {
    this.rstats('update').start();
  },

  post: function (event, three) {
    this.rstats('update').end();
    this.rstats('FPS').frame();
    this.rstats().update();
  }

});