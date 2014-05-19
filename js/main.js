var fs = require('fs');

// threestrap
var three = THREE.Bootstrap();

var shaderMaterial = new THREE.ShaderMaterial({
  // these fs functions are transformed by brfs into inline shaders
  vertexShader: fs.readFileSync('./shaders/shader.vert', 'utf8'),
  fragmentShader: fs.readFileSync('./shaders/shader.frag', 'utf8')
});

var mesh = new THREE.Mesh(new THREE.CubeGeometry(.5, .5, .5), shaderMaterial);
three.scene.add(mesh);

three.on('update', function () {
  var t = three.Time.now;
  three.camera.position.set(Math.cos(t), .5, Math.sin(t));
  three.camera.lookAt(new THREE.Vector3());
});