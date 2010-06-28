/* Lib to display a scene (or map) in browser.
 * 
 * A scene is a set of objects (img) having a define position in a given area.
 * Depending of their options, objects can be moved / resized.
 * 
 * It is possible to zoom in/out on the scene, 
 * as well as to "navigate" (by dragging the background).
 *
 * Dependencies:
 *  - jquery (tested with 1.4)
 *  - jquery.mousewheel plugin (http://github.com/brandonaaron/jquery-mousewheel)
 *  - jquery.px2percent plugin (http://github.com/virtuo/jquery.px2percent)
 *  - jquery.drag_resize plugin (http://github.com/virtuo/jquery.drag_resize)
 *
 */
scene = function(){

 var scene = function(self, scene_element) {
   /* Create a scene.
    *
    * Arguments:
    *   - self: dict containing info about the scene
    *   - scene_element: JQuery html element
    * */

   if(!self.objects) self.objects = [];
   scene_element.html('<div class="wrapper1"><div class="wrapper2"></div></div>');
   scene_element.find('div').css({
     position: 'relative',
     height: '100%'
   });
   var wrapper1 = scene_element.find('.wrapper1'),
       wrapper2 = wrapper1.find('.wrapper2'),
       ref_width = self.width,
       ref_height = self.height,
       ratio = ref_width / ref_height,
       width = ref_width,
       height = ref_height,
       zoom_level = 100.,
       zoom_max = 500,
       zoom_min = 30,
       ids2elements = {}, // Associate an object id with a jquery element

   add_object = this.add_object = function(obj, defaults) {
     /* Add the given object to the the scene_element
      *
      * Arguments:
      *   - obj: JSON representation of the object to place in the scene.
      *   - defaults: to be used in case obj doesn't define a wanted property.
      *   
      *   The obj contains the following placement info:
      *     top, left, width, height
      *   There are all exprimed in '%' unless string 
      *   (you should then specify '%' or 'px')
      *   
      */
     defaults = defaults || {};
     var ext_obj = $.extend({}, defaults, obj);
     if($.isFunction(ext_obj.title)) {
       ext_obj.title = ext_obj.title(obj);
     }
     var src = $.isFunction(ext_obj.src) && ext_obj.src(obj) || ext_obj.src;
     var css_classes = ext_obj.css_classes || [];
     css_classes.push('obj');
     var html = '<div class="' + css_classes.join(' ') + '"><img src="' + src +
                '" title="' + ext_obj.title + '"/></div>';
     var element = wrapper2.append(html)
                   .children(":last"); // the element we have just inserted
     ids2elements[obj.id] = element;
     element.data('obj', obj);
     if(ext_obj.movable) element.addClass("drag");
     if(ext_obj.resizable) element.append('<div class="resize"></div>');
     update_position_object(obj.id, ext_obj);

     element.filter(".drag")
     .jqdrag(function() {
       element.px2percent(width, height, zoom_level);
       obj.top = parseFloat(element.css("top"));
       obj.left = parseFloat(element.css("left"));
       ext_obj.update_callback && ext_obj.update_callback(obj);
     })
     .jqresize('.resize', function() {
       element.px2percent(width, height, zoom_level);
       obj.width = parseFloat(element.css("width"));
       obj.height = parseFloat(element.css("height"));
       ext_obj.update_callback && ext_obj.update_callback(obj);
     });
   },

   update_position_object = this.update_position_object = function(obj_id, obj) {
     /* Update the position of the object.
      * obj must contain the following properties: width, height, top, left, z.
      */
     ['width', 'height', 'left', 'top'].forEach(function(attr) {
       if(typeof obj[attr] != 'string') {
         obj[attr] += '%';
       }
     });
     ids2elements[obj_id].css({
       width: obj.width,
       height: obj.height,
       left: obj.left,
       top: obj.top,
       z: obj.z
     })
     .px2percent(ref_width, ref_height);
   },

   remove_object = this.remove_object = function(obj_id) {
     /* Remove the object with given id from map.
      */
     ids2elements[obj_id].remove();
     delete ids2elements[obj_id];
   },

   zoom = function(delta, event) {
     /* Zoom in or out in the scene.
      * The point under the cursor stays at the same place.
      */
     var offset = wrapper2.offset(),
         position = wrapper2.position(),
         coeff = delta / zoom_level;
         
     zoom_level += delta;
     if(zoom_level > zoom_max || zoom_level < zoom_min) {
       zoom_level -= delta;
       return;
     }
     wrapper2.css({
       left: position.left - (event.pageX - offset.left) * coeff + 'px',
       top: position.top - (event.pageY - offset.top) * coeff + 'px',
       height: zoom_level + '%',
       width: zoom_level + '%'
     });
   };

   $.each(self.objects, function(i, obj) {
    add_object(obj);
   });
    
   scene_element.css("max-width", ref_width + "px");
   var resize = function(){
     // To let the width be calculated by the browser:
     scene_element.css("width", "");
     wrapper2.children().each(function(i, e){ 
       $(e).px2percent(width, height, zoom_level);
     });
     width = scene_element.width();
     height = width / ratio;
     // althought it should already have the width value
     // we need to set it back, because sometimes the resize
     // event is triggered before the actual size of the scene changes:
     scene_element.width(width)
                  .height(height);
   };

   scene_element
   .mousewheel(function(event, delta) {
     zoom(delta * 4, event);
     return false;
   });

   wrapper1.jqdrag(function(){
     var position1 = wrapper1.position(),
         position2 = wrapper2.position();
     wrapper2.css({
       top: position1.top + position2.top + 'px',
       left: position1.left + position2.left + 'px'
     });
     wrapper1.css({
       top: 0,
       left: 0
     });
   });

   $(window).resize(resize);
   resize();

 };

 return scene;
}();

