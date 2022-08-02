module.exports = function(){

	
	const Gallery = require('./gallery');

	//Global variables
	const ViewController = require('./view');

	var router = new Navigo(location.protocol + '//' + window.location.host);
	var skrlr = null;
	
	if(!isMobile())
		var skrlr = Skrollr.init({forceHeight: false});

	var view = new ViewController({
		viewsPath: window.location.origin + '/views',
		wrapperSelector: '#main-wrapper',
		progressbarSelector: '#progressbar'
	});

	view.after(function() {
		router.updatePageLinks();

		if(skrlr)
			skrlr.refresh();
	});

	router.on('portfolio/:name', function (params) {
		view.load('projects/' + params.name, function(){
			var glry = new Gallery();
			glry.init('#gallery');

		});
	});

	router.on('portfolio', function () {
		view.load('portfolio', function() {
		});
	});

	router.on(function () {
		view.load('home', function() {
		});
	});

	router.on('404', function () {
		console.log('Page not found');
		view.load('404');
	});

	router.notFound(function() {
		view.load('404');
	});

	router.resolve();

}