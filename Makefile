
install: symlink_js
	git submodule update --init --recursive
	cd vendor/mustache.js && mkdir -p lib && \
		cat mustache-commonjs/mustache.js.tpl.pre mustache.js mustache-commonjs/mustache.js.tpl.post > lib/mustache.js && \


symlink_js:
	ln -f -s ../../vendor/js_client/ajax-upload/ajaxupload.js public/js/
	ln -f -s ../../vendor/js_client/jquery.drag_resize/jquery.drag_resize.js public/js/
	ln -f -s ../../vendor/js_client/jquery.px2percent/jquery.px2percent.js public/js/
	ln -f -s ../../vendor/js_client/jquery.mousewheel/jquery.mousewheel.js public/js/
	ln -f -s ../../vendor/js_client/sammy/lib/sammy.js public/js/
	ln -f -s ../../vendor/mustache.js/mustache.js public/js/

templates_ms:
	python vendor/jquery.mustache/src/generate_templates.py -d templates/ -l fr -o public/js/

