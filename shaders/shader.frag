// high precision floats
#ifdef GL_ES
precision highp float;
#endif

varying vec3 vColor;

void main()
{
  vec3 rgb = vColor;
  
  gl_FragColor  = vec4(rgb, 1.0); // last value is alpha
}