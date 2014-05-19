(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


// threestrap
var three = THREE.Bootstrap();

var shaderMaterial = setupShader();

var mesh = new THREE.Mesh(new THREE.CubeGeometry(1.0, 1.0, 1.0), shaderMaterial);
//var mesh = new THREE.Mesh(new THREE.CubeGeometry(1.0, 1.0, 1.0), new THREE.MeshBasicMaterial());

displaceMesh(shaderMaterial, mesh);

three.scene.add(mesh);

three.on('update', function () {
  var t = three.Time.now;

  animateShader(shaderMaterial, t);

  var cameraDistance = 2.0;
  three.camera.position.set(Math.cos(t) * cameraDistance, 1.0, Math.sin(t) * cameraDistance);
  three.camera.lookAt(new THREE.Vector3());
});

function setupShader()
{
  var customAttributes = {
    // displacement is a named attribute in the shader
    displacement: {
      type: 'f',  // float
      value: []   // empty array
    }
  };

  var customUniforms = {
    // amplitude is a named uniform in the shader
    amplitude: {
      type: 'f',  // float
      value: 0
    }
  };

  var material = new THREE.ShaderMaterial({
    attributes: customAttributes,
    uniforms: customUniforms,
    // these fs functions are transformed by brfs into inline shaders
    vertexShader: "// high precision floats\n#ifdef GL_ES\nprecision highp float;\n#endif\n\nuniform float amplitude;      // uniform, so all vertices get the same\nattribute float displacement; // attribute, so unique to this vertex\nvarying vec3 vNormal;\n\nvoid main()\n{\n  // READ ONLY attributes provided by THREE: projectionMatrix, modelViewMatrix, normal, position\n  vNormal = normal;\n\n  float displaceAmount = displacement * amplitude;\n  vec3 displaceVector = vec3(displaceAmount); // all 3 slots set to displacement\n  displaceVector = displaceVector * normal; // point the displacement along this vertex\n\n  // take THREE's position and displace it\n  vec3 newPosition = position + displaceVector;\n\n  gl_Position = projectionMatrix *\n                modelViewMatrix *\n                vec4(newPosition, 1.0);\n}",
    fragmentShader: "// high precision floats\n#ifdef GL_ES\nprecision highp float;\n#endif\n\nvarying vec3 vNormal;\n\nvoid main()\n{\n  // set up a light direction, pointing up Y and into X and Z\n  vec3 light = vec3(0.3, 0.4, 0.5);\n\n  // normalize it\n  light = normalize(light);\n\n  // get the dot product of the light to the vertex normal.\n  // vertex normals pointing up Y and into X and Z (same as light) will have a positive dot product (approaching 1.0).\n  // vertex normals at right angles will be zero. More than right angles will be negative. \n  float dotProduct = dot(vNormal, light);\n  dotProduct = max(0.0, dotProduct);\n\n  // fragcolor is set with R, G, B, Alpha\n  gl_FragColor  = vec4(dotProduct, dotProduct, dotProduct, 1.0);\n}"
  });

  return material;
}

function displaceMesh(material, theMesh)
{
  var verts = theMesh.geometry.vertices;
  var valueArray = material.attributes.displacement.value;

  for (var i=0; i < verts.length; i++)
  {
    valueArray.push((Math.random() * 0.4) - 0.0);
  }
}

function animateShader(material, timeNow)
{
  material.uniforms.amplitude.value = Math.sin(timeNow);
}
},{}]},{},[1])