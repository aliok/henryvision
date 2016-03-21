TODOs:

- Blog post
- Video
    - Embed in Git repo
    - Embed in blog post
- About section in settings

### Local development

RHMAP offers Node 0.10.0 as latest version (because of Openshift I think). However, Ionic requires Node 4.x.
Thus, I used <https://github.com/tj/n>.

##### Wordnet service:

    npm install -g npm@~2
    npm install
    n 0.10.0 wordnet-service/server.js

Available at <http://127.0.0.1:8001>.

##### Vision service:

    npm install -g npm@~2
    npm install
    GOOGLE_VISION_SERVICE_API_KEY="<api key you got from Google Developer console>" n 0.10.0 vision-service/server.js

Available at <http://127.0.0.1:8002>.

##### Orchestrate cloud app:

Make sure wordnet and vision services are running first!

    npm install -g npm@~2
    npm install
    FH_SERVICE_MAP='{"nvssok5suaw3fgf3w7fppt3a":"http://127.0.0.1:8002", "jndexd635x46k6etfvwvtu7t":"tp:127.0.0.1:8001"}' n 0.10.0 orchestrate/server.js

Available at <http://127.0.0.1:8010>.

##### Cordova app:

    n 4.4.0
    npm install -g npm@~3
    npm install -g cordova ionic
    cd cordova
    bower install
    ionic build
    ionic run android           # runs on device / emaulator
    ionic serve --live-reload   # runs on browser

Connection to cloud doesn't work when you run on device. I didn't invest time in fixing this.

When you run on browser, you need to tell the app to connect the cloud app running locally.
Thus, go to <http://localhost:8100/?url=http://localhost:8010>



### Git repo structure
Every subfolder is a RHMAP Git repository. This repository uses them as Git [subtrees](https://git-scm.com/book/en/v1/Git-Tools-Subtree-Merging).

Here is how I created this repo:

    mkdir henryvision && cd henryvision
    git init

    git checkout -b master
    touch README.md
    git add README.md
    git commit -m "Added empty README"

    # if you receive `fatal` error in the following, recheckout
    git diff-index HEAD
    git checkout master

    # started with Ionic sample app template in RHMAP
    git remote add -f fh-cordova git@git.openshift.feedhenry.com:aliok/henryvision-henryvision-cordova.git
    git subtree add --prefix=cordova/ fh-cordova master

    # started with Cloud app template in RHMAP
    git remote add -f fh-orchestrate git@git.openshift.feedhenry.com:aliok/henryvision-henryvision-orchestrate.git
    git subtree add --prefix=orchestrate/ fh-orchestrate master

    # started with Barcode service template in RHMAP
    git remote add -f fh-vision-service git@git.openshift.feedhenry.com:aliok/vision-service-vision-service.git
    git subtree add --prefix=vision-service/ fh-vision-service master

    # started with Blank service template in RHMAP
    git remote add -f fh-wordnet-service git@git.openshift.feedhenry.com:aliok/wordnet-service-wordnet-service.git
    git subtree add --prefix=wordnet-service/ fh-wordnet-service master



How to push an individual subtree to RHMAP:

    git subtree push --prefix=wordnet-service/ fh-wordnet-service master
    git subtree push --prefix=vision-service/  fh-vision-service master
    git subtree push --prefix=orchestrate/ fh-orchestrate master
    git subtree push --prefix=cordova/ fh-cordova master



How to pull and individual project from RHMAP:

    git subtree pull --prefix=cordova fh-cordova master
    ...