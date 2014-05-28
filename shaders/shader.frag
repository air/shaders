// high precision floats
#ifdef GL_ES
precision highp float;
#endif

varying vec3 vColor;
varying vec2 vUv;
varying vec3 vNormal;

void main()
{
  vec3 rgb = vColor;

  vec3 up = vec3(0.0, 1.0, 0.0);
  float alignmentToUp = dot(vNormal, up); // alignment of this pixel fragment

  vec3 blue = vec3(0.3, 0.3, 0.9);
  vec3 brown = vec3(0.7, 0.4, 0.2);
  vec3 white = vec3(1.0, 1.0, 1.0);
  vec3 black = vec3(0.0, 0.0, 0.0);

  float horizon = 0.35;

  if (alignmentToUp == 1.0)
  {
    rgb = blue;
  }
  else if (alignmentToUp == -1.0)
  {
    rgb = brown;
  }
  else if (vUv.y < horizon)
  {
    // Y will range 0 to horizon, so adjust up to get 0..1
    float yRange = vUv.y * (1.0 / horizon);
    rgb = mix(brown, black, yRange);
  }
  else
  {
    // Y will range horizon to 1, so adjust range and subtract 1 to get 0..1
    float yRange = (vUv.y * (1.0/horizon)) - 1.0;
    rgb = mix(white, blue, yRange);
  }
  
  gl_FragColor  = vec4(rgb, 1.0); // last value is alpha
}