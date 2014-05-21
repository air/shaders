(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
 // brfs for injecting shaders into this file

// threestrap, https://github.com/unconed/threestrap
var three = THREE.Bootstrap();

var shaderMaterial = createShader();

var hypercubeSize = 25;
var geometry = createGeometry(hypercubeSize);
var cameraHeight = 0;

var mesh = new THREE.Mesh(geometry, shaderMaterial);

// use the vertices from the mesh to add attributes to the material
setNewColorAttribute(shaderMaterial, mesh);

three.scene.add(mesh);

addReferenceShapes();

// update loop
three.on('update', function () {
  var t = three.Time.now; // notice this is three, not THREE

  animateShader(shaderMaterial, t);

  var cameraDistance = hypercubeSize * 2;
  var rotateSpeed = 0.2;

  three.camera.position.set(Math.cos(t * rotateSpeed) * cameraDistance, cameraHeight, Math.sin(t * rotateSpeed) * cameraDistance);
  three.camera.lookAt(new THREE.Vector3());
});

function createGeometry(cubesPerRow)
{
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
  // console.log(geometry);
  console.log('cubes: ' + cubesCreated);
  return geometry;
}

function createShader()
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

  var colorTable = new THREE.Lut('blackbody', 1024);
  colorTable.setMin(0);
  colorTable.setMax(vertArray.length - 1);
  console.log(colorTable);

  for (var i = 0; i < vertArray.length; i++)
  {
    var color = colorTable.getColor(i);
    material.attributes.vertColor.value.push(color);
  }
}

function addReferenceShapes()
{
  var axisHelper = new THREE.AxisHelper(hypercubeSize + 2);
  three.scene.add(axisHelper);

  // debug
  console.log(shaderMaterial);
  console.log(mesh);
}

function animateShader(material, timeNow)
{
  material.uniforms.amplitude.value = 1 + (Math.abs(Math.sin(timeNow) * 0.0));
}
},{}]},{},[1])