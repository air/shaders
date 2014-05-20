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

THREE will define a `color` shader variable, but it's undocumented. Q: When using a ShaderFragment, how does color get its value?

Colors are defined in your **material**. BasicMaterial has a single `.color` property. Geometry has a bunch of color properties - ignore them.