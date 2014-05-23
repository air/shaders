// high precision floats
// #ifdef GL_ES
// precision highp float;
// #endif

attribute vec3 vertColor; // color for this vertex

uniform float amplitude;
uniform float time;

varying vec3 vColor;      // passthrough to frag

void main()
{
  // Useful read-only attributes from THREE: normal, position, color (unknown how to set)

  vColor = vertColor;

  // take THREE's position attribute and adjust it
  vec3 newPosition = position;
  newPosition *= abs(sin(amplitude));

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(newPosition, 1.0);
}