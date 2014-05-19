// high precision floats
#ifdef GL_ES
precision highp float;
#endif

attribute float displacement;
varying vec3 vNormal;

void main()
{
  // READ ONLY attributes provided by THREE: projectionMatrix, modelViewMatrix, normal, position
  vNormal = normal;

  vec3 displaceVector = vec3(displacement); // all 3 slots set to displacement
  displaceVector = displaceVector * normal; // point the displacement along this vertex

  // take THREE's position and displace it
  vec3 newPosition = position + displaceVector;

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(newPosition, 1.0);
}