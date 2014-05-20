Testing shaders with three.js.

# Run it

    $ sudo npm install -g bower
    $ sudo npm install -g browserify
    $ npm install
    $ bower install
    $ google-chrome index.html

# Make changes

    # change main.js or shaders
    $ browserify -t brfs js/main.js -o build/browserified.js
    # or use watcherify

# Dependencies

  - I used `bower` to get `threestrap`, https://github.com/unconed/threestrap
  - Loading shaders is ugly. I used `browserify` to push shader text files into `main.js` as formatted strings.
