// high precision floats
#ifdef GL_ES
precision highp float;
#endif

attribute vec3 vertColor; // custom color for this vertex

uniform float time;

varying vec3 vColor;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vCamera;

void main()
{
  // Variables from THREE: https://github.com/mrdoob/three.js/blob/master/src/renderers/webgl/WebGLProgram.js#L153

  vColor = vertColor;

  // passthroughs
  vNormal = normal;
  vUv = uv;
  vCamera = cameraPosition;

  vec3 newPosition = position;

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(newPosition, 1.0);
}