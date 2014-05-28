(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
 // brfs for injecting shaders into this file

// threestrap, https://github.com/unconed/threestrap
var three = THREE.Bootstrap({
  plugins: ['core', 'rstats', 'controls'],
  controls: { klass: THREE.OrbitControls }
});

var shaderMaterial = createShader();

var hypercubeSize = 40;
// var geometry = createGeometry(hypercubeSize);
var geometry = new THREE.CubeGeometry(hypercubeSize, hypercubeSize, hypercubeSize);

var mesh = new THREE.Mesh(geometry, shaderMaterial);

// use the vertices from the mesh to add attributes to the material
setNewColorAttribute(shaderMaterial, mesh);

three.scene.add(mesh); // takes zero ms

addReferenceShapes();

var startTime = new Date().getTime();

three.camera.position.set(30, 30, 50);

// update loop
three.on('update', function () {
  var time = new Date().getTime() - startTime; // we want this to be a smallish number for e.g. sin() in shaders

  animateShader(shaderMaterial, time);
});

function createGeometry(cubesPerRow)
{
  var startTime = new Date().getTime();

  var geometry = new THREE.Geometry();  // start with nothing
  var cubeSize = 1.0;
  var cubeGeometry = new THREE.CubeGeometry(cubeSize, cubeSize, cubeSize); // a reference cube
  var spacing = cubeSize + (cubeSize / 2);

  var startingOffset = -(spacing / 2) * (cubesPerRow - 1);

  var cubesCreated = 0;
  for (var cubeX = 0; cubeX < cubesPerRow; cubeX++)
  {
    for (var cubeY = 0; cubeY < cubesPerRow; cubeY++)
    {
      for (var cubeZ = 0; cubeZ < cubesPerRow; cubeZ++)
      {
        // console.log('creating cube ' + cubesCreated + ' at location ' + cubeX + ', ' + cubeY + ', ' + cubeZ);
        var offsetX = startingOffset + (cubeX * spacing);
        var offsetY = startingOffset + (cubeY * spacing);
        var offsetZ = startingOffset + (cubeZ * spacing);
        // add vertices
        for (var vIndex = 0; vIndex < cubeGeometry.vertices.length; vIndex++)
        {
          var vertex = cubeGeometry.vertices[vIndex];
          geometry.vertices.push(new THREE.Vector3(vertex.x + offsetX, vertex.y + offsetY, vertex.z + offsetZ));
          // console.log(geometry.vertices[geometry.vertices.length - 1]);
        }
        // add faces, i.e. sets of vertex indices
        for (var fIndex = 0; fIndex < cubeGeometry.faces.length; fIndex++)
        {
          var face = cubeGeometry.faces[fIndex];
          var faceOffset = cubesCreated * cubeGeometry.vertices.length;
          geometry.faces.push(new THREE.Face3(face.a + faceOffset, face.b + faceOffset, face.c + faceOffset));
          // console.log(geometry.faces[geometry.faces.length - 1]);
        }

        cubesCreated += 1;
      }
    }
  }
  console.log('created geometry of ' + cubesCreated + ' cubes in ' + (new Date().getTime() - startTime) + 'ms');
  return geometry;
}

function createShader()
{
  var customUniforms = {
    time: {
      type: 'f',
      value: 0
    }
  };

  var material = new THREE.ShaderMaterial({
    uniforms: customUniforms,
    // 1. attributes will be added later.
    // 2. These fs functions are transformed by brfs into inline shaders:
    vertexShader: "// high precision floats\n#ifdef GL_ES\nprecision highp float;\n#endif\n\nattribute vec3 vertColor; // custom color for this vertex\n\nuniform float time;\n\nvarying vec3 vColor;\nvarying vec2 vUv;\nvarying vec3 vNormal;\n\nvoid main()\n{\n  // Variables from THREE: https://github.com/mrdoob/three.js/blob/master/src/renderers/webgl/WebGLProgram.js#L153\n\n  vColor = vertColor;\n\n  // passthroughs\n  vNormal = normal;\n  vUv = uv;\n\n  vec3 newPosition = position;\n\n  gl_Position = projectionMatrix *\n                modelViewMatrix *\n                vec4(newPosition, 1.0);\n}",
    fragmentShader: "// high precision floats\n#ifdef GL_ES\nprecision highp float;\n#endif\n\nvarying vec3 vColor;\nvarying vec2 vUv;\nvarying vec3 vNormal;\n\nvoid main()\n{\n  vec3 rgb = vColor;\n\n  vec3 up = vec3(0.0, 1.0, 0.0);\n  float alignmentToUp = dot(vNormal, up); // alignment of this pixel fragment\n\n  vec3 blue = vec3(0.3, 0.3, 0.9);\n  vec3 brown = vec3(0.7, 0.4, 0.2);\n  vec3 white = vec3(1.0, 1.0, 1.0);\n  vec3 black = vec3(0.0, 0.0, 0.0);\n\n  float horizon = 0.35;\n\n  if (alignmentToUp == 1.0)\n  {\n    rgb = blue;\n  }\n  else if (alignmentToUp == -1.0)\n  {\n    rgb = brown;\n  }\n  else if (vUv.y < horizon)\n  {\n    // Y will range 0 to horizon, so adjust up to get 0..1\n    float yRange = vUv.y * (1.0 / horizon);\n    rgb = mix(brown, black, yRange);\n  }\n  else\n  {\n    // Y will range horizon to 1, so adjust range and subtract 1 to get 0..1\n    float yRange = (vUv.y * (1.0/horizon)) - 1.0;\n    rgb = mix(white, blue, yRange);\n  }\n  \n  gl_FragColor  = vec4(rgb, 1.0); // last value is alpha\n}"
  });

  return material;
}

// notice this is NOT the 'color' attribute added by THREE, we must avoid name clash
function setNewColorAttribute(material, theMesh)
{
  var startTime = new Date().getTime();

  material.attributes = { vertColor: { type: 'c', value: [] } };

  var vertArray = theMesh.geometry.vertices;

  var colorTable = new THREE.Lut('blackbody', 1024);
  colorTable.setMin(0);
  colorTable.setMax(vertArray.length - 1);

  for (var i = 0; i < vertArray.length; i++)
  {
    var color = colorTable.getColor(i);
    material.attributes.vertColor.value.push(color);
  }

  console.log('coloured ' + vertArray.length + ' vertices in ' + (new Date().getTime() - startTime) + 'ms')
}

function addReferenceShapes()
{
  // var axisHelper = new THREE.AxisHelper(hypercubeSize + 2);
  // three.scene.add(axisHelper);

  // debug
  // console.log(shaderMaterial);
  // console.log(mesh);
}

function animateShader(material, timeNow)
{
  material.uniforms.time.value = (timeNow / 1000);
}
},{}]},{},[1])