module.exports = function(viewsPath, wrapperSelector, loaderSelector){

	//Libraries
	const Axios = require('axios');
	const waitForAssets = require('./waitForAssets');
	

	//Vars
	var baseTitle = document.title;
	const separator = ' / ';
	var wrapper = document.querySelector(wrapperSelector);
	var progressbar = document.querySelector(loaderSelector);

	var load = function(name, afterLoading){

		//Show loading screen
		document.body.classList.add('loading');
		wrapper.classList.remove('page-loaded');

		Axios({
			method: 'get',
			url: viewsPath + '/' + name + '.html',
			contentType: 'text/plain'
		})
		.then(function (response) {
			wrapper.innerHTML = response.data;
			var h1 = wrapper.getElementsByTagName('h1');
			if(h1.length && baseTitle !== h1[0].innerHTML )

				document.title = baseTitle + separator + h1[0].innerHTML;
			else
				document.title = baseTitle;

			if(ENV === 'dev')
				console.log('Current view: "' + name + '"');
			
			waitForAssets('#main-wrapper', function() {

				if(afterLoading)
					afterLoading(response.data);

				//Hide loading screen
				wrapper.classList.add('page-loaded');
				document.body.classList.remove('loading');
				setTimeout(function(){
					progressbar.style.width = '0%';
				}, 300);
				

			}, function(data){
				//Animating progress on loading screen
				progressbar.style.width = data.percent + '%';
			});

		}).catch(function(){
			load('404');
		});
	};

	return {
		load: load
	}
}