/******************************
* Utilizer UI Elements
******************************/

var $ui = jQuery.noConflict();

// Utilizer ui elements object
var utilizerUIElements = {};

utilizerUIElements.helper = {

    slideWithArrows: function(arrow, slideHeight) {
      if (arrow.data('sliding')) return;

      var slideInner = arrow.parent().prev();
      var maxNext = -slideInner.height();
      var actualTop = parseInt(slideInner.css('top'));
      if (!actualTop) actualTop = 0;
      var nextTop = arrow.data('go') === 'next' ? actualTop - slideHeight : actualTop + slideHeight;

      if (nextTop > 0) nextTop = 0;
      if (nextTop <= maxNext) return;

      arrow.data('sliding', true);

      slideInner.stop().animate({
        top: nextTop + 'px'
      }, 220, function() {
        arrow.data('sliding', false); // Allowing next click

        if (arrow.parent().parent().hasClass('image-library')) {
          if (nextTop - slideHeight <= maxNext) {
            var imageLibrary = arrow.parent().parent();
            utilizerUIElements.helper.loadImagesFromMediaLibrary(imageLibrary);
          }
        }

      });
    },

  	loadImagesFromMediaLibrary: function(imageLibrary) {

  		var downArrow = imageLibrary.find('.arrows a:last-child');
  		var ajaxOffset = imageLibrary.attr('data-offset') ? parseInt(imageLibrary.attr('data-offset')) : 0;
  		var args = {
  			action: 'uz_ui_load_more_images',
  			offset: ajaxOffset
  		};

  		// Notification of loading images
  		downArrow.children('i').removeClass('fa-angle-down').addClass('fa-spinner fa-spin');

  		$ui.ajax({
  			url: ajaxurl,
  			type: "get",
  			data: args,
  			async: false,
  			dataType: "json",
  			success: function(images) {
  				if (images) {
  					imageLibrary.attr('data-offset', ajaxOffset + 1); // Increment offset

  					var htmlContent = '';
  					var imageLibraryInner = imageLibrary.children('.inner');

  					var skip_class = ( imageLibrary.parents('.uz_tabs').length ) ? 'uz_skip' : '';

  					for (var i = 0; i < images.length; i++) {
  						htmlContent += '<a class="image" href="#"> <img src="' + images[i].url + '" />' +
  							'<input type="radio" name="%name%" class="'+skip_class+'" value="' + images[i].ID + '" /> <span/> </a>';
  					}

  					if (imageLibrary.data('name')) {
  						var inputName = imageLibrary.data('name');
  						inputName = imageLibrary.hasClass('multi') ? inputName + '[]' : inputName;
  						htmlContent = htmlContent.replace(new RegExp('%name%', 'g'), inputName);
  					}

  					if (imageLibrary.hasClass('multi')) {
  						htmlContent = htmlContent.replace(new RegExp('type="radio"', 'g'), 'type="checkbox"');
  					}

  					if (imageLibrary.data('actual')) {

  						var dataActual = String(imageLibrary.data('actual'));

  						if (imageLibrary.hasClass('multi') && dataActual.indexOf(',') > 0) {

  							var pickedImagesId = dataActual.split(",");
  							for (i = 0; i < pickedImagesId.length; i++) {
  								htmlContent = htmlContent.replace(new RegExp('value="' + pickedImagesId[i] + '"', 'g'), 'value="' + pickedImagesId[i] + '" checked="checked"');
  							}

  						} else {
  							htmlContent = htmlContent.replace('value="' + dataActual + '"', 'value="' + dataActual + '" checked="checked"');
  						}

  					}

  					imageLibraryInner.children('i').remove();
  					imageLibraryInner.append(htmlContent);
  					imageLibrary.find('input[checked=checked]').next().addClass('checked');

  				}

  				// Removing notification of loading images
  				downArrow.children('i').removeClass('fa-spinner fa-spin').addClass('fa-angle-down');
  			}
  		});

  	},

    searchIcon: function() {

      var self = $ui(this);
      var itemsHolder = self.parent().next().children('.inner');
      itemsHolder.css({top:0});
      itemsHolder.find('i').hide();

      var queries = self.val().split(' ');

      $ui.each(queries, function(i, query) {
        var foundItems = itemsHolder.find('i.fa:regex(class, .*' + query + '.*)');
        foundItems.each(function(i, item) {
          $ui(item).show();
        });

      });

    }

};

utilizerUIElements.invoke = {

  showImages: function(loadCallback) {
    $ui(".uz_input").find('div.image_show').each(function(i, imageShow) {
      imageShow = $ui(imageShow);

      imageShow.find('img').load(function(){
        typeof loadCallback === 'function' && loadCallback();
      });
    });
  },

  selects: function() {

    $ui(".uz_input").find('select').each(function(i, select) {
			select = $ui(select);
      if( select.data('actual') ) select.find('option[value='+select.data('actual')+']').attr('selected','selected');
		});

  },

  checkbox: function() {

    $ui(".uz_input").find('a.checkbox').each(function(i, checkbox) {

      checkbox = $ui(checkbox);
			checkbox.find('input[type=checkbox]').attr('checked', 'checked');
			var dataActual = checkbox.data('actual');
			var dataDefault = checkbox.data('default');

			// By default has Off state on view manner (moving css left sets it on)
			switch (dataActual) {
				case 0:
					checkbox.find('input[type=checkbox]').val(0);

					if( checkbox.hasClass('uz_collapser') ) {
						checkbox.parent().nextAll('.uz_collapse').toggleClass('uz_hidden');
					}

				break;
				case 1:
					checkbox.find(':first-child').css({'left': '-96px'});
					checkbox.find('input[type=checkbox]').val(1);
				break;
				default:
					if(dataDefault === 1) checkbox.find(':first-child').css({'left': '-96px'});
					checkbox.find('input[type=checkbox]').val(dataDefault);
				break;
			}

		});

  },

  colorpicker: function() {

    $ui(".uz_input").find('.iris-color-picker').each(function(i, colorpicker) {

      colorpicker = $ui(colorpicker);

      var pickerOk = colorpicker.prev();
      var dataDefault = colorpicker.data('default-color');

      pickerOk.css('color', '#464646');

      colorpicker.iris({
        palettes: true,
        change: function(event, ui) {
          pickerOk.css('background-color', ui.color.toString());
          pickerOkContrast(pickerOk, ui.color.toString());
        }
      });

      if(dataDefault) {
        colorpicker.val(dataDefault);
        colorpicker.prev().css({
          'background': dataDefault
        });
        pickerOkContrast(pickerOk, dataDefault);
      }

      if (colorpicker.val().length > 0) {
        colorpicker.prev().css({
          'background': colorpicker.val()
        });
        pickerOkContrast(pickerOk, colorpicker.val());
      }

      // Based on color picked, sets the font color of OK button
      function pickerOkContrast(element, hex) {
        var newPick = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        bgBrightness = (parseInt(newPick[1], 16) * 299) + (parseInt(newPick[2], 16) * 587) + (parseInt(newPick[3], 16) * 114);
        bgBrightness = bgBrightness / 255000;

        element.css('color', bgBrightness >= 0.5 ? '#464646' : 'white');
      }

    });
  },

  datepicker: function() {
    $ui(".uz_input").find('input.datepicker').each(function(i, datepicker) {
      $ui(datepicker).datepicker();
    });
  },

  slider: function() {

    $ui(".uz_input").find('.uz_slider').each(function(i, slider) {
      $ui(slider).slider({
        range: "max",
        slide: function(event, ui) {
          var self = $ui(this);
          self.prev().val(ui.value);
          self.children('span.value').html(ui.value);

          if( self.hasClass('video_width') ) {
            var videoHeight = self.siblings('.video_height');
            var newValue = Math.round(ui.value/1.5);
            videoHeight.slider('value', newValue).prev().val(newValue);
            videoHeight.children('span.value').html(newValue);
          }

          if( self.hasClass('video_height') ) {
            var videoWidth = self.siblings('.video_width');
            var newValue = Math.round(ui.value*1.5);
            videoWidth.slider('value', newValue).prev().val(newValue);
            videoWidth.children('span.value').html(newValue);
          }
        },
        create: function() {
          var self = $ui(this);
          self.append('<span class="value"></span>');
          self.slider("option", "min", self.prev().data("min"));
          self.slider("option", "max", self.prev().data("max"));
          self.slider("option", "step", self.prev().data("step"));
          self.slider('value', self.prev().val());
          self.children('span.value').html(self.prev().val());
        },
        stop: function() {
          var self = $ui(this);
          self.prev().trigger('change');
        },
      });
    });
  },

  faicons: function() {

    if($ui(".uz_input").find('.fa-icons').length) {

      $ui.ajax({
        url: uz_ui.uri + "assets/fa-icons.html",
        type: "get",
        async: false,
        success: function(faIconsTmpl) {
          $ui(".uz_input").find('.fa-icons').each(function(i, faIcons) {
            var faIcons = $ui(faIcons);
            var faInner = faIcons.children('.inner');
            faInner.prepend(faIconsTmpl);
            faInner.css({top:0});

            if (faIcons.data('actual')) {

              faIcons.prevAll('.search-icons').append('<i class="'+faIcons.data('actual')+'"></i>');
              faIcons.prevAll('.search-icons').children('input').css({"padding-left":"45px"});

              var actualIconClass = faIcons.data('actual').replace(' ', '.');
              faInner.find('i.' + actualIconClass).addClass('current');

            }

          });
        }
      });

    }
  },

  imagelibrary: function() {
    $ui(".uz_input").find('.image-library').each(function(i, imagelibrary) {
      utilizerUIElements.helper.loadImagesFromMediaLibrary($ui(imagelibrary));
    });
  }

};

utilizerUIElements.handler = {

  	clickCheckbox: function(switchCallback) {
  		var self = $ui(this);
  		var inner = self.children('.inner');

  		if( self.hasClass('uz_collapser') ) {
  			self.parent().nextAll('.uz_collapse').toggleClass('uz_hidden');
        typeof switchCallback === 'function' && switchCallback();
  		}

  		inner.next().val(inner.position().left === 0 ? 1 : 0);
  		inner.animate({
  			'left': inner.position().left === 0 ? '-96px' : 0
  		}, 250);
  		self.find('input[type=checkbox]').trigger('change');
  	},

  	focusColorPicker: function(focusCallback) {
  		$ui(this).iris('show');
      typeof focusCallback === 'function' && focusCallback();
  	},

  	clickColorPickerOk: function(okCallback) {
  		$ui(this).next().iris('hide');
      typeof okCallback === 'function' && okCallback();
  	},

  	clickFAIcon: function() {
  		var self = $ui(this);

  		if (self.hasClass('current')) {
  			self.removeClass('current');
  			self.parent().find('input[type=hidden]').val('');
  			self.parents('.fa-icons').prevAll('.search-icons').children('i').remove();
  			self.parents('.fa-icons').prevAll('.search-icons').children('input').attr("style",null);
  			return;
  		}

  		self.parent().find('i.current').removeClass('current');
  		self.parent().find('input[type=hidden]').val(self.attr('class'));
  		self.addClass('current');
  		self.parents('.fa-icons').prevAll('.search-icons').append('<i class="'+self.attr('class')+'"></i>');
  		self.parents('.fa-icons').prevAll('.search-icons').children('input').attr("style","padding-left:45px");
  	},

  	clickFAIconsArrow: function() {
      utilizerUIElements.helper.slideWithArrows($ui(this), 114);
  	},

  	clickBrowseButton: function(selectImageCallback) {

  		var self = $ui(this);
  		var imageShow = self.prevAll("div.image_show");
  		var file_frame;

  		if ( file_frame ) {
  			file_frame.open();
  			return;
  		}

  		file_frame = wp.media.frames.file_frame = wp.media({
  			title: "Upload image",
  			button: {
  				text: "Use image",
  			},
  			multiple: false
  		});

  		file_frame.on( 'select', function() {

  			image = file_frame.state().get('selection').first().toJSON();

  			if ( imageShow.length !== 0 ) {
  				imageShow.html('<img src="'+image.url+'" />');
  				imageShow.find('img').load(function(){
            typeof selectImageCallback === 'function' && selectImageCallback();
  				});
  			}

  			self.prevAll('input[type=text].file').val(image.url);

  		});

  		file_frame.open();
  	},

  	keyupOnBrowseButtonSource: function(onEditFileInputCallback) {
  		var self = $ui(this);
  		self.prevAll('div.image_show').fadeOut(
  			function() {
          typeof selectImageCallback === 'function' && selectImageCallback();
          typeof onEditFileInputCallback === 'function' && onEditFileInputCallback();
  				self.prevAll('div.image_show').html('<img src="' + self.val() + '" />').fadeIn(function() {
            typeof onEditFileInputCallback === 'function' && onEditFileInputCallback();
          });
  			}
  		);
  	},

  	clickImageLibraryArrow: function() {
      utilizerUIElements.helper.slideWithArrows($ui(this), 150);
  	},

  	clickImageLibraryImage: function() {
  		var self = $ui(this);
  		var imageLibrary = self.parents('.image-library');

  		if (!imageLibrary.hasClass('multi')) {
  			// Uncheck already checked ones
  			imageLibrary.find('span.checked').removeClass();
  			imageLibrary.find('input[type=radio]:checked').attr('checked', false);
  			// Check this one
  			self.children('span').addClass('checked');
  			self.children('input[type=radio]').attr('checked', true);
  		} else {

  			// Checkbox case check/uncheck and toggle class
  			var imgCheckbox = self.children('input[type=checkbox]');
  			imgCheckbox.attr('checked', imgCheckbox.is(':checked') ? false : true);
  			self.children('span').toggleClass('checked');

  		}
  	},

  	addAjaxListInput: function(onChangeCallback) {
  		var ajaxList = $ui(this).parent().parent();

  		ajaxList.children(':first').clone().appendTo(ajaxList);
      ajaxList.find('li:last-child input').val('').prop("disabled",false).removeClass('uz_skip').parent().removeClass('uz_hidden');
      typeof onChangeCallback === 'function' && onChangeCallback();

  	},

  	deleteAjaxListInput: function(onDeleteCallback) {
  		$ui(this).parent().fadeOut('normal', function() {
  			$ui(this).remove();
        typeof onDeleteCallback === 'function' && onDeleteCallback();
  		});
  	},

}

utilizerUIElements.invokeBundle = function() {

  utilizerUIElements.invoke.showImages();
  utilizerUIElements.invoke.selects();
  utilizerUIElements.invoke.checkbox();
  utilizerUIElements.invoke.colorpicker();
  utilizerUIElements.invoke.datepicker();
  utilizerUIElements.invoke.slider();
  utilizerUIElements.invoke.faicons();
  utilizerUIElements.invoke.imagelibrary();

};

utilizerUIElements.attachHandlers = function() {

  $ui(".uz_input").on('click', 'a', function(event) { event.preventDefault(); });

  $ui(".uz_input").on('click', 'a.checkbox',                    utilizerUIElements.handler.clickCheckbox);
  $ui(".uz_input").on('focus', '.iris-color-picker',            utilizerUIElements.handler.focusColorPicker);
  $ui(".uz_input").on('click', '.colorpicker a.picker_ok',      utilizerUIElements.handler.clickColorPickerOk);

  $ui(".uz_input").on('click', '.fa-icons .inner i',            utilizerUIElements.handler.clickFAIcon);
  $ui(".uz_input").on('click', '.fa-icons div.arrows a',        utilizerUIElements.handler.clickFAIconsArrow);

  $ui(".uz_input").on('click', 'button[name=browse]',           utilizerUIElements.handler.clickBrowseButton);
  $ui(".uz_input").on('keyup', 'input.file',                    utilizerUIElements.handler.keyupOnBrowseButtonSource);

  $ui(".uz_input").on('click', '.image-library div.arrows a',   utilizerUIElements.handler.clickImageLibraryArrow);
  $ui(".uz_input").on('click', '.image-library .inner a.image', utilizerUIElements.handler.clickImageLibraryImage);

  $ui(".uz_input").on('click', ".ajaxlist li button",           utilizerUIElements.handler.addAjaxListInput);
  $ui(".uz_input").on('click', ".ajaxlist li a.delete",         utilizerUIElements.handler.deleteAjaxListInput);

  $ui(".uz_input").on('keyup', 'input.search-icon',             utilizerUIElements.helper.searchIcon);

}

utilizerUIElements.init = function() {
  utilizerUIElements.invokeBundle();
  utilizerUIElements.attachHandlers();

  // Ace editor

  if ($ui('#css_editor').length) {
     var cssEditor,
        cssEditor = ace.edit('css_editor');
     cssEditor.getSession().setUseWrapMode(true);
     cssEditor.setShowPrintMargin(false);
     cssEditor.getSession().setValue($ui('#css_textarea').val());
     cssEditor.getSession().setMode("ace/mode/css");
     cssEditor.getSession().on('change', function() {
        $ui('#css_textarea').val(cssEditor.getSession().getValue());
     });

  }

  if ($ui('#javascript_editor').length) {
     var jsEditor,
        jsEditor = ace.edit('javascript_editor');
     jsEditor.getSession().setUseWrapMode(true);
     jsEditor.setShowPrintMargin(false);
     jsEditor.getSession().setValue($ui('#javascript_textarea').val());
     jsEditor.getSession().setMode("ace/mode/javascript");
     jsEditor.getSession().on('change', function() {
        $ui('#javascript_textarea').val(jsEditor.getSession().getValue());
     });
  }

  // Autocomplete select
  $ui('.uz_input select.autocomplete').combobox();

}

$ui(utilizerUIElements.init);

// Source: http://james.padolsey.com/
jQuery.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ?
                        matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels,'')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
}
