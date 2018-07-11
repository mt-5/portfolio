module.exports = function(){
	document.addEventListener('click', function(e) {
		var el = e.target;
		if(el.classList.contains('c-gallery__nav__link')) {
			var links = document.getElementsByClassName('c-gallery__nav__link');
			console.log(links);
			for (var i = links.length - 1; i >= 0; i--) {
				links[i].classList.remove('active');
			}
			el.classList.add('active');
			var img = el.getAttribute('data-src');
			var isMockup = el.getAttribute('data-mockup');
			var preview = document.getElementById('gallery-preview');

			preview.style.backgroundImage = "url('" + img +"')";

			document.getElementsByClassName('c-mockup')[0].style.display = (isMockup)? 'block':'none';
			
		}
	});
}