
submodules:
	git submodule update --init --recursive

install: submodules symlink_js templates_ms
	cd vendor/mustache.js && mkdir -p lib && \
		cat mustache-commonjs/mustache.js.tpl.pre mustache.js mustache-commonjs/mustache.js.tpl.post > lib/mustache.js


symlink_js:
	ln -f -s ../../../vendor/js_client/ajax-upload/ajaxupload.js src/public/js/
	ln -f -s ../../../vendor/js_client/jquery.drag_resize/jquery.drag_resize.js src/public/js/
	ln -f -s ../../../vendor/js_client/jquery.px2percent/jquery.px2percent.js src/public/js/
	ln -f -s ../../../vendor/js_client/jquery.mousewheel/jquery.mousewheel.js src/public/js/
	ln -f -s ../../../vendor/js_client/sammy/lib/sammy.js src/public/js/
	ln -f -s ../../../vendor/mustache.js/mustache.js src/public/js/
	ln -f -s ../../../vendor/Socket.IO/socket.io.js src/public/js/
	ln -f -s ../../../vendor/Socket.IO/lib/vendor/web-socket-js/WebSocketMain.swf src/public/js/

templates_ms:
	python vendor/jquery.mustache/src/generate_templates.py -d src/templates/ -l fr -o src/public/js/

