var app = require('app'),
	BrowserWindow = require('browser-window'),
	shortcut = require('global-shortcut'),
	express = require('express'),
	expressApp = express(),
	db = require('monk')('localhost:27017/bugtracker'),
	mainWindow = null; // Keep global reference to the window object


/* ==========================================================================
   Mac App
   ========================================================================== */
require('crash-reporter').start();

// ==== Init =================================================================================
app.on('ready', function() {
	mainWindow = new BrowserWindow({ // Create the browser window.
		width: 600, 
		height: 50, 
		'frame': false,
		'show': false,
		// 'title-bar-style': 'hidden',
		// 'use-content-size': true,
		// 'center': true,
		'resizable': false,
		'always-on-top': true
	}); 
	
	mainWindow.loadUrl('http://localhost:4667');
	app.dock.hide();
	
	mainWindow.on('closed', function() {
		mainWindow = null;
	});


	shortcut.register('cmd+alt+b', function(){
		if ( mainWindow.isVisible() ) {
			mainWindow.hide();
		} else {
			mainWindow.show();
		}
	});
});


// ==== Close Window =================================================================================
// app.on('window-all-closed', function() {
// 	shortcut.unregisterAll();
// 	app.quit();
// });


















/* ==========================================================================
   Express App
   ========================================================================== */

// ==== Middleware =================================================================================
expressApp.set('views', './views'); 				// Set main views folder.
expressApp.set('view engine', 'jade');				// Set templating engine to jade.



// ==== Routing =================================================================================
expressApp.get('/', function(request, response){
	response.render('index');
});








server = expressApp.listen(4667, function(){
	var host = server.address().address,
		port = server.address().port;
	console.log('BugCleaners Server running on http://%s:%s', host, port);
});
server.on('error', function(message){console.log(message);}); // Log errors