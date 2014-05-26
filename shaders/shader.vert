// high precision floats
#ifdef GL_ES
precision highp float;
#endif

attribute vec3 vertColor; // color for this vertex

uniform float time;

varying vec3 vColor;      // passthrough to frag

void main()
{
  // Useful read-only attributes from THREE: normal, position, color (unknown how to set)

  vColor = vertColor;

  vec3 newPosition = position;
  newPosition.y += 1.0 * sin(time + position.x);
  newPosition.x += 1.0 * sin(time + position.z);
  newPosition.z += 1.0 * sin(time + position.y);

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(newPosition, 1.0);
}