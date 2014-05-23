// high precision floats
#ifdef GL_ES
precision highp float;
#endif

varying vec3 vColor;

void main()
{
  // fragcolor is set with R, G, B, Alpha
  gl_FragColor  = vec4(vColor, 1.0);
}