jQuery(function() {
 if( jQuery("#postimagediv").length )
  jQuery("<div id='simple-featured-image-finder'> <input id='q' placeholder='Search for free images' /> <span class='enter'>enter</span> <i title='Cancel' class='fa fa-times cancel-search'></i> <i class='fa fa-caret-left sliding-arrow'></i> <i class='fa fa-caret-right sliding-arrow'></i> <i class='fa fa-refresh sliding-arrow'></i> <ul class='images-slider'><li class='indicator'><i class='fa fa-spinner fa-pulse fa-4x fa-fw'></i></li></ul> </div> <div id='simple-featured-image-finder-details'></div>").insertAfter("#postimagediv .inside");

 var sfif = jQuery("#simple-featured-image-finder");
 var sfifd = jQuery("#simple-featured-image-finder-details");
 var slider = jQuery("#simple-featured-image-finder ul.images-slider");
 var qinput = jQuery("#simple-featured-image-finder input#q");
 var foundImages = 0;
 var page = 1;
 var viewingImage = 1;
 var query = '';
 var loaded = 0;
 var indicator = slider.find("li.indicator");


 jQuery(document).on("keypress", "#simple-featured-image-finder input#q", function(event) {
  var keycode = event.keyCode || event.which;
  if(keycode=="13") event.preventDefault();
  if(keycode=="13" && qinput.val().length>=3) {
   jQuery("i.sliding-arrow").hide();
   slider.show();
   slider.css('left', 0); foundImages = 0; page = 1;
   indicator.fadeIn();
   indicator.nextAll().remove();
   query = qinput.val().replace(/<\/?[^>]+(>|$)/g, "");
    jQuery.post( mentorgashi_sfif.ajaxurl, { query: query, action: 'sfif_search_images', nonce: mentorgashi_sfif.nonce } )
    .done(function( data ) {
     if(data) {
      if(data=='Please setup your Unsplash APP ID!') {
        indicator.hide(); slider.hide();
        sfifd.html(data).show();
      } else {
        jQuery("#simple-featured-image-finder i.cancel-search").show();
         viewingImage = 1;
         var total = data.split("||");
         foundImages = total[0];
         var content = total[1];

         jQuery(content).insertAfter(indicator);

         loaded = slider.children().length - 1;
         if(foundImages==0) viewingImage = 0;
         sfifd.html("Total images: "+foundImages+", Loaded: "+loaded+", Viewing: <font>"+viewingImage+"</font>").show();

         jQuery("i.sliding-arrow.fa-caret-right").show();
         sfif.find("li.image-suggestion").each(function() { jQuery(this).width(sfif.width()); });
         indicator.hide();
         if(foundImages==0) slider.hide();
      }
     }
    });
  }
 });

 jQuery(document).on("click", "#simple-featured-image-finder .sliding-arrow", function() {
 	var self = jQuery(this);
 	var position = slider.position();
 	var total = slider.children().length - 1;
 	var maxleft = (total * 258) * (-1);
 	if(self.hasClass("fa-caret-right")) {
 		var nextPosition = position.left - (sfif.width()+10);
 		if(nextPosition!=maxleft) {
 			viewingImage++; sfifd.find("font").html(viewingImage);
 			self.prev().show();
 			slider.css('left',nextPosition);
 			if(maxleft==(nextPosition-sfif.width())) {
 				self.hide();
 				self.next().show();
 			}
 		}
 	} else if(self.hasClass("fa-caret-left")) {
		if((position.left + sfif.width())<=0) {
			viewingImage--; sfifd.find("font").html(viewingImage);
			self.next().show(); self.next().next().hide();
			slider.css('left', position.left + (sfif.width()-10) ); 
		} else { 
			slider.css('left',0);
			self.hide();
		}
 	}
 });

 jQuery(document).on("click", "#simple-featured-image-finder .fa-refresh.sliding-arrow", function() {
 	var self = jQuery(this);
 	self.addClass("fa-spin");
 	page++; query = query.replace(/<\/?[^>]+(>|$)/g, "");
 	jQuery.post( mentorgashi_sfif.ajaxurl, { query: query, page: page, action: 'sfif_search_images', nonce: mentorgashi_sfif.nonce } )
    .done(function( data ) {
     if(data) {
       var total = data.split("||");
       foundImages = total[0];
       var content = total[1];

       slider.append(content);
       loaded = slider.children().length - 1;
       sfifd.html("Total images: "+foundImages+", Loaded: "+loaded+", Viewing: <font>"+viewingImage+"</font>");
       self.removeClass('fa-spin').hide();
       self.prev().show();
       sfif.find("li.image-suggestion").each(function() { jQuery(this).width(sfif.width()); });
     }
    });
 });

 jQuery(document).on("click","#simple-featured-image-finder span.enter", function() {
 	var e = jQuery.Event("keypress");
	e.which = 13;
	e.keyCode = 13;
	jQuery("#simple-featured-image-finder input#q").trigger(e);
 });

 jQuery(document).on("click","#simple-featured-image-finder i.cancel-search", function() {
 	indicator.nextAll().remove();
 	jQuery("#simple-featured-image-finder .sliding-arrow").hide();
 	jQuery("#simple-featured-image-finder input#q").val("");
 	jQuery(this).hide();
 	indicator.hide();
 	slider.hide();
 	sfifd.html("").hide();
 });

 jQuery(document).on("click","#simple-featured-image-finder span.set-featured", function() {
 	var self = jQuery(this);
 	var rawUrl = self.attr("data-raw");
 	var postID = jQuery("#post_ID").val();
 	self.next().remove();
 	self.remove();

 	qinput.hide();
 	jQuery("#simple-featured-image-finder i.cancel-search").hide();
 	jQuery("#simple-featured-image-finder span.enter").hide();
 	jQuery("#simple-featured-image-finder .sliding-arrow").hide();

 	sfifd.html("<i class='fa fa-spinner fa-pulse'></i> Downloading media into your site...");

 	jQuery.post( mentorgashi_sfif.ajaxurl, { raw_url: rawUrl, post_id: postID, action: 'sfif_select_image', nonce: mentorgashi_sfif.nonce2 } )
    .done(function( data ) {
     if(data) {
     	sfifd.html("<i class='fa fa-check'></i> Featured image selected.");
     	setTimeout(function() {
     		sfif.hide(); sfifd.hide();
        	jQuery("#postimagediv .inside").html(data);
     	}, 450);
     }
    });
 });

});