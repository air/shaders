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

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position, 1.0);
}