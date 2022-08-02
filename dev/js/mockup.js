module.exports = function(){

	const isMobile = require('is-mobile');

	var wrapper = null;
	var display;
	var page;
	var orientation = '';
	var speed = 0.06;
	var scroll = 0;
	var dest = 0;
	var enabled = false;
	var maxOffset = 0;
	var name = null;
	
	var scrolling = function(){

		onScroll();

		scroll += Math.round((dest - scroll) * speed * 10) / 10;

		page.style.transform = 'translate3d(0,' + (-scroll) + 'px,0)';

		if(enabled)
			requestAnimationFrame(scrolling);
	};

	var updateCoords = function(e){
		if(!isMobile()) {
			maxOffset = page.clientHeight - display.clientHeight;
			dest = ((e.clientY - this.getBoundingClientRect().top) / wrapper.clientHeight) * maxOffset;
			if(dest < 0)
				dest = 0;

			else if(dest > maxOffset)
				dest = maxOffset;
		}
	};

	var onScroll = function() {
		if(isMobile()) {
			maxOffset = page.clientHeight - display.clientHeight;
			dest = maxOffset * (window.scrollY / (window.innerHeight * 0.6));
			if(dest < 0)
				dest = 0;

			if(dest > maxOffset)
				dest = maxOffset;
		}
	};

	var start = function() {
		if(!enabled) {
			wrapper.addEventListener('mousemove', updateCoords, false);
			wrapper.addEventListener('mouseenter', updateCoords, false);
			enabled = true;
			scrolling();
			wrapper.classList.add('shown');
		}
	};

	var destroy = function() {
		if(enabled) {
			wrapper.removeEventListener('mousemove', updateCoords, false);
			wrapper.removeEventListener('mouseenter', updateCoords, false);
			enabled = false;
			wrapper.classList.remove('shown');
		}
	};

	var init = function(wrapperSelector) {
		wrapper = document.querySelector(wrapperSelector);
		display = wrapper.querySelector('.screen');
		page = display.querySelector('.website');

		var attr = display.getAttribute('data-orientation');
		orientation = (attr)? attr : 'vertical';

		wrapper.classList.add('shown');
		wrapper.classList.add('animate');

		name = wrapper.getAttribute('id');
	};

	var load = function(imgsrc) {
		page.style.opacity = 0;
		var img = new Image();

        img.onload = function() {
        	scroll = 0;
        	dest = 0;
        	page.src = imgsrc;
        	page.style.opacity = 1;
        };
        img.src = imgsrc;
	};

	var getWrapper = function() {
		return wrapper;
	};


	return {
		init: init,
		load: load,
		start: start,
		destroy: destroy,
		getWrapper: getWrapper
	};
};