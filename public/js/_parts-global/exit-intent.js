(function($){
    this.ExitIntent = function($form, name){
        var $this = this,
            isIE = document.all && !window.atob,
            isIE11 = window.navigator.msPointerEnabled,
            isMobile = $$('html').hasClass('mobile'),
            isSubscribeExitIntent = 'subscribe_email' === $form.find('form').data('action'),
            isRegularExitIntent = !isSubscribeExitIntent;
  
        // ==== Results Callback =================================================================================            
            if (isSubscribeExitIntent) {
                var callbackOnResults = function(){ localStorage.setItem('subscribed', 'true'); };
            }
            if (isRegularExitIntent) {
                var callbackOnResults = function(){ localStorage.setItem('submitted', 'true'); };
            }
        /* ========================================================================== */
        
        this.form = new Form( $form, {'callbackOnResults': callbackOnResults} );
        this.popup = new Popup( $form, name );
        this.name = name;
        this.disabled = false;

        var category = $$('.article-meta-category').data('category');
        this.form.form.find('input[name="source"]').val(window.location.href);
        this.form.form.find('input[name="subscriptionType"]').val( (category === 'hide' ? 'all':category) );



        this.openPopup = function(){
            if (isSubscribeExitIntent) {
                var isSubscribed = localStorage.getItem('subscribed') === 'true';
                if (!isSubscribed) $this.popup.Open();
                var timesOpened = localStorage.getItem('subscribe_exit_intent_opened'),
                    timesOpened = (timesOpened ? timesOpened : '0'),
                    timesOpened = parseFloat(timesOpened);
                localStorage.setItem('subscribe_exit_intent_opened', timesOpened+1);
                if (timesOpened > 1) localStorage.setItem('subscribed', 'true');
            }
            if (isRegularExitIntent) {
                var isSubmitted = localStorage.getItem('submitted') === 'true';
                if (!isSubmitted) $this.popup.Open();
                var timesOpened = localStorage.getItem('regular_exit_intent_opened'),
                    timesOpened = (timesOpened ? timesOpened : '0'),
                    timesOpened = parseFloat(timesOpened);
                localStorage.setItem('regular_exit_intent_opened', timesOpened+1);
                if (timesOpened > 1) localStorage.setItem('submitted', 'true');
            }
        };

        if ( !isMobile ) {
            $(window).on('mouseleave', function(e) {
                
                if (!$this.disabled && !popupOpen && e.pageY - window.pageYOffset <= 1) {    
                    $this.disabled = true;

                      $this.openPopup();
                }
            });
        }   


        if ( !$form.hasClass('exit-subscribe') && !$form.hasClass('exit-pdf') ) {
            if ( !isIE && !isIE11 && !isMobile && !$this.disabled ) {
                window.history.replaceState({id: 'gv_exit-init'}, '', '');
                window.history.pushState({id: 'gv_exit-control'}, '', '');
                   
                $(window).on('popstate', function(e) {
                    if (!$this.disabled && 'state' in window.history && window.history.state !== null && window.history.state.id !== 'gv_exit-control') {    
                        $this.disabled = true;

                        $this.openPopup();        
                    }
                });
            }
        }

        $form.find('.no').on('click', function(){
        	$this.popup.Close();
            localStorage.setItem('submitted', 'true');
        });
    };
})(jQuery);

function disableExitIntents(){
    ExitIntent.disabled = true;;
}