// high precision floats
// #ifdef GL_ES
// precision highp float;
// #endif

attribute vec3 vertColor; // color for this vertex

uniform float amplitude;  // uniform, so all vertices get the same for this frame

varying vec3 vColor;      // passthrough to frag

void main()
{
  // Useful read-only attributes from THREE: normal, position, color (unknown how to set)

  // example debug: if we got passed a vertColor of white, use blue as a flag
  if (all(equal(vertColor, vec3(1.0, 1.0, 1.0))))
  {
    vColor = vec3(0, 0, 1.0); 
  }
  else
  {
    vColor = vertColor;
  }

  // take THREE's position attribute and amplify it
  vec3 newPosition = position * amplitude;

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(newPosition, 1.0);
}