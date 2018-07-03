module.exports = function() {
	var display = {}; 
	var pages = {}
	var current = 0;

	document.addEventListener("DOMContentLoaded", function(){
		display = document.getElementById('slider');
		if(display)
			pages = display.getElementsByClassName('display__page');
			if(pages.length > 0) {
				slider(current);
			}
	});

	var slider = function(page) {

		pages[page].classList.add('shown');

		setTimeout(function(){
			
			setTimeout(function(){
				pages[page].classList.remove('shown');
			}, 500);

			current = (current + 1) % pages.length;
			slider(current);
		}, 7500);
	}
};