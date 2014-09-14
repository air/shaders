Testing shaders with three.js. See this live at http://air.github.io/shaders

# Run it

    $ google-chrome index.html

# Make changes

    $ npm install
    $ sudo npm install -g grunt-cli
    # if you change shaders, update index.html with:
    $ grunt
    # or grunt watch to do this automatically.

# Dependencies

  - I used `bower` to get `threestrap`, https://github.com/unconed/threestrap
  - See 'Getting shaders into JS' below for use of grunt

# Ideas

  - Reproduce the PS3 shimmering flakes
  - Flake snowfall with shader animation (rotation, gravity, maybe fluid lateral movement) and specular lighting. Or more like Minecraft snow
  - TV screen, phosphor elements curved CRT style
  - Add colormap http://bl.ocks.org/mbostock/310c99e53880faec2434

# Learnings

You can't have a `varying attribute`. If you want to pass an `attribute` or `uniform` through to fragment, you'll need to declare a separate `varying`.

THREE does a lot of hidden 'prefixed' shader work on your behalf. You can [avoid this using RawShaderMaterial](https://github.com/mrdoob/three.js/issues/3121).

Passing very large numbers into your shader is a bad idea. You can lose precision. Example: If you pass `threestrap.Time.now` as a `uniform float time` and perform `sin(time)` in your shader, you're going to have a bad time. LITERALLY.

## Pixel shaders

Shadertoy is for pixel shaders. Tutorials like http://thndl.com/?1 are for pixel shaders.

U and V are axes used for the X-Y of your texture, because X-Y-Z are already taken. http://en.wikipedia.org/wiki/UV_mapping

UV coords http://wiki.winamp.com/wiki/Pixel_Shader_Basics#UV_Coordinates are 0,0 (top left) to 1,1 (bottom right). So for a quad 600px in width, the first pixel would be defined as spanning from U coord 0 to U coord (1 / 600).

Pixel shaders http://stackoverflow.com/questions/19449590/webgl-glsl-how-does-a-shadertoy-work
A pixel shader works exactly like CRT scanlines. Sweeps from topleft across the top row, incrementing by one pixel U value each time. On the top row V is zero. Once the top row is done V gets incremented to the vertical pixel amount and we go left-right again.
The shader program runs on every pixel, for every frame. That's a lot of executions.

A pixel shader is a fragment shader. There are only four vertices and they're constant (the screen corners).

You are given a pixel and asked what to do with it. When given an input image, you can choose to return something based on pixels elsewhere. So a blurring shader could average out the nearby values. Or you could just sample the pixel to the left, resulting in a horizontal shift of the image.

If you divide the UV you're given, you end up sampling it multiple times and scaling up the input texture. e.g. getPixelFromInputTexture(U * 0.25, V) will return pixel X=1 for U values 0, 1, 2, 3. If you multiply it, you end up scaling it down.

Post-processing shaders. These are pixel shaders that run on the rendered image itself! Scanning every pixel and manipulating it.

Why the unfriendly name `vUv`? It's a varying, so people prefix with `v`. And unfortunately it's the UV coordinate, which doesn't have a friendlier expression. Hence the cryptic `vUv`.

## Getting your shaders into JS

There is no elegant way to do this, given 1. JS has limited support for multiline strings and 2. You're in a browser and can't do inline includes easily. After much experimentation this is the cleanest:

  1. Define your shaders in their own files
  2. Put a placeholder token in HTML, viz. index-template.html
  3. Use grunt-replace to push the files into the template. Automate this with grunt-contrib-watch.

Alternatives that weren't good:

  - browserify and brfs to inject the text. Functional, but browserify will hide all your globals! Ha ha.
  - glslify. Nope, this is specifically for non-three projects.

### Ideas

  - Shift out the R, G, B elements to create a Teleglitch-style 'broken display' effect.
  - Scanlines.
  - "Multiply is much faster than divide, so do x * 0.5 rather than x / 2." Not sure I believe this.

## Colors

THREE will define a `color` shader variable, but it's undocumented.

Sometimes colors are defined in your **material**. BasicMaterial has a single `color` property.
Sometimes colors are defined in your **object**. Geometry has an array `colors`. It appears the object can store color data which should be honoured. See https://github.com/mrdoob/three.js/issues/1516

In my testing a Mesh with a ShaderMaterial does not pass Geometry.colors to the vertex shader - you just get `#ffffff` in the `color` attribute every time.

API doc for Geometry.colors:

    Array of vertex colors, matching number and order of vertices.
    Used in ParticleSystem and Line.
    Meshes use per-face-use-of-vertex colors embedded directly in faces.
    To signal an update in this array, Geometry.colorsNeedUpdate needs to be set to true.

A Face3 has a `vertexColors` array. The example http://threejs.org/examples/#webgl_geometry_colors uses this array to set colors face by face, as mentioned in the doc above. The example does **not** use any of the 'needsUpdate' flags associated with color.

### Coloring a Line

I confirmed this works:

    lineGeometry.colors.push(new THREE.Color( 0x00aa00 ));
    lineGeometry.colors.push(new THREE.Color( 0xffffff ));
    lineMaterial.vertexColors = THREE.VertexColors;

So if we push eight colors into `myCube.geometry.colors` and use a ShaderMaterial, why aren't they honoured in the vert shader?

### Questions

  - When using a ShaderMaterial, how does the attribute `color` get its value?
  - What's the point of the `ShaderMaterial.vertexColors` flag?
  - Should Geometry.colors ever be used with a Mesh, or just ParticleSystem and Line?

# Misc TO DO

shader - need a texture that shows no rotation

look into module loading https://github.com/dnschneid/crouton/issues/364#issuecomment-45142414

http://www.html5rocks.com/en/tutorials/webgl/million_letters/
http://thndl.com/?1

render a texture

what's the relationship between THREE shader chunks and your shader? How does it get merged?

figure out that three.js ShaderMaterial color behaviour

difference between uv and uv2?

cubes:
- rotate individually
- light individually
- texture individually

post-process http://www.airtightinteractive.com/2013/02/intro-to-pixel-shaders-in-three-js/

efficient noise https://github.com/ashima/webgl-noise

write shader guide
  - basics
  - pixel shaders
  - how to set up a basic project

Resources

http://c0de517e.blogspot.ca/2014/04/smoothen-your-functions.html
http://in2gpu.com/2014/06/23/toon-shading-effect-and-simple-contour-detection/
https://twitter.com/mattdesl/status/481271081467400192
