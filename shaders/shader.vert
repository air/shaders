// inputs:
// uniforms, e.g. light positions, matrices from THREE
// attributes, of each vertex
// varyings, values from vertex shader we want to pass to fragment. e.g. pass vertex normal for lighting

// switch on high precision floats
#ifdef GL_ES
precision highp float;
#endif

varying vec4 vertexPos;

void main()
{
  // projectionMatrix, modelViewMatrix provided by THREE
  vertexPos.x = position.x;
  vertexPos.y = position.y;
  vertexPos.z = position.z;
  vertexPos.w = 1.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}