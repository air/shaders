var three = THREE.Bootstrap();

var shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: document.getElementById('vertexShader').textContent,
  fragmentShader: document.getElementById('fragmentShader').textContent
});

var mesh = new THREE.Mesh(new THREE.CubeGeometry(.5, .5, .5), shaderMaterial);
three.scene.add(mesh);

three.on('update', function () {
  var t = three.Time.now;
  three.camera.position.set(Math.cos(t), .5, Math.sin(t));
  three.camera.lookAt(new THREE.Vector3());
});