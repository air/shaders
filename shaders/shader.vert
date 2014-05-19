// high precision floats
#ifdef GL_ES
precision highp float;
#endif

varying vec3 vNormal;

void main()
{
  // provided by THREE: projectionMatrix, modelViewMatrix, normal, position
  vNormal = normal;

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position, 1.0);
}