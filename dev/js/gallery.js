module.exports = function(){

	//Libraries
	const Siema = require('siema');
	const Mockup = require('./mockup');

	//Variables
	var wrapper = null;
	var mockup = null;


	//Initialize
	var init = function(wrapperSelector) {
		wrapper = document.querySelector(wrapperSelector);
		var nav_el = document.getElementById('nav');

		//Events for carousele navigiation
		if(nav_el.getElementsByClassName('nav_link').length > 1) {
			wrapper.addEventListener('click', itemClick, false);

			var nav = new Siema( {
				selector: '#nav',
				duration: 300,
				easing: 'ease-in-out',
				perPage: 3,
				startIndex: 0,
				draggable: true,
				multipleDrag: true,
				threshold: 10,
				loop: false,
			});

			//Hide navigation buttons when is less than 3 slides 
			if(nav.innerElements.length > nav.perPage) {	
				var prev_btn = wrapper.querySelector('#nav-prev');
				var next_btn = wrapper.querySelector('#nav-next');
				prev_btn.style.display = 'block';
				next_btn.style.display = 'block';
				prev_btn.addEventListener('click', function(){ nav.prev(); }, false);
				next_btn.addEventListener('click', function(){ nav.next(); }, false);
			}
		}
		else {
			document.getElementById('nav').style.display = 'none';
		}
		

		//Show first slide
		itemClick(wrapper.querySelector('.nav_link.active'));
	}

	var itemClick = function(el) {

		if(el.target !== '')
			el = el.target;

		if(el.classList.contains('nav_link')) {
			//Highlight active slide
			var links = wrapper.getElementsByClassName('nav_link');
			for (var i = links.length - 1; i >= 0; i--) {
				links[i].classList.remove('active');
			}


				
			//Show mockup
			el.classList.add('active');
			//Reset mockups
			if(mockup) {
				mockup.destroy();
			}
			
			//Setup mockup by ID
			var mockupId = '#' + el.getAttribute('data-mockup');
			mockup = new Mockup();
			mockup.init(mockupId);
			mockup.load(el.getAttribute('data-src'))
			mockup.start();
		}
	};

	var destroy = function(){
		wrapper.removeEventListener('click', itemClick, false);
		nav.destroy();
		var prev_btn = wrapper.querySelector('#nav-prev');
		var next_btn = wrapper.querySelector('#nav-next');
		prev_btn.removeEventListener('click', function(){ nav.prev(); }, false);
		next_btn.removeEventListener('click', function(){ nav.next(); }, false);
		if(mockup)
			mockup.destroy();
	}

	return {
		init: init,
		destroy: destroy
	}

};

