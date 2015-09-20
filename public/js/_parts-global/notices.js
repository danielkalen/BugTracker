(function($){
	if ( !$('.notices').length ) {
		$$('body').prepend('<div class="notices"></div>');
	}
	
	addNotice($$('.notice'), true);

	// ==== Close Notice =================================================================================
	$$('.notices').on('click', '.notice-close', function(){
		removeNoticeNow( $(this).parent() );
	});


	this.notify = function($type, $text, time){
		var notification = '<div class="notice notice_' + $type + '">' +
								'<div class="notice-text">' + $text + '</div>' +
								'<div class="notice-close"></div>' +
							'</div>';

		$$('.notices').append(notification);
		setTimeout(function(){
			$('.notice').last().addClass('show');
		}, 200);

		if ( time ) {
			removeNotice($('.notice').last(), time);
		}
	}



	function addNotice($notice, timed){
		$notice.appendTo('.notices');
		setTimeout(function(){
			$notice.addClass('show');
		}, 200);
		
		if ( timed ) {
			removeNotice($('.notice').last(), 3500);
		}
	}



	function removeNotice($notice, time){
		if (time === undefined) time = 10000;
		if (time === false) time = 0;

		setTimeout(function(){
			removeNoticeNow($notice);
		}, time);

	}



	function removeNoticeNow($notice){
		$notice.removeClass('show');

		setTimeout(function(){
			$notice.remove();
		}, 1000);
	}
})(jQuery);