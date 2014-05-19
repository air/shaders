(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


// threestrap
var three = THREE.Bootstrap();

var shaderMaterial = new THREE.ShaderMaterial({
  // these fs functions are transformed by brfs into inline shaders
  vertexShader: "// high precision floats\n#ifdef GL_ES\nprecision highp float;\n#endif\n\nvarying vec3 vNormal;\n\nvoid main()\n{\n  // provided by THREE: projectionMatrix, modelViewMatrix, normal, position\n  vNormal = normal;\n\n  gl_Position = projectionMatrix *\n                modelViewMatrix *\n                vec4(position, 1.0);\n}",
  fragmentShader: "// high precision floats\n#ifdef GL_ES\nprecision highp float;\n#endif\n\nvarying vec3 vNormal;\n\nvoid main()\n{\n  // set up a light direction\n  vec3 light = vec3(0.5, 0.2, 1.0);\n\n  // normalize it\n  light = normalize(light);\n\n  // get the dot product of the light to the vertex normal\n  float dotProduct = dot(vNormal, light);\n  dotProduct = max(0.0, dotProduct);\n\n  // fragcolor is set with R, G, B, Alpha\n  gl_FragColor  = vec4(dotProduct, dotProduct, dotProduct, 1.0);\n}"
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