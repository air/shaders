// high precision floats
// #ifdef GL_ES
// precision highp float;
// #endif

uniform float amplitude;      // uniform, so all vertices get the same for this frame

varying vec3 vColor;

void main()
{
  // READ ONLY attributes provided by THREE: projectionMatrix, modelViewMatrix, normal, position, color (if USE_COLOR)

  vColor = color;

  // take THREE's position attribute and amplify it
  vec3 newPosition = position * amplitude;

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(newPosition, 1.0);
}