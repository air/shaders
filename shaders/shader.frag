// high precision floats
#ifdef GL_ES
precision highp float;
#endif

varying vec3 vNormal;

void main()
{
  // set up a light direction, pointing up Y and into X and Z
  vec3 light = vec3(0.3, 0.4, 0.5);

  // normalize it
  light = normalize(light);

  // get the dot product of the light to the vertex normal.
  // vertex normals pointing up Y and into X and Z (same as light) will have a positive dot product (approaching 1.0).
  // vertex normals at right angles will be zero. More than right angles will be negative. 
  float dotProduct = dot(vNormal, light);
  dotProduct = max(0.0, dotProduct);

  // fragcolor is set with R, G, B, Alpha
  gl_FragColor  = vec4(dotProduct, dotProduct, dotProduct, 1.0);
}