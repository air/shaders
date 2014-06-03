void main(void)
{
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
	vec3 rgb;
	
	// exercise 1, yellow in bottom right
	// rgb = vec3(uv.x, 1.0-uv.y, 0.0);
	
	// exercise 2, brute force blue to brown
	//vec3 blue = vec3(0.4, 0.4, 1.0);
	//vec3 brown = vec3(0.7, 0.4, 0.2);
	//vec3 diff = abs(brown - blue);
	//rgb = vec3(0.4 + (1.0-uv.y)*diff.x,
	//        0.4 + (1.0-uv.y)*diff.y,
	//          0.0 + uv.y*diff.z);

	// exercise 2 using mix() - slightly different result
	//vec3 blue = vec3(0.4, 0.4, 1.0);
	//vec3 brown = vec3(0.7, 0.4, 0.2);
	//// mix ranges between A and B as C ranges 0..1
	//// mix will process x,y,z components in turn
	//rgb = mix(blue, brown, 1.0-uv.y);
	
	// exercise 3, chrome effect
	vec3 blue = vec3(0.3, 0.3, 0.9);
	vec3 brown = vec3(0.7, 0.4, 0.2);
	vec3 white = vec3(1.0, 1.0, 1.0);
	vec3 black = vec3(0.0, 0.0, 0.0);
	float horizon = 0.35;
	if (uv.y < horizon)
	{
		// Y will range 0 to horizon, so adjust up to get 0..1
		float yRange = uv.y * (1.0 / horizon);
		rgb = mix(brown, black, yRange);
	}
	else
	{
		// Y will range horizon to 1, so adjust range and subtract 1 to get 0..1
		float yRange = (uv.y * (1.0/horizon)) - 1.0;
		rgb = mix(white, blue, yRange);
	}
	
	gl_FragColor = vec4(rgb, 1.0);
}