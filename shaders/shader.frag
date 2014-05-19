// inputs:

// switch on high precision floats
#ifdef GL_ES
precision highp float;
#endif

varying vec4 vertexPos;

void main()
{
  // R, G, B, Alpha
  //gl_FragColor  = vec4(1.0, 0.0, 1.0, 1.0);
  gl_FragColor  = vec4(1.0, 1.0, 0.0, 1.0);
}