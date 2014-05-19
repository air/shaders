(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


// threestrap
var three = THREE.Bootstrap();

var shaderMaterial = new THREE.ShaderMaterial({
  // these fs functions are transformed by brfs into inline shaders
  vertexShader: "// inputs:\n// uniforms, e.g. light positions, matrices from THREE\n// attributes, of each vertex\n// varyings, values from vertex shader we want to pass to fragment. e.g. pass vertex normal for lighting\n\n// switch on high precision floats\n#ifdef GL_ES\nprecision highp float;\n#endif\n\nvarying vec4 vertexPos;\n\nvoid main()\n{\n  // projectionMatrix, modelViewMatrix provided by THREE\n  vertexPos.x = position.x;\n  vertexPos.y = position.y;\n  vertexPos.z = position.z;\n  vertexPos.w = 1.0;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
  fragmentShader: "// inputs:\n\n// switch on high precision floats\n#ifdef GL_ES\nprecision highp float;\n#endif\n\nvarying vec4 vertexPos;\n\nvoid main()\n{\n  // R, G, B, Alpha\n  //gl_FragColor  = vec4(1.0, 0.0, 1.0, 1.0);\n  gl_FragColor  = vec4(1.0, 1.0, 0.0, 1.0);\n}"
});

var mesh = new THREE.Mesh(new THREE.CubeGeometry(.5, .5, .5), shaderMaterial);
//var mesh = new THREE.Mesh(new THREE.CubeGeometry(.5, .5, .5), new THREE.MeshBasicMaterial());

three.scene.add(mesh);

three.on('update', function () {
  var t = three.Time.now;
  three.camera.position.set(Math.cos(t), .5, Math.sin(t));
  three.camera.lookAt(new THREE.Vector3());
});
},{}]},{},[1])