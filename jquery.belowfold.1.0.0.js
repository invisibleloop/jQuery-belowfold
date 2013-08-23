/*
 * jQuery belowfold v 1.0.0
 *
 * Add a pop up message to your page when there is content below the fold
 * and the user hasn't scrolled down the page
 *
 * Copyright (c) 2010 Andy Stubbs
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Example usage $('body').belowfold();
 *
 * 				 $('#mydiv').belowfold();
 *
 * 				 $('body').belowfold({delay:10000, duration:7000, bottom:'50px'});
 *
 * If using an id selector, the element must have css position: relative;
 *
 * Tested in IE 6, 7, 8, 9 / firefox 3.6.11, 5, 7 / chrome 6, 7 / safari 4, 5
 * Requires jQuery v 1.10.x
 * 
 */
 
(function($){

	$.fn.belowfold = function(options) {
	
		/* 	set defaults */
		
		var defaults = {
			delay: 5000,
			duration: 5000,
			width: '183px',
			height: '48px',
			bottom: '20px',
			zIndex: 1000,
			fadeIn: 500,
			fadeOut: 500,
			src: 'http://i.imgur.com/wXvoL9C.png',
			offset: '0px',
			autoPosition: true
		};
		
		var options = $.extend(defaults, options);
		var selector = this;
		 
		var imgWidth = parseFloat( (options.width).replace(/[A-z]/ig, '') );
		var imgHeight = parseFloat( (options.height).replace(/[A-z]/ig, '') );
		var posBottom = parseFloat( (options.bottom).replace(/[A-z]/ig, '') );
		var offset = parseFloat( (options.offset).replace(/[A-z]/ig, '') );
		
		/* 	minimum delay is 5 seconds as some browsers load the page
		 *  and then scroll to last viewed position, therefore always
		 *  setting scrollTop() to zero.
		 */
		
		var delay = 5000;
		if ( options.delay > delay ) {
			delay = options.delay;
		}
		
		/* 	stop pop up from appearing if the user has already scrolled then refreshes 
		 *	browser or on initial scroll of window
		 */
		 
		var scrolled = false;
		
		$(window).one('scroll.belowfold', function(){
			scrolled = true;
			if ( scrolled ) {
				$('#belowfold-popup').stop().animate({opacity: '0'});
			}
		});
		
		window.setTimeout(function() {
			
			if (options.autoPosition) {
				$(selector).css({position:'relative'});
			}
			
			var scrollTop = $(window).scrollTop();
			var windowHeight = $(window).height();
			var selectorWidth = $(selector).width();
			var selectorOffset = $(selector).offset();
			var documentHeight = $(document).height();
			
			if ( ( ( scrollTop + windowHeight ) - documentHeight < -(imgHeight + offset) ) && ( !scrolled ) ) {
			
				$(selector).append('<div id="belowfold-popup"></div>');
				
				$('#belowfold-popup').css({
					background: 'url('+ options.src +') center center no-repeat',
					cursor: 'pointer',
					width: imgWidth + 'px',
					height: imgHeight + 'px',
					opacity: 0,
					zIndex: options.zIndex,
					position: 'absolute',
					left: ( Math.floor( selectorWidth / 2 ) ) - ( Math.floor( imgWidth / 2 ) ),
					top: ( windowHeight + scrollTop + imgHeight ) + 'px'
				}).animate({
					top: ( windowHeight + scrollTop - Math.floor( selectorOffset.top ) ) - ( imgHeight + posBottom ) + 'px',
					opacity: '1'
				},options.fadeIn).delay(options.duration).animate({
					opacity: '0'
				},options.fadeOut, function(){
					$(this).remove();
				});

			}
			
			/* 	keep pop up message in position on browser window resize 
			 *  and remove pop up of window is resized larger than the document
			 */
			
			$(window).bind('resize.belowfold',function(){
				
				var selectorNewWidth = ( Math.floor( $(selector).width() / 2 ) ) - ( Math.floor( imgWidth / 2 ) );
				var newWindowHeight = ( $(window).height() + $(window).scrollTop() ) - ( imgHeight + posBottom );
				
				if ( newWindowHeight > documentHeight ) {
				
					$('#belowfold-popup').stop().animate({opacity:'0'});
					
				} else {
				
					$('#belowfold-popup').css({
						left: selectorNewWidth + 'px',
						top: newWindowHeight + 'px'
					});
					
				}
				
			});
			
			/* close popup on click */
			
			$('#belowfold-popup').one('click.belowfold', function(){
				$('#belowfold-popup').stop().animate({opacity:'0'});
			});
			
		}, delay);

	};
	
})(jQuery);