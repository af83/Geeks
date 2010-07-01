Geeks
=====

Geeks is a node.js application, based on Vision Media's Express.js framework.

*TODO*: Add details here.


Installation
============

Node.js
-------

Geeks works with node -v v0.1.98

Git Repository
--------------

  $ git clone af83@git.af83.com:geeks.git

Geeks depends on a rest-mongo and Socket.IO-node and others, which are vendorized through a git submodules:

  $ git submodule update --init --recursive


Express framework
-----------------

In order to use Geeks, you first need to install "kiwi" which is a small package
management tool.

  $ git clone http://github.com/visionmedia/kiwi
  $ cd kiwi
  $ sudo make

kiwi is installed. Geeks has two dependencies based on visionmedia's work, that
need to be installed with kiwi: Express, and HAML. Install them with:

  $ kiwi install express 0.14.0
  $ kiwi install haml 0.4.5


Nodetk
------
You should have you nodejs libraries (assert, sys...) located somewhere on your NOTE_PATH.


Running
=======

As simple as:

  $ node app.js
