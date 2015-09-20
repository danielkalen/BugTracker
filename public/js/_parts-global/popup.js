
// ==== Append Popup Overlay =================================================================================
var appendPopup = function($){
	var $popup = '<div class="popup-overlay"></div>';
	$$('body').prepend( $popup );	

	$$('.popup-overlay').on('click', function(){
		jQuery(this).removeClass('show');
		jQuery('.popup.show').removeClass('show');
		$$('body').removeClass('opened-popup');
		popupOpen = false;
	});
}; appendPopup();

var popupOpen = false,
Popup = function($form, name) {
	var $this = this,
		isExit = name.indexOf('exit-intent') !== -1;

	$$('.popup-overlay').after('<div class="popup" id="'+name+'"><div class="popup-close"></div><div class="popup-content"></div></div>');

	this.Popup = jQuery( '#'+name );

	this.Close = function(){
		this.Popup.removeClass('show');
		$$('.popup-overlay').removeClass('show');
		$$('body').removeClass('opened-popup');
		popupOpen = false;

		this.Popup.trigger('closed');
	};

	this.Open = function(){
		if ( !popupOpen || isExit ) {
			$$('.popup-overlay').addClass('show');
			
			if (isExit) jQuery('.popup').removeClass('show');
			
			if ( this.Popup.find('.results').hasClass('show') ) {
				this.Popup.addClass('show');
			} else {
				this.Popup.addClass('show')
							.find('.step').first().addClass('show');
			}

			$$('body').addClass('opened-popup');
		} 

		if (popupOpen && !isExit) log('Another popup is open.');
		// if (popupOpen && !isExit) log(this);
		if (typeof disableExitIntents !== 'undefined'){
			disableExitIntents();
		}
		popupOpen = true;

		this.Popup.trigger('opened');
	};

	this.Reset = function(){
		var popupFields = this.Popup.find('.fieldset');

		this.Popup.find('.step.show, .results.show').removeClass('show');

		popupFields.removeClass('filled valid error blur focus')
									  .find('.input')
									  		.not('input[type="checkbox"]').not('input[type="radio"]')
										  		.val('');
		popupFields.find('.input-button').removeClass('checked')
										.find('input').prop('checked', false);

		this.Popup.trigger('reset');
	};

	this.Destroy = function(){
		this.Popup.remove();
	};

	// ==== Move form into new popup =================================================================================
	if ( $form.length === 1 ) {
		$form.appendTo( this.Popup.find('.popup-content') );
	} else {
		$form.first().appendTo( this.Popup.find('.popup-content') );
	}

	this.Popup.children('.popup-close').on('click', function(){
		$this.Close();
	});


};
