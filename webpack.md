```jsonc
/* To use webpack we need the api & the cli */
  "devDependencies": {
    "webpack": "^5.73.0",
    "webpack-cli": "^4.9.2"
  }
```

Right now, there are implicit dependencies between the `<script>` tags

Our `index.js` file depends on lodash being included in the page before it runs. This is because `index.js` never explicitly declared a need for `lodash`; it assumes that the global variable `_` exists

There are problems with managing JavaScript projects this way:

* It is not immediately apparent that the script depends on an external library
* If a dependency is missing, or included in the wrong order, the application will not function properly
* If a dependency is included but not used, the browser will be forced to download unnecessary code

Let's use webpack to manage these scripts instead

## source and distribution code

We create two folders one for our *source* code `src` where we write and edit our code and another for our *distribution* code `dist` where code is minimised and optimised for `output` displayed in browsers

## Running webpack 

 `npx webpack`, with `src/index.js` as the entry point, it will generate `dist/main.js` as the output
 
 >The `npx` command, which ships with **Node 8.2/npm 5.2.0 or higher**, runs the webpack binary `./node_modules/.bin/webpack` of the webpack package we installed in the beginning