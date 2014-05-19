// high precision floats
#ifdef GL_ES
precision highp float;
#endif

uniform float amplitude;      // uniform, so all vertices get the same for this frame
attribute float displacement; // attribute, so unique to this vertex
varying vec3 vNormal;

void main()
{
  // READ ONLY attributes provided by THREE: projectionMatrix, modelViewMatrix, normal, position
  vNormal = normal; // take a copy so we can pass it through to fragment

  float displaceAmount = displacement * amplitude;
  vec3 displaceVector = vec3(displaceAmount); // all 3 slots set to displacement
  displaceVector = displaceVector * normal; // point the displacement along this vertex

  // take THREE's position and displace it
  vec3 newPosition = position + displaceVector;

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(newPosition, 1.0);
}