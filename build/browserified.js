(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
 // brfs for injecting shaders into this file

// threestrap, https://github.com/unconed/threestrap
var three = THREE.Bootstrap();

var shaderMaterial = setupShader();

var mesh = new THREE.Mesh(new THREE.CubeGeometry(1.0, 1.0, 1.0), shaderMaterial);

// use the vertices from the mesh to add attributes to the material
setNewColorAttribute(shaderMaterial, mesh);

three.scene.add(mesh);

addReferenceShapes();

// update loop
three.on('update', function () {
  var t = three.Time.now;

  animateShader(shaderMaterial, t);

  var cameraDistance = 3.0;
  three.camera.position.set(Math.cos(t) * cameraDistance, 1.0, Math.sin(t) * cameraDistance);
  three.camera.lookAt(new THREE.Vector3());
});

function setupShader()
{
  var customUniforms = {
    // amplitude is a named uniform in the shader
    amplitude: {
      type: 'f',  // float
      value: 0
    }
  };

  var material = new THREE.ShaderMaterial({
    uniforms: customUniforms,
    // these fs functions are transformed by brfs into inline shaders
    vertexShader: "// high precision floats\n// #ifdef GL_ES\n// precision highp float;\n// #endif\n\nattribute vec3 vertColor; // color for this vertex\n\nuniform float amplitude;  // uniform, so all vertices get the same for this frame\n\nvarying vec3 vColor;      // passthrough to frag\n\nvoid main()\n{\n  // Useful read-only attributes from THREE: normal, position, color (unknown how to set)\n\n  // example debug: if we got passed a vertColor of white, use blue as a flag\n  if (all(equal(vertColor, vec3(1.0, 1.0, 1.0))))\n  {\n    vColor = vec3(0, 0, 1.0); \n  }\n  else\n  {\n    vColor = vertColor;\n  }\n\n  // take THREE's position attribute and amplify it\n  vec3 newPosition = position * amplitude;\n\n  gl_Position = projectionMatrix *\n                modelViewMatrix *\n                vec4(newPosition, 1.0);\n}",
    fragmentShader: "// high precision floats\n// #ifdef GL_ES\n// precision highp float;\n// #endif\n\nvarying vec3 vColor;\n\nvoid main()\n{\n  // fragcolor is set with R, G, B, Alpha\n  gl_FragColor  = vec4(vColor, 1.0);\n}"
  });

  return material;
}

// notice this is NOT the 'color' attribute added by THREE, we must avoid name clash
function setNewColorAttribute(material, theMesh)
{
  material.attributes = { vertColor: { type: 'c', value: [] } };

  var vertArray = theMesh.geometry.vertices;

  for (var i=0; i < vertArray.length; i++)
  {
    var randomRgb = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
    material.attributes.vertColor.value.push(new THREE.Color(randomRgb));
  }
}

function addReferenceShapes()
{
  var axisHelper = new THREE.AxisHelper(3);
  three.scene.add(axisHelper);

  var box = new THREE.Mesh(new THREE.CubeGeometry(0.2, 0.2, 0.2), new THREE.MeshBasicMaterial({color: new THREE.Color(1, 0, 0)}));
  box.position.set(1, 0, 1);
  three.scene.add(box);

  // debug
  console.log(shaderMaterial);
  console.log(mesh);
  console.log(box);
}

function animateShader(material, timeNow)
{
  material.uniforms.amplitude.value = 1 + (Math.abs(Math.sin(timeNow) * 0.5));
}
},{}]},{},[1])