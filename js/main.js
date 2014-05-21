var fs = require('fs'); // brfs for injecting shaders into this file

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
  var rotateSpeed = 0.3;
  three.camera.position.set(Math.cos(t * rotateSpeed) * cameraDistance, 1.0, Math.sin(t * rotateSpeed) * cameraDistance);
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

  var colorTable = new THREE.Lut('rainbow', 16);
  colorTable.setMin(0);
  colorTable.setMax(vertArray.length - 1);
  console.log(colorTable);

  for (var i=0; i < vertArray.length; i++)
  {
    var color = colorTable.getColor(i);
    material.attributes.vertColor.value.push(color);
  }
}

function addReferenceShapes()
{
  var axisHelper = new THREE.AxisHelper(1);
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