Testing shaders with three.js.

# Run it

    $ sudo npm install -g bower
    $ npm install
    $ bower install
    $ google-chrome index.html

# Make changes

    $ sudo npm install -g browserify
    # change main.js or shaders
    $ browserify -t brfs js/main.js -o build/browserified.js
    # or use watcherify

# Dependencies

  - I used `bower` to get `threestrap`, https://github.com/unconed/threestrap
  - Loading shaders is ugly. I used `browserify` to push shader text files into `main.js` as formatted strings.

# Learnings

You can't have a `varying attribute`. If you want to pass an `attribute` or `uniform` through to fragment, you'll need to declare a separate `varying`.

THREE does a lot of hidden 'prefixed' shader work on your behalf. You can [avoid this using RawShaderMaterial](https://github.com/mrdoob/three.js/issues/3121).

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
