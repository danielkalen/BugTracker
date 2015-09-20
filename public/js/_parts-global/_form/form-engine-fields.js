(function($){
	/*==========================================
	=            Input/Select Field            =
	==========================================*/	
	Form.prototype.Prepare.inputField = function($field) {

		var isRequired = $field.hasClass('required') || $field.find('.input').hasClass('required'),
			isSelectField = $field.hasClass('select'),
			$selectField = $field.find('.input');
		
		if ( isRequired ) {
			$field.find('.input').not('.phone, .email, .cardcvc, .carddate').on('change keyup', function(){
				var $this = $(this),
					isValid = Form.prototype.Validate.inputField($this);
				
				if (isValid) {
					FormUtils.makeValid($this.parents('.fieldset'));
				} else{
					FormUtils.makeInvalid($this.parents('.fieldset'));
				}
			});
		} else {
			$field.addClass('valid');
		}


		// ==== Select Field div Replacement =================================================================================
		if ( isSelectField ) {
			var setSelectFieldValue = function($item){
				var $this = $item,
					$replacementField = $this.next(),
					fieldValue = $this.children('option:selected')[0].innerHTML;
				$replacementField.html(fieldValue);
			}

			setSelectFieldValue($selectField);

			$selectField.on('change', function(){
				setSelectFieldValue($(this));
			});
		}
	};
	// ==== Validation =================================================================================
								Form.prototype.Validate.inputField = function($fieldInput) {
									var fieldValue = $fieldInput.val(),
										fieldValue = fieldValue.replace(util.regEx.whiteSpace, ''),
										passesTest = fieldValue !== "" && fieldValue !== null;
									if (passesTest) return true ;
													return false;
								}








	/*===================================
	=            Email Field            =
	===================================*/	
	
	Form.prototype.Prepare.emailField = function($field) {
		$field.on('change keyup', function(){
			var $this = $(this),
				isValid = Form.prototype.Validate.emailField($this);

			if ( isValid ) {
				FormUtils.makeValid($this.parents('.fieldset'));
			} else {
				FormUtils.makeInvalid($this.parents('.fieldset'));
			}
		});
	};
	// ==== Validation =================================================================================
								Form.prototype.Validate.emailField = function($fieldInput) {
									var fieldValue = $fieldInput.val()
										passesTest = fieldValue !== "" && util.regEx.email.test(fieldValue);

									if (passesTest) return true ;
													return false;
								}








	/*======================================
	=            Checkbox Field            =
	======================================*/
	
	Form.prototype.Prepare.checkboxField = function($field) {
		$field.find('.input-button').click(function(){
			var $this = $(this);

			if ( !$this.hasClass('checked') ) {
				checkOn($this);
				FormUtils.makeValid($this.parents('.fieldset'));
			} else {
				checkOff($this);
				if ( !$this.hasClass('checked') && !$this.siblings().hasClass('checked') ) {
					FormUtils.makeInvalid($this.parents('.fieldset'));
				} else {
					FormUtils.makeValid($this.parents('.fieldset'));
				}
			}
		});
		$field.find('label').click(function(e){
			e.preventDefault();
			$(this).parent().trigger('click');
		});
	};




	/*===================================
	=            Radio Field            =
	===================================*/
	
	Form.prototype.Prepare.radioField = function($field) {
		$field.find('.input-button').click(function(){
			var $this = $(this);

			// if ( !$this.hasClass('checked') ) {
				checkOn($this);
				checkOff($this.siblings());
				FormUtils.makeValid($this.parents('.fieldset'));
			// }
		});

		$field.find('label').click(function(e){
			e.preventDefault();
			$(this).parent().trigger('click');
		});
	}




	function checkOn($el) {
		$el.addClass('checked');
		$el.find('.input').prop('checked', true);
	}
	function checkOff($el) {
		$el.removeClass('checked');
		$el.find('.input').prop('checked', false);
	};

	// ==== Validation for checked state =================================================================================
					Form.prototype.Validate.hasChecked = function($field) {
						if (!$field.hasClass('fieldset')) $field = $field.parents('.fieldset');
						var checkedFields = $field.find('input:checked'),
							passesTest = checkedFields.length;

						if (passesTest) return true ;
										return false;
					}










	/*================================================================
	=            Number Fields (phone, date, cards, etc.)            =
	================================================================*/
	
	Form.prototype.Prepare.numberField = function($field) {
		$field.keydown(function (event) {
			if (!event.ctrlKey && !event.metaKey) {
	            if( !FormUtils.normalKeycodes(event) ) {
	                    event.preventDefault();     // Prevent character input
		            }
	        }
		});

		if ( $field.hasClass('phone') ) {
			$field.on('change keyup', function(){
				var $this = $(this),
					isValid = Form.prototype.Validate.phoneField($this);

				if ( isValid ) {
					FormUtils.makeValid($this.parents('.fieldset'));
				} else {
					FormUtils.makeInvalid($this.parents('.fieldset'));
				}
			});
		}

		if ( $field.hasClass('cardcvc') ) {
			$field.change(function(){
				var $this = $(this),
					isValid = Form.prototype.Validate.cardcvcField($this);

				if ( isValid ) {
					FormUtils.makeValid($this.parents('.fieldset'));
				} else {
					FormUtils.makeInvalid($this.parents('.fieldset'));
				}

			});
		}

		if ( $field.hasClass('carddate') ) {

			$field.on('keydown keypress', function(event){
				var backspace 	= event.keyCode === 8;
				var tab 		= event.keyCode === 9;
				var keyPressed 	= event.key; 

				if (!event.ctrlKey && !event.metaKey) { // Prevent non-numeric keys
					if (!FormUtils.normalKeycodes(event) || (event.keyCode >= 48 && event.keyCode <= 57)) event.preventDefault();
				}

				if (mobile) { // Requied due to undef event.key value on ios
					if (event.keyCode === 48 || event.keyCode === 96) keyPressed = 0;
					if (event.keyCode === 49 || event.keyCode === 97) keyPressed = 1;
					if (event.keyCode === 50 || event.keyCode === 98) keyPressed = 2;
					if (event.keyCode === 51 || event.keyCode === 99) keyPressed = 3;
					if (event.keyCode === 52 || event.keyCode === 100) keyPressed = 4;
					if (event.keyCode === 53 || event.keyCode === 101) keyPressed = 5;
					if (event.keyCode === 54 || event.keyCode === 102) keyPressed = 6;
					if (event.keyCode === 55 || event.keyCode === 103) keyPressed = 7;
					if (event.keyCode === 56 || event.keyCode === 104) keyPressed = 8;
					if (event.keyCode === 57 || event.keyCode === 105) keyPressed = 9;
				}

				var $this = $(this);
				var val = $this.val();
				var length = val.length;
					if (!backspace) {
						if (length <= 7 && !isNaN(keyPressed)) {

							if (length === 0 && keyPressed <= 1) {
								val = val + keyPressed;
							}
							if (length === 0 && keyPressed > 1) {
								val = val + '0' + keyPressed;
							}
							if (length === 1 && keyPressed <= 9) {
								if (val.substr(0, 1) === '0') {
									val = val + keyPressed;
								} else {
									if (keyPressed <= 2) {val = val + keyPressed;}
								}
							}

							if (length === 2) {
								val = val + ' / ' + keyPressed;
							}
							if (length === 3) {
								val = val + '/ ' + keyPressed;
							}
							if (length === 4) {
								val = val + ' ' + keyPressed;
							}
							if (length === 5 || length === 6) {
								val = val + keyPressed;
							}

							length = val.length;
						}

						if (length >= 7) {
							FormUtils.makeValid($(this).parents('.fieldset'));
						} else {
							FormUtils.makeInvalid($(this).parents('.fieldset'));
						}

					} else {

						if (length >= 3 && length <= 5) {
							val = val.substr(0, 2);
						}
					}
					$this.val(val);

			});
		}
	};
	// ==== Validation =================================================================================
								Form.prototype.Validate.phoneField = function($fieldInput) {
									var fieldValue = $fieldInput.val(),
										fieldValue = fieldValue.replace(util.regEx.whiteSpace, ''),
										passesTest = fieldValue !== "" && fieldValue.length >= 7;

									if (passesTest) return true ;
													return false;
								}
								Form.prototype.Validate.cardcvcField = function($fieldInput) {
									var fieldValue = $fieldInput.val(),
										fieldValue = fieldValue.replace(util.regEx.whiteSpace, ''),
										passesTest = fieldValue !== "" && fieldValue.length >= 3;

									if (passesTest) return true ;
													return false;
								}
})(jQuery);