var fs = require('fs');

// threestrap
var three = THREE.Bootstrap();

var shaderMaterial = setupShader();

var mesh = new THREE.Mesh(new THREE.CubeGeometry(1.0, 1.0, 1.0), shaderMaterial);

colorMesh(shaderMaterial, mesh);

// no effect, doesn't show up when logged so must be reset
// mesh.geometry.colorsNeedUpdate = true;

three.scene.add(mesh);

// reference shapes
var axisHelper = new THREE.AxisHelper(3);
three.scene.add(axisHelper);

var box = new THREE.Mesh(new THREE.CubeGeometry(0.2, 0.2, 0.2), new THREE.MeshBasicMaterial({color: new THREE.Color(1, 0, 0)}));
box.position.set(1, 0, 1);
three.scene.add(box);

console.log(shaderMaterial);
console.log(mesh);
console.log(box);

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
    vertexShader: fs.readFileSync('./shaders/shader.vert', 'utf8'),
    fragmentShader: fs.readFileSync('./shaders/shader.frag', 'utf8')
  });

  // set USE_COLOR
  material.vertexColors = THREE.VertexColors;

  return material;
}

function colorMesh(material, theMesh)
{
  var vertArray = theMesh.geometry.vertices;

  for (var i=0; i < vertArray.length; i++)
  {
    var randomRgb = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
    theMesh.geometry.colors.push(new THREE.Color(randomRgb));
  }
}

function animateShader(material, timeNow)
{
  material.uniforms.amplitude.value = 1 + (Math.abs(Math.sin(timeNow) * 0.5));
}