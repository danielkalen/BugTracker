function Util(){
	
	// ==== Debounce =================================================================================

	/*Returns a function, that, as long as it continues to be invoked, will not
	be triggered. The function will be called after it stops being called for
	N milliseconds. If `immediate` is passed, trigger the function on the
	leading edge, instead of the trailing.*/
	this.debounce = function(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};
	/*
	Usage:
		var myEfficientFn = debounce(function() {
			// All the taxing stuff you do
		}, 250);
		window.addEventListener('resize', myEfficientFn);
	*/



	// ==== Once =================================================================================
	this.once = function(fn, context) { 
		var result;

		return function() { 
			if(fn) {
				result = fn.apply(context || this, arguments);
				fn = null;
			}

			return result;
		};
	}
	/*
	Usage
		var canOnlyFireOnce = once(function() {
			console.log('Fired!');
		});

		canOnlyFireOnce(); // "Fired!"
		canOnlyFireOnce(); // nada
	*/




	// ==== Add style tags =================================================================================
	this.sheet = (function() {		
		var style = document.createElement('style'); // Create the <style> tag
		style.appendChild(document.createTextNode('')); // WebKit hack :(
		document.head.appendChild(style); // Add the <style> element to the page
		return style.sheet;
	})();
	/* Usage
		sheet.insertRule("header { float: left; opacity: 0.8; }", 1);
	*/



	// ==== RegEx =================================================================================
	this.regEx = {
		whiteSpace: /^\s+|\s+$/g,
		email: new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i)
	};








	// ==== Perf test =================================================================================
	this.perfTime = function(fn, milliSeconds) {
		var startTime = new Date().getTime(),
			endTime = 0,
			repeatFunction = true,
			i = 0;

		if (typeof milliSeconds == 'undefined') {
			var milliSeconds = 5000;
		}

		while ( repeatFunction ) {
			fn.apply(this, arguments);
			i++

			if (endTime - startTime < milliSeconds) {
				endTime = new Date().getTime();
			} else {
				console.log('Completed function ' + i + ' times');
				repeatFunction = false;
			}

		}

	}

	this.perf = function(fn, times) {
		var startTime = new Date().getTime();
		var i = 0;

		if (typeof times == 'undefined') {
			var times = 100000;
		}

		while (i < (times + 1)) {
			fn.apply(this, arguments);

			if (i === times) {
				var endTime = new Date().getTime(),
					finishTime = endTime - startTime;
				console.log(finishTime);
			}

			i++;
		}

	}







	// ==== Form to Object coversion for submission =================================================================================
	this.convertFormToObject = function($form){
		var fieldData = $form.serializeArray(),
			arrayRegEx = /\[\]$/;
			data = {};

		fieldData.forEach(function(item){
			if ( arrayRegEx.test(item.name) ) { // Check if the name of the field is an array
				if ( data[item.name] ) { // Check if array exists in the new data object.
					data[item.name].push(item.value); // If it does, just push the next value into that array.
				} else {
					data[item.name] = [item.value]; // If not, create a new array and append the first value to it.
				}
			} else {
				data[item.name] = item.value; // If the name of the field isn't an array, just push it as a regular value to the data object.
			}
		});
		return data;
	};






}; var util = new Util();



// ==== Log =================================================================================
function log() {
  try {
    console.log.apply( console, arguments );
  } catch(e) {
    try {
      opera.postError.apply( opera, arguments );
    } catch(e){
      alert( Array.prototype.join.call( arguments, " " ) );
    }
  }
}


function error(msg, alert) {
	throw Error(msg);

	if (alert) alert(msg);
}







