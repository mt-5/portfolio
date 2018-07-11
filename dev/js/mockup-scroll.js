module.exports = function(){

	var mockup;
	var display;
	var page;
	var orientation = '';
	var speed = 0.06;
	var scroll = 0;
	var dest = 0;
	var enabled = false;
	var maxOffset = 0;
	
	var scrolling = function(){

		scroll += Math.round((dest - scroll) * speed * 10) / 10;

		page.style.transform = 'translate3d(0,' + (-scroll) + 'px,0)';

		if(enabled){
			requestAnimationFrame(scrolling);
		}
	};

	var updateCoords = function(e){
		maxOffset = page.clientHeight - display.clientHeight;
		dest = ((e.clientY - this.getBoundingClientRect().top) / mockup.clientHeight) * maxOffset;
		if(dest < 0)
			dest = 0;

		else if(dest > maxOffset)
			dest = maxOffset;
	};

	return {
		init: function(){
			mockup = document.getElementById('mockup-scroll');
			
			if(mockup) {
				display = mockup.getElementsByClassName('mcks-display')[0];
				page = display.getElementsByClassName('mcks-page')[0];

				var attr = display.getAttribute('data-orientation');
				
				if(attr)
					orientation = attr;
				else
					orientation = 'vertical';

				this.start();
			}
		},
		stop: function() {
			enabled = false;
			mockup.removeEventListener('mousemove', updateCoords, false);
			mockup.removeEventListener('mouseenter', updateCoords, false);
		},
		start: function() {
			mockup.addEventListener('mousemove', updateCoords, false);
			mockup.addEventListener('mouseenter', updateCoords, false);

			enabled = true;
			scrolling();
		}
	}
};