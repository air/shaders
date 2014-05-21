var fs = require('fs'); // brfs for injecting shaders into this file

// threestrap, https://github.com/unconed/threestrap
var three = THREE.Bootstrap();

var shaderMaterial = createShader();

var hypercubeSize = 20;
var geometry = createGeometry(hypercubeSize);
// assume cubes are 1x1x1 and 0.5 apart
var cameraHeight = (hypercubeSize * 1.5) / 2;

var mesh = new THREE.Mesh(geometry, shaderMaterial);

// use the vertices from the mesh to add attributes to the material
setNewColorAttribute(shaderMaterial, mesh);

three.scene.add(mesh);

addReferenceShapes();

// update loop
three.on('update', function () {
  var t = three.Time.now; // notice this is three, not THREE

  animateShader(shaderMaterial, t);

  var cameraDistance = 25.0;
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
  var cubesCreated = 0;

  for (var cubeX = 0; cubeX < cubesPerRow; cubeX++)
  {
    for (var cubeY = 0; cubeY < cubesPerRow; cubeY++)
    {
      for (var cubeZ = 0; cubeZ < cubesPerRow; cubeZ++)
      {
        // console.log('creating cube ' + cubesCreated + ' at location ' + cubeX + ', ' + cubeY + ', ' + cubeZ);
        var offsetX = cubeX * spacing;
        var offsetY = cubeY * spacing;
        var offsetZ = cubeZ * spacing;
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
    vertexShader: fs.readFileSync('./shaders/shader.vert', 'utf8'),
    fragmentShader: fs.readFileSync('./shaders/shader.frag', 'utf8')
  });

  return material;
}

// notice this is NOT the 'color' attribute added by THREE, we must avoid name clash
function setNewColorAttribute(material, theMesh)
{
  material.attributes = { vertColor: { type: 'c', value: [] } };

  var vertArray = theMesh.geometry.vertices;

  var colorTable = new THREE.Lut('rainbow', 1024);
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
  var axisHelper = new THREE.AxisHelper(1);
  three.scene.add(axisHelper);

  // debug
  console.log(shaderMaterial);
  console.log(mesh);
}

function animateShader(material, timeNow)
{
  material.uniforms.amplitude.value = 1 + (Math.abs(Math.sin(timeNow) * 0.0));
}