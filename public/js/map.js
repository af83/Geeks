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

   if(!self.placements) self.placements = [];
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

   add_placement = function(placement) {
     /* Add the given placement to the the scene_element
      *
      * Arguments:
      *   - placement: JSON representation of the placement.
      *   
      *   The placement contains the following placement info:
      *     top, left, width, height
      *   There are all exprimed in '%' unless string 
      *   (you should then specify '%' or 'px')
      *   
      */
     var html = '<div class="obj"><img src="' + placement.src +
                '" title="' + placement.title + '"/></div>';
     var element = wrapper2.append(html)
                   .children(":last"); // the element we have just inserted
     if(placement.movable) element.addClass("drag");
     if(placement.resizable) element.append('<div class="resize"></div>');
     ['width', 'height', 'left', 'top'].forEach(function(attr) {
       if(typeof placement[attr] != 'string') {
         //console.log('%% the attr '+ attr + ' of ', placement);
         placement[attr] += '%';
       }
     });
     element.css({
       width: placement.width,
       height: placement.height,
       left: placement.left,
       top: placement.top,
       z: placement.z
     })
     .px2percent(ref_width, ref_height)

     .filter(".drag")
     .jqdrag(function() {
       element.px2percent(width, height, zoom_level);
       placement.top = parseFloat(element.css("top"));
       placement.left = parseFloat(element.css("left"));
       placement.update_callback && placement.update_callback(placement);
     })
     .jqresize('.resize', function() {
       element.px2percent(width, height, zoom_level);
       placement.width = parseFloat(element.css("width"));
       placement.height = parseFloat(element.css("height"));
       placement.update_callback && placement.update_callback(placement);
     });
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

   $.each(self.placements, function(i, placement) {
    add_placement(placement);
   });
    

   this.add_obj = function(obj) {
    /* Add the given obj to the scene
     * */
    //var placement = {obj: obj, z:2};
    //if(!obj.model.top) {
    //  $.extend(placement, {top: 0, left:0});
    //}
    var placement = obj;
    self.placements.push(placement);
    add_placement(placement);
   };


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

   scene_element.dblclick(function(event) {
     zoom(12, event);
     return false;
   })
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

