// high precision floats
#ifdef GL_ES
precision highp float;
#endif

varying vec3 vColor;
varying vec2 vUv;
varying vec3 vNormal; // the normal of the PIXEL
varying vec3 vCamera;

bool near(float var, float target)
{
  return (abs(target - var) < 0.0005) ? true : false;
}

void main()
{
  vec3 red = vec3(1.0, 0.3, 0.3);
  vec3 green = vec3(0.3, 1.0, 0.3);
  vec3 blue = vec3(0.3, 0.3, 1.0);
  vec3 brown = vec3(0.7, 0.4, 0.2);
  vec3 white = vec3(1.0, 1.0, 1.0);
  vec3 black = vec3(0.0, 0.0, 0.0);

  vec3 rgb;

  if (vUv.y > 0.95)
  {
    rgb = white;
  }
  else if (vUv.y < 0.05)
  {
    rgb = white;
  }
  else if (vUv.x < 0.17) { rgb = red; }
  else if (vUv.x < 0.33) { rgb = white; }
  else if (vUv.x < 0.49) { rgb = green; }
  else if (vUv.x < 0.65) { rgb = white; }
  else if (vUv.x < 0.81) { rgb = blue; }
  else { rgb = vec3(1.0, 1.0, 1.0); }

  if (near(vUv.y, 0.95) || near(vUv.y, 0.05)) { rgb = black; }
  else if (near(vUv.y, 0.36) || near(vUv.y, 0.64)) { rgb = black; }
  else if (near(vUv.x, 0.17) || near(vUv.x, 0.33) || near(vUv.x, 0.49)
            || near (vUv.x, 0.65) || near(vUv.x, 0.81) || near(vUv.x, 0.0)) { rgb = black; }

  vec3 cameraNormal = normalize(vCamera);
  float alignmentToCamera = dot(vNormal, cameraNormal);
  // lighting: range from facing the camera = 120% brightness, to facing away = 20%.
  rgb *= 0.2 + alignmentToCamera;

  // hacky specular highlight  
  float alignmentToSpotlight = dot(vNormal, normalize(vec3(1.0 ,1.0 ,1.0)));
  if (alignmentToSpotlight > 0.95) { rgb = mix(rgb, white, (alignmentToSpotlight / 3.0)); }
  
  gl_FragColor  = vec4(rgb, 1.0); // last value is alpha
}