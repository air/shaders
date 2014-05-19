Testing shaders with three.js.

# Run it

Just open in your browser.

# Dependencies

  - I used `bower` to get `threestrap`, https://github.com/unconed/threestrap
  - Loading shaders is ugly. I used `browserify` to push shader text files into `main.js` as formatted strings.

# Make changes

    $ sudo npm install -g bower
    $ sudo npm install -g browserify
    $ npm install
    $ bower install
    # make changes to main.js
    $ browserify -t brfs js/main.js -o build/browserified.js
    $ google-chrome index.html
