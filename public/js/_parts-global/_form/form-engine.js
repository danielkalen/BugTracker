(function($){
	var $currentStep,
		$previousStep,
		$lastField;

	this.Form = function($form, options){ // Attached to 'this', which is the global window object.
		this.action = $form.data('action');
		if ( this.action ) { // Checks if the element has a data-action attr, which indicated it is form elemnt. 
			this.form = $form;
		} else {
			this.form = $form.find('form').first();
			this.action = this.form.data('action');
		}
		var $this = this;
			this.multiStep = this.form.find('.step').length > 1;
		
		// ==== Set options =================================================================================
		var	defaultOptions = {
								'heightTransitions': false,
								'callbackOnPrepare': function(){},
								'callbackOnResults': function(){},
								'callbackOnValidate': function(){},
								'callbackOnNextStep': function(){},
								'callbackOnBackStep': function(){},
								'callbackOnEventAttachment': function(){},
							 };
			this.options = $.extend(defaultOptions, options);


		this.Prepare();

		this.form.find('.next').on('click', function($form){    		$this.Next();    	});
		this.form.find('.back').on('click', function($form){    		$this.Back();    	});
		this.form.find('.submit').on('click', function($form){    		$this.Submit();    	});

		this.form.find('input[name="referrer"]').val(document.referrer);
		this.form.find('input[name="url"]').val(document.URL);
		
		if ( this.options.heightTransitions && this.multiStep ) {
			$window.on('resize', function(){
				if ( window.innerWidth <= 920 ) {
					FormUtils.saveSectionHeights( $form.find('.step') );
				}
			});
		}
	};













	Form.prototype.Prepare = function() {	
		var $thisForm = this.form,
			$this = this;

		if ( this.options.heightTransitions && this.multiStep ) {
			FormUtils.saveSectionHeights( $thisForm.find('.step') );
			
			// Initial height set
			$thisForm.find('.step').first().addClass('show').each(function(){
				var $this = $(this);
				$this.height( $this.data('height') );

				$this.siblings().height(39);
			});
		}

		$thisForm.on('submit', function(e){
			e.preventDefault();
		});

		$thisForm.find('.fieldset').not('.radio, .checkbox').each(function(){
			$this.Prepare.inputField($(this));
		});

		$thisForm.find('.fieldset.checkbox').each(function(){
			$this.Prepare.checkboxField($(this));
		});

		$thisForm.find('.fieldset.radio').each(function(){
			$this.Prepare.radioField($(this));
		});


		$thisForm.find('.phone, .zip, .cardnumber, .cardcvc, .carddate').each(function(){
			$this.Prepare.numberField($(this));
		});

		$thisForm.find('.email').each(function(){
			$this.Prepare.emailField($(this));
		});

		// Prevent tab switch to the next (invisible) field
		$thisForm.find('.step').each(function(){
			$lastField = jQuery(this).find('.fieldset').not('.checkbox').last();

			$lastField.on('keydown', function(e){
				if (!e.shiftKey){
					if ( e.keyCode === 9 ) {
						e.preventDefault(); $lastField.find('input').blur();
					}
				}
			});
		});

		$thisForm.find('.input').each(function(){
			$this.attachEvents( $(this) );
		});


		if ( $thisForm.find('.state').length ) {
			FormUtils.appendStateList();
		}
		if ( $thisForm.find('.country').length ) {
			FormUtils.appendCountryList();
		}
	}
	// @codekit-append 'form-engine-fields.js'



	Form.prototype.Validate = function(forSubmission) {
		var $thisForm = this.form,
			$thisObject = this,
			$activeStep = $thisForm.find('.step.show'),
			$required = $activeStep.find('.fieldset.required'),
			proceed = false,
			problem = false;


		$required.each(function(){
			var $this = $(this);
			
			if (forSubmission) { // Better but more expensive validation
				var isSelect = $this.hasClass('select'),
					isCheckbox = $this.hasClass('checkbox'),
					isRadio = $this.hasClass('radio'),
					isPhone = $this.find('.input').hasClass('phone'),
					isEmail = $this.find('.input').hasClass('email'),
					isInput = !isSelect && !isCheckbox && !isRadio && !isPhone && !isEmail;
			
				if ( isSelect || isInput ) {
					var isValid = $thisObject.Validate.inputField($this.find('.input'));
				} else if ( isEmail ) {
					var isValid = $thisObject.Validate.emailField($this.find('.input'));
				} else if ( isPhone ) {
					var isValid = $thisObject.Validate.phoneField($this.find('.input'));
				} else if ( isCheckbox || isRadio ) {
					var isValid = $thisObject.Validate.hasChecked($this);
				}
				
				if ( isValid ) {
					$this.removeClass('error');
				} else {
					problem = true;
					$this.addClass('error');
				}




			} else { // Standard, 'easy' validation

				if ( !$this.hasClass('valid') ) {
					problem = true;
					$this.addClass('error');
				} else {
					$this.removeClass('error');
				}
			}
		});
		
		this.options.callbackOnValidate();

		if ( problem ) {
			$activeStep.trigger('notvalid');
			return false;
		} else {
			$activeStep.trigger('valid');
			return true;
		}
	}





	Form.prototype.Next = function() {
		var $thisForm = this.form,
			$this = this;

		$currentStep = $thisForm.find('.step.show');

		var proceed = this.Validate();
		if ( proceed ) {
			FormUtils.revealSection( $currentStep.next(), this.options.heightTransitions );
		}
		this.options.callbackOnNextStep();
	}





	Form.prototype.Back = function() {
		var $thisForm = this.form,
			$this = this;

		$currentStep = $thisForm.find('.step.show');
		$previousStep = $currentStep.prev();

		FormUtils.revealSection( $previousStep, this.options.heightTransitions );
		this.options.callbackOnBackStep();
	}





	Form.prototype.Submit = function() {
		var $thisForm = this.form,
			$this = this;

		var proceed = this.Validate(true);
		if ( proceed ) {
			var $currentStep = $thisForm.find('.step.show'),
				$results = $thisForm.find('.results'),
				loading = '<div class="loading"><div class="loading-title">Processing your information...</div><div class="loading-gif"></div></div>',
				data = util.convertFormToObject($thisForm);
			

			data.action = $this.action;
			if (!data.url) data.url = window.location.href;
			if (!data.referrer) data.referrer = document.referrer;

			$thisForm.addClass('final');
			$results.html( loading ).addClass('show');
			$currentStep.removeClass('show');

			$.post('/ajax', data, function(response){
				var type = response.success;
				if (type == true) type = 'success';
				if (type == false || !type) type = 'error';

				$this.options.callbackOnResults();
				$results.html('<div class="results-message '+type+'">' + response.message + '</div>');
			}, 'json')
					.fail(function(){
						$results.html('<div class="results-message error">An unknown error has occured on the server, please contact customer support for help.</div>');
					});

		}

	}
















	Form.prototype.attachEvents = function($field, $onEvents){
		$onEvents = $onEvents ? $onEvents : 'keyup';
		var isSelect = $field.parents('.fieldset').hasClass('select'),
			isCheckbox = $field.attr('type') === 'checkbox',
			isRadio = $field.attr('type') === 'radio',
			isPhone = $field.hasClass('phone'),
			isEmail = $field.hasClass('email'),
			isInput = !isSelect && !isCheckbox && !isRadio && !isPhone && !isEmail;

		// Trim whitespace
		(function(){
			if (!isCheckbox && !isRadio){
				var value = $field.val(),
					newValue = value.replace(util.regEx.whiteSpace, '');
				$field.val( newValue );
			}
		})();

		$field.focus(function(){
			$(this).parent().addClass('focus');
		});
		$field.blur(function(){
			$(this).parent().removeClass('focus');
		});

		$field.on($onEvents, function(){
			if ( $(this).val() === '' ) {
				$(this).parent().removeClass('filled animate');
			} else {
				$(this).parent().addClass('filled animate');
			}
		});

		if ( $field.parent().hasClass('select') ) {
			$field.change(function(){
				if ( $(this).val() !== '' ) {
					$(this).parent().addClass('filled');
				} else {
					$(this).parent().removeClass('filled');
				}
			});
		}

		// Make fields that already have a value valid.
		if ( isSelect || isInput ) {
			var isValid = this.Validate.inputField($field);

		} else if ( isEmail ) {
			var isValid = this.Validate.emailField($field);

		} else if ( isPhone ) {
			var isValid = this.Validate.phoneField($field);

		} else if ( isCheckbox || isRadio ) {
			var isValid = this.Validate.hasChecked($field);
			
			if (isValid) {
				var checkedFields = $field.parents('.fieldset').find('input:checked');
				if (isCheckbox) {
					checkedFields.each(function(){
						var $this = jQuery(this);
						$this.parents('.input-button').addClass('checked')
							 .parents('.fieldset').addClass('valid');
					});	
				} else if (isRadio) {
					checkedFields.parents('.input-button').addClass('checked')
								 .parents('.fieldset').addClass('valid');
				}
			}
		}

		if ( isValid ) {
			$field.parents('.fieldset').addClass('filled valid animate');
		}
		if (this.options) {
			this.options.callbackOnEventAttachment();
		}
	}





	/*==================================
	=            Form Utils            =
	==================================*/
	
	this.FormUtils = {};
	FormUtils.makeValid = function($field) {
		$field.addClass('valid').removeClass('invalid error');
	};


	FormUtils.makeInvalid = function($field, error) {
		$field.addClass('invalid').removeClass('valid');

		if (error) {
			$field.addClass('invalid error');
		}
	};






	FormUtils.scrollUpIfNeeded = function($openSection){
		if ( window.pageYOffset > $openSection.offset().top ) {
			$("html, body").animate({ scrollTop: ($openSection.offset().top - 70) }, 300);
		}
	};



	FormUtils.saveSectionHeights = function($steps){

		$steps.each(function(){
			var $this = $(this),
				$thisHeight = $this.children('div').height() + 90;

			$this.data('height', $thisHeight);
		});
	};



	FormUtils.revealSection = function($section, manageHeight){
		$section.addClass('show')
					.siblings('.show').removeClass('show');

		FormUtils.scrollUpIfNeeded($section);
		if (manageHeight) {
			FormUtils.showSection($section);
		}
	};
	FormUtils.showSection = function($section){
		$section.height( $section.data('height') );
	};



	FormUtils.normalKeycodes = function(event){
		if (   event.keyCode === 8								// backspace
			|| event.keyCode === 9 								// tab
			|| event.keyCode === 16 							// shift
			|| event.keyCode === 17 							// ctrl
			|| event.keyCode === 18 							// alt
			|| event.keyCode === 46								// delete
			|| (event.keyCode >= 35 && event.keyCode <= 40)		// arrow keys/home/end
			|| (event.keyCode >= 48 && event.keyCode <= 57)		// numbers on keyboard
			|| (event.keyCode >= 96 && event.keyCode <= 105)	// number on keypad
			|| (event.keyCode === 32 || event.keyCode === 189 || event.keyCode === 190 || event.keyCode === 173)    // space, dash, dot
		) {
			return true;
		} else {
			return false;
		}
	};


	FormUtils.appendStateList = function(){
		$window.one('scroll', function(){
			$.getJSON('/js/_parts-form/state.json', '', function(data){
				var items = [];
				$.each(data, function(key, val){
					items.push('<option value="' + key + '">' + val + '</option>');
				});
				$$('.fieldset.state').find('select').append(items);
			});
		});
	};

	FormUtils.appendCountryList = function(){
		$window.one('scroll', function(){
			$.getJSON('/js/_parts-form/country.json', '', function(data){
				var items = [];
				$.each(data, function(key, val){
					items.push('<option value="' + key + '">' + val + '</option>');
				});
				$$('.fieldset.country').find('select').append(items);
			});
		});
	};

})(jQuery);