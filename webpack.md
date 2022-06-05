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

 ## webpack config

 Once you have the `webpack.config.js` file you can use it in the build process

    webpack --config ./webpack.config.js

> Note webpack should pick up the config file automatically 

## Asset Management

<p>Prior to webpack, front-end developers would use tools like <a href="https://gruntjs.com/">grunt</a> and <a href="https://gulpjs.com/">gulp</a> to process these assets and move them from their <code>/src</code> folder into their <code>/dist</code> or <code>/build</code> directory. The same idea was used for JavaScript modules, but tools like webpack will <strong>dynamically bundle</strong> all dependencies (creating what's known as a <a href="/concepts/dependency-graph">dependency graph</a>). This is great because every module now <em>explicitly states its dependencies</em> and we'll avoid bundling modules that aren't in use.</p>

    npm install --save-dev style-loader css-loader

#### webpack.config.js
```diff
 const path = require('path');

 module.exports = {
   entry: './src/index.js',
   output: {
     filename: 'bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },

  module: {
    rules: [
+      {
+        test: /\.css$/i,
+        use: ['style-loader', 'css-loader'],
+      },
    ],
  },
 };
```

### Loader Chaining and order

* Module loaders can be chained
* Each loader in the chain applies transaformations to the processed resources
* A chain is executed in order *first loader passes its results to the next one* then *next one and so forth*
* Webpack expects last loader to be JavaScript
* If loader order not followed there could be errors

Best Order *otherwise webpack will throw error*
1. `style-loader`
1. `css-loader`

### Loading images

Using Webpack 5 we can also Asset Modules to incorporate loading background images and icons not just css

#### webpack.config.js
```diff
 const path = require('path');

 module.exports = {
   entry: './src/index.js',
   output: {
     filename: 'bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
+     {
+       test: /\.(png|svg|jpg|jpeg|gif)$/i,
+       type: 'asset/resource',
+     },
    ],
  },
 };
```

If all goes well than the image will be proccessed into another file with a different name in the output folder *that means webpack successfully proccessed image*