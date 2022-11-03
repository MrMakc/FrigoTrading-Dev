# Marmite


<!-- _ /!\ Warning: if you work on Marmite src, be sure to launch `gulp clean` before your commit ! -->


## How to install
### First of all, you need to clone Marmite
In the project folder you previously created, just copy this line in your command:

`git clone --depth=1 --branch=master git@gitlab.c2is.fr:marmite.git && rm -rf !$/.git && cp -R marmite/. ./ && rm -rf marmite/`



### Node + Gulp
_Requirement:_
Before working, you need to have installed or install [NodeJS](https://nodejs.org)



#### 1/ Installation
You need to execute these commands:
First `npm install` 
Next `npm run marmite`

Automatically, the `gulp init` and `gulp` tasks are executed  :
- the styleguide is construct
- vendors are bundled
- all the gulp tasks are executed (css, js, img, html)


#### 2/ After
You need to execute this command:
`gulp start`
- all css/js are generated from scss/js
- images are copied to marmite-dist
- a new browser window is open to http://localhost:8080 (with liveReloading enable in Chrome ; NOT in Firefox : you need to activate it)
- `gulp watch` is exectuted too.
- remove /marmite-dist/ from .gitignore file to commit build templates of your project 
- Now you just need to do for what your are the best :)





## Gulp tasks

* `gulp init`  
Run 'styleguide_assets', 'build-dependencies', 'font', 'default'

* `gulp vendors`  
Must be run when you add vendors via npm install (i.e. slickJS, colorbox, etc.) 

* `gulp` (default)  
This task will run by sequences: img > js and css in parallel > html 

* `gulp start`  
This task will run by sequences: default > connect and watch

* `gulp connect`  
This task open a new browser window to http://localhost:8080 (with liveReloading enable in Chrome ; NOT in Firefox : you need to activate it)

* `gulp watch`  
This task listen if twig, css, js or img file id modify and run the adequate task

* `gulp js`  
Run 'build-modernizr', 'lint', 'build-js'

* `gulp css`  
Run 'build-modernizr', 'build-css'

* `gulp html`  
Run 'build-html'

* `gulp prep`  
This task clean prep directory and copy marmite-dist into prep 

* `gulp clean`
Delete build files in marmite-dist folder
