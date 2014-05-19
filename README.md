Testing shaders with three.js.

`main.js` must be processed if you make changes:

    browserify -t brfs js/main.js -o build/browserified.js

This takes the shader code from `shaders/` and inserts it into main.js.
