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
> **git branch `asset-management` contains the final code for this section**
> Extra Reading on fonts: [SurviveJS](https://survivejs.com/webpack/loading/fonts/)

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

### Loading Fonts

So lets add a way to handle another type of asset which is fonts

#### webpack.config.js
```diff
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
+     {
+       test: /\.(woff|woff2|eot|ttf|otf)$/i,
+       type: 'asset/resource',
+     },
    ],
  },
```
## Loading Data

Other asset that can be loaded such as Json, XML, CSV etc can also be used 

Actually JSON suport is <u>inbuilt</u> for **NodeJS** for other data types we need to use loaders

    npm i -D csv-loader xml-loader

#### webpack.config.js
```diff
...
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
+     {
+       test: /\.(csv|tsv)$/i,
+       use: ['csv-loader'],
+     },
+     {
+       test: /\.xml$/i,
+       use: ['xml-loader'],
+     },
    ],
  },
```

### Customised parsers for JSON modules

Its possible to import any `toml`, `yaml` or `json5` files as a JSON module using a [custom parser](https://webpack.js.org/configuration/module/#ruleparserparse) instead of a specific webpack loader 

    npm i -D toml yaml json5

#### webpack.config.js
```diff
...
      {
        test: /\.(csv|tsv)$/i,
        use: ['csv-loader'],
      },
      {
        test: /\.xml$/i,
        use: ['xml-loader'],
      },
+     {
+       test: /\.toml$/i,
+       type: 'json',
+       parser: {
+         parse: toml.parse,
+       },
+     },
+     {
+       test: /\.yaml$/i,
+       type: 'json',
+       parser: {
+         parse: yaml.parse,
+       },
+     },
+     {
+       test: /\.json5$/i,
+       type: 'json',
+       parser: {
+         parse: json5.parse,
+       },
+     },
    ],
  },
```
## Global Assets 

You can group assets in a more intuitive way for example take a look at this structure

```diff
- |- /assets
+ |– /components
+ |  |– /my-component
+ |  |  |– index.jsx
+ |  |  |– index.css
+ |  |  |– icon.svg
+ |  |  |– img.png
```

You could lets say use the `/my-component` in another project provided the same loaders are used

## Output Management

We would like to out put more than one file
We can set up multiple entry points

#### webpack.config.js

```JavaScript
module.exports = {
  entry: {
    index: './src/index.js',
    print: './src/print.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
```
### HtmlWebpack Plugin
What if we want to change one of the names of our files 


#### webpack.config.js
```js
// import plugin after npm installing 
const htmlWebpackPlugin = require('html-webpack-plugin')

// add this to config 
{
  plugin: [
    new htmlWebpackPlugin(
      { title: 'Output Management' }
    )
  ]
}
```
The plugin will generate its own index.html which means it will replace our own with its own minified version with all its bundles

read more about htmlWebpackPlugin from [repo](https://github.com/jantimon/html-webpack-plugin)

### Cleaning Output folder
There will probably be a lot of clutter in output folder so we can config webpack to clean 

```diff
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
+   clean: true,
  }
```
### Further Reading
#### Manifest 
Webpack and its plugins seem to *know* what files are being generated 

The is becuase in the manifest that webpack keeps to track how all the modules map to the output bundles 

If you're interested in managing webpack's [output](https://webpack.js.org/configuration/output) in other ways, the manifest would be a good place to start

The manifest data can be extracted into a json file for consumption using the [WebpackManifestPlugin](https://github.com/shellscape/webpack-manifest-plugin)

[Concept page](https://webpack.js.org/concepts/manifest) 

## Development 

There are some settings that you want for development but not neccessarily for the production

### Source Maps

**Problem**: Say you are bundling three source files `a.js`, `b.js` & `c.js` into `bundle.js` if you do a stack trace it will lead to `bundle.js` which is probably not useful

**Soution**: <a href="http://blog.teamtreehouse.com/introduction-source-maps">source maps</a>, which map your compiled code back to your original source code. If an error originates from <code>b.js</code>, the source map will tell you exactly that

There are lots of [options](https://webpack.js.org/configuration/devtool) for sourcemaps but we will try `inline-source-map`

#### webpack.config.js
```diff
+ mode: 'development',
+ devtool: 'inline-source-map',
```
If we have an error say in `print.js`

Then if you build and run the index.html and look in console you get exactly where the error is in the console's error message with both **line and column number**

    print.js:2 Uncaught ReferenceError: cosole is not defined
    at HTMLButtonElement.printMe (print.js:2:1)

### Automatic Builds

It can be tedious to run `npm run build` 

Multiple solutions
1. **webpack's watch mode**
1. **webpack's dev server**
1. **webpack's dev middleware**

### Watch mode

#### package.json
```diff
   "scripts": {
     "test": "echo \"Error: no test specified\" && exit 1",
+    "watch": "webpack --watch",
     "build": "webpack"
   },
```
**Unfortunately you need to refresh browser for changes to take effect**

### Dev Server 

    npm i -D webpack-dev-server

#### webpack.config.js
```diff
+  devserver: {
+    static: './dist',
+  },
   plugins: [
     new HtmlWebpackPlugin({
       title: 'Development',
     }),
   ],
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
     clean: true,
   },
+  optimization: {
+    runtimeChunk: 'single',
+  },
 };
```
> **Note:** optimization was added becuase we used multiple enry points 

> **Note:** `webpack-dev-server` serves bundled files from the directory defined in `output.path`, i.e., files will be available under` http://[devServer.host]:[devServer.port]/[output.publicPath]/[output.filename]`


so now dev server will serve files from `./dist` on `localhost:8080`

add this command to **npm scripts**

    "start": "webpack serve --open"

### More Documentation 

[webpack-dev-server](https://webpack.js.org/configuration/dev-server)
[hot module replacement](https://webpack.js.org/guides/hot-module-replacement)

## Middleware 

install `express` and `webpack-dev-middleware`

```diff
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
+   publicPath: './',
  },
```

this makes sure that files will be served on `http://localhost:8080`

#### ./server.js
```js
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

const app = express()
const config = require('./webpack.config')
const compiler = require(config)

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base
app.use(
  webpackDevMiddleware(compiler, { publicPath: config.output.publicPath }),
)

// serve file on port 3000 
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
})
```

now add npm script 
    "server": "node server.js"

## Code Splitting

This feature allows you to split your code into various bundles which can then be loaded on demand or in parallel

It can be used to achieve smaller bundles and control resource load prioritization which, if used correctly, can have a major impact on load time

The general approaches for code splitting available:
1. **Entry Points**: Manually split code using the `entry` config
2. **Prevent Duplication**: Use Entry [dependencies](https://webpack.js.org/configuration/entry-context/#dependencies) or [SplitChunksPlugin](https://webpack.js.org/plugins/split-chunks-plugin/) to dedupe and split chunks
3. **Dynamic Imports**: Split code via inline function calls within modules

### Entry Points 
We will have `src/another-module.js`

```diff
+++ webpack.config.js
 const path = require('path');
 module.exports = {
- entry: './src/index.js',
+ mode: 'development',
+ entry: {
+   index: './src/index.js',
+   another: './src/another-module.js',
+ },
   output: {
-   filename: 'main.js',
+   filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
 };
```
**There Are Weaknesses**

- If there are any duplicated modules between entry chunks they will be included in both bundles
- It isn't as flexible and can't be used to dynamically split code with the core application logic

> In our case `lodash` imported from both bundles hence we have some duplication

### Prevent Duplication
#### Entry Dependencies
**Webpack.config.js**
```diff
+++ webpack.config.js
 const path = require('path');
 module.exports = {
  mode: 'development',
  entry: {
-   index: './src/index.js',
-   another: './src/another-module.js',
+   index: {
+     import: './src/index.js',
+     dependOn: 'shared',
+   },
+   another: {
+     import: './src/another-module.js',
+     dependOn: 'shared',
+   },
+   shared: 'lodash',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
+ optimization: {
+   runtimeChunk: 'single',
+ }
 };
```
For the [reason](https://bundlers.tooling.report/code-splitting/multi-entry/) for the optimization 

As you can see the `dependsOn` option allows the sharing of modules between chunks

If you build with these setting you should output `runtime.bundle.js` `shared.bundle.js` `index.bundle.js` `another.bundle.js`

> **Advice**: Although multiple entry points can work with webpack it is better to use one entry point with multiple imports 
> 
> *This results in a better optimization and consistent execution order when using async script tags*

#### SplitChunksPlugin
[documentation](https://webpack.js.org/plugins/split-chunks-plugin/)
This allows us to extract common dependencies into an existing entry chunk or an entirely new chunk

``` diff
const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    another: './src/another-module.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
+ optimization: {
+   splitChunks: {
+     chunks: 'all',
+   },
+ },
}
```

Here is another plugin that helps split CSS from the main apllication [mini-css-extract-plugin](https://webpack.js.org/plugins/mini-css-extract-plugin)

## Dynamic Imports

Two similiar ways for dynamic code splitting 

1. [import() syntax](https://webpack.js.org/api/module-methods/#import-1) conforms to [ECMAScript proposal](https://github.com/tc39/proposal-dynamic-import)
2. *Legacy Approach*: [require.ensure](https://webpack.js.org/api/module-methods/#requireensure)  

### Import Syntax

> `import()` calls use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">promises</a> internally. 
If you use <code>import()</code> with older browsers (e.g., IE 11), 
remember to shim <code>Promise</code> using a polyfill 
such as <a href="https://github.com/stefanpenner/es6-promise">es6-promise</a> or <a href="https://github.com/taylorhakes/promise-polyfill">promise-polyfill</a>

```js
// Using Dynamic Imports to import lodash

function getComponent() {
  return import('lodash').then(({ default: _ }) => {
    const element = document.createElement('div')
    element.innerHTML = _.join(['Hello', 'webpack'], ' ')
  })
}

getComponent().then((component) => {
  document.body.appendChild(component)
})

```

> **Note:** The reason we need <code>default</code> is that since webpack 4, when importing a CommonJS module, the import will no longer resolve to the value of <code>module.exports</code>, it will instead create an artificial namespace object for the CommonJS module. For more information on the reason behind this, read <a href="https://medium.com/webpack/webpack-4-import-and-commonjs-d619d626b655">webpack 4: import() and CommonJs</a>.

Above we have `import()` function return a promise however we can use the `async/await`

``` sh
[webpack-cli] Compilation finished
asset vendors-node_modules_lodash_lodash_js.bundle.js 549 KiB [compared for emit] (id hint: vendors)
asset index.bundle.js 13.5 KiB [compared for emit] (name: index)
runtime modules 7.37 KiB 11 modules
cacheable modules 530 KiB
  ./src/index.js 434 bytes [built] [code generated]
  # below line shows that lodash is bundled seperately
  ./node_modules/lodash/lodash.js 530 KiB [built] [code generated]
webpack 5.4.0 compiled successfully in 268 ms
```

## Preloading / Prefetching modules

You can give **resource hints** to the browser 

-  **prefetch**: resource is probably needed for some navigation in the future
-  **preload**: resource will also be needed during the current navigation

### example 

Imageine a *HomePage Component*, which renders a `LoginButton` component which then on demand loads a `LoginModal` component after being clicked.

```ts
/**** LoginButton.js ****/

//...
import(/* webpackPrefetch: true */ './path/to/LoginModal.js');
```
This will result in below being appended in the head of the page, which will instruct the browser to prefetch in idle time the `login-modal-chunk.js` file.
```html
<link rel="prefetch" href="login-modal-chunk.js">
```

**Differences between preload and prefetch directive**:

- A preloaded chunk starts loading in parallel to the parent chunk whilst a prefetched chunk starts after the parent chunk finishes loading

- A preloaded chunk has medium priority and is instantly downloaded a prefetched chunk is downloaded while the browser is idle

- A preloaded chunk should be instantly requested by the parent chunk a prefetched chunk can be used anytime in the future

- Browser support is different

```ts
/**** ChartComponent.js ****/

//...
import(/* webpackPreload: true */ 'ChartingLibrary');
```
When a page which uses the ChartComponent is requested, the `charting-library-chunk` is also requested via below link 

```html
<!-- outputed html -->
<link rel="preload">
```
Assuming the page-chunk is smaller and finishes faster, the page will be displayed with a LoadingIndicator, until the already requested `charting-library-chunk` finishes. This will give a little load time boost since it only needs one round-trip instead of two. Especially in <dfn title="In computing, 'latency' describes some type of delay. It typically refers to delays in transmitting or processing data, which can be caused by a wide variety of reasons">high-latency environments</dfn>

> **Note** that webpackpreload can actually hurt performance if not used correctly

## Bundle Analysis

Once you start splitting your code, it can be useful to analyze the output to check where modules have ended up. The [official analyze tool](https://github.com/webpack/analyse) is a good place to start

Other Tools:

- [webpack-chart](https://alexkuz.github.io/webpack-chart/): Interactive pie chart for webpack stats

- [webpack-visualizer](https://chrisbateman.github.io/webpack-visualizer/): Visualize and analyze your bundles to see which modules are taking up space and which might be duplicates

- [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer): A plugin and CLI utility that represents bundle content as a convenient interactive zoomable treemap

- [webpack bundle optimize helper](https://webpack.jakoblind.no/optimize): This tool will analyze your bundle and give you actionable suggestions on what to improve to reduce your bundle size

- [bundle-stats](https://github.com/bundle-stats/bundle-stats): Generate a bundle report(bundle size, assets, modules) and compare the results between different builds

### Further Reading

[<link rel="prefetch/preload"/> in webpack](https://medium.com/webpack/link-rel-prefetch-preload-in-webpack-51a52358f84c)
[Preload, Prefetch And Priorities in Chrome](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf)
[Preloading content with <link rel="preload"/>](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content)

## Caching

```diff
+++ webpack.config.js
    output: {
     filename: 'bundle.js',
+    filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
```
```sh
# notice the hash so each time we build we have a different file
asset main.629b90e6e38badf3e1a3.js 554 KiB [emitted] [immutable] (name: main)
asset index.html 248 bytes [emitted] [compared for emit]
runtime modules 1.25 KiB 6 modules
cacheable modules 532 KiB
  ./src/index.js 323 bytes [built] [code generated]
  ./node_modules/lodash/lodash.js 531 KiB [built] [code generated]
webpack 5.73.0 compiled successfully in 235 ms
```

### Extracting Boilerplate

```diff
+++ webpack.config.js
  optimization: {
+   runtimeChunk: 'single',
  },
```

As we learned in code splitting, the `SplitChunksPlugin` can be used to split modules out into separate bundles. Webpack provides an optimization feature to split runtime code into a separate chunk using the `optimization.runtimeChunk` option. Set it to single to create a `single` runtime bundle for all chunks

**Now when we build we see the single runtime chunk**
```
assets by status 559 KiB [cached] 2 assets
asset index.html 309 bytes [compared for emit]
Entrypoint main 559 KiB = runtime.03d2c3d5a26e3844f8af.js 7.6 KiB main.6bd62deb07d784980e57.js 551 KiB
runtime modules 3.64 KiB 8 modules
cacheable modules 532 KiB
  ./src/index.js 323 bytes [built] [code generated]
  ./node_modules/lodash/lodash.js 531 KiB [built] [code generated]
webpack 5.73.0 compiled successfully in 236 ms
```