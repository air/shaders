// high precision floats
#ifdef GL_ES
precision highp float;
#endif

attribute vec3 vertColor; // custom color for this vertex

uniform float time;

varying vec2 vUv;
varying vec3 vNormal; // the normal of the VERTEX
varying vec3 vCamera;

// Variables from THREE: https://github.com/mrdoob/three.js/blob/master/src/renderers/webgl/WebGLProgram.js#L153
void main()
{
  // passthroughs
  vNormal = normal;
  vUv = uv;
  vCamera = cameraPosition;

  vec3 magnet = vec3( 50.0 * sin(time),
                      50.0 * sin(time / 2.0),
                      50.0 * cos(time));
  magnet = normalize(magnet);

  float alignmentToMagnet = dot(normal, magnet);

  vec3 newPosition = position;
  if (alignmentToMagnet > 0.0)
  {
    newPosition *= (1.0 + pow(alignmentToMagnet, 18.0));
    // newPosition *= (1.0 + (alignmentToMagnet * 2.0));
  }

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(newPosition, 1.0);
}