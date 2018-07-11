module.exports = function(){

	//Libraries
	const Navigo = require('navigo');
	const ViewController = require('./view');
	const Mockup = require('./mockup-scroll');
	const Siema = require('siema');
	const Skrollr = require('skrollr');
	const isMobile = require('is-mobile');

	//Global variables
	var router = new Navigo(SERVER_NAME, true);
	var mockupScroll = new Mockup();
	var skrlr = Skrollr.init();
	var slider = null;
	var view = new ViewController(SERVER_NAME + '/views', '#main-wrapper', '#progressbar');

	view.before(function(){
		if(skrlr)
			skrlr.destroy();
		if(slider) {
			slider.destroy();
			slider = null;
		}
	});

	view.after(function(){
		if(!isMobile()){
			skrlr = Skrollr.init({forceHeight: false});
			console.log('Skrollr initialized');
		}
	});

	view.onError(function(){
		view.load('404');
	})

	router
	.on({
		'projects/:name': function (params) {
			view.load('projects/' + params.name, function(){

				setTimeout(function() {
					document.querySelector('.c-mockup__display').classList.add('animate');
				}, 400);
				
				mockupScroll.init();
				
				slider = new Siema( {
					selector: '#nav-slider',
					duration: 300,
					easing: 'ease-in-out',
					perPage: 3,
					startIndex: 0,
					draggable: true,
					multipleDrag: true,
					threshold: 10,
					loop: true,
				});

				var prev_btn = document.querySelector('#nav-prev');
				var next_btn = document.querySelector('#nav-next');
				prev_btn.addEventListener('click', () => slider.prev());
				next_btn.addEventListener('click', () => slider.next());

				if(slider.innerElements.length <= slider.perPage) {	
					prev_btn.style.display = 'none';
					next_btn.style.display = 'none';
				}

				document.getElementById('')

			});
		},
		'projects': function () {
			view.load('projects');
		},
		'404': function () {
			console.log('Error 404');
			view.load('404');
		},
		'': function () {
			view.load('home');
		}
	})
	.notFound(function() {
		view.load('404');
	})
	.resolve();

}