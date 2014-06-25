// high precision floats
#ifdef GL_ES
precision highp float;
#endif

attribute vec3 vertColor; // custom color for this vertex

uniform float time;

varying vec2 vUv;
varying vec3 vNormal; // the normal of the VERTEX
varying vec3 vCamera;

// hack from http://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

// Variables from THREE: https://github.com/mrdoob/three.js/blob/master/src/renderers/webgl/WebGLProgram.js#L153
void main()
{
  // passthroughs
  vNormal = normal;
  vUv = uv;
  vCamera = cameraPosition;
  vec3 newPosition = position;

  vec2 noiseInput = uv;
  // noiseInput.y += time;
  float noise = rand(noiseInput);
  newPosition *= (1.0 + (noise / 10.0));

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(newPosition, 1.0);
}