var fs = require('fs');

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
    vertexShader: fs.readFileSync('./shaders/shader.vert', 'utf8'),
    fragmentShader: fs.readFileSync('./shaders/shader.frag', 'utf8')
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