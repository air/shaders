// high precision floats
#ifdef GL_ES
precision highp float;
#endif

varying vec3 vNormal;

void main()
{
  // set up a light direction
  vec3 light = vec3(0.5, 0.2, 1.0);

  // normalize it
  light = normalize(light);

  // get the dot product of the light to the vertex normal
  float dotProduct = dot(vNormal, light);
  dotProduct = max(0.0, dotProduct);

  // fragcolor is set with R, G, B, Alpha
  gl_FragColor  = vec4(dotProduct, dotProduct, dotProduct, 1.0);
}