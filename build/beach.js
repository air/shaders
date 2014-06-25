// threestrap, https://github.com/unconed/threestrap
var three = THREE.Bootstrap({
  plugins: ['core', 'rstats', 'controls'],
  renderer: { parameters: { alpha: true, antialias: true } }, // transparent background, enable antialias
  controls: { klass: THREE.OrbitControls }
});

var shaderMaterial = createShader();

var hypercubeSize = 40;
// var geometry = createGeometry(hypercubeSize);
// var geometry = new THREE.CubeGeometry(hypercubeSize, hypercubeSize, hypercubeSize);
var geometry = new THREE.SphereGeometry(20, 128, 128);

var mesh = new THREE.Mesh(geometry, shaderMaterial);

// use the vertices from the mesh to add attributes to the material
setNewColorAttribute(shaderMaterial, mesh);

three.scene.add(mesh); // takes zero ms

// var refCube = new THREE.Mesh(new THREE.CubeGeometry(3, 3, 3), new THREE.MeshBasicMaterial({color: 0xffff00}));
// three.scene.add(refCube);

addReferenceShapes();

var startTime = new Date().getTime();
var TIME_COEFFICIENT = 1000;

three.camera.position.set(30, 30, 50);

// update loop
three.on('update', function () {
  var time = new Date().getTime() - startTime; // we want this to be a smallish number for e.g. sin() in shaders

  // refCube.position.x = 50 * Math.sin(time / TIME_COEFFICIENT);
  // refCube.position.y = 50 * Math.sin(time / TIME_COEFFICIENT / 2);
  // refCube.position.z = 50 * Math.cos(time * 0.001);

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
    // attributes will be added later.
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
  });

  return material;
}

// notice this is NOT the 'color' attribute added by THREE, we must avoid name clash
function setNewColorAttribute(material, theMesh)
{
  var startTime = new Date().getTime();

  material.attributes = { vertColor: { type: 'c', value: [] } };

  var vertArray = theMesh.geometry.vertices;

  // var colorTable = new THREE.Lut('blackbody', 1024);
  // colorTable.setMin(0);
  // colorTable.setMax(vertArray.length - 1);

  for (var i = 0; i < vertArray.length; i++)
  {
    // var color = colorTable.getColor(i);
    var color = 0xffffff;
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
  material.uniforms.time.value = (timeNow / TIME_COEFFICIENT);
}