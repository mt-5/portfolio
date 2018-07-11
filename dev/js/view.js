module.exports = function(viewsPath, wrapperSelector, loaderSelector){

	//Libraries
	const Axios = require('axios');
	const waitForAssets = require('./waitForAssets');
	

	//Vars
	var wrapper = document.querySelector(wrapperSelector);
	var progressbar = document.querySelector(loaderSelector);
	var beforeCallback = null;
	var afterCallback = null;
	var errorCallback = null;

	var load = function(name, afterLoading){
		if(beforeCallback)
			beforeCallback();

		//Show loading screen
		document.body.classList.add('loading');

		Axios.get(viewsPath + '/' + name + '.html')
		.then(function (response) {

			wrapper.innerHTML = response.data;
			var h1 = wrapper.getElementsByTagName('h1');
			if(h1.length)
				document.title = wrapper.getElementsByTagName('h1')[0].innerHTML;
			
			waitForAssets(function() {

				if(afterCallback)
					afterCallback();

				if(afterLoading)
					afterLoading(response.data);

				//Hide loading screen
				document.body.classList.remove('loading');
				setTimeout(function(){
					progressbar.style.width = '0%';
				}, 300);
				

			}, function(data){
				//Animating progress on loading screen
				progressbar.style.width = data.percent + '%';
			});

		}).catch(errorCallback);
	};

	return {
		load: load,
		before: function(callback) { beforeCallback = callback },
		after: function(callback) { afterCallback = callback },
		onError: function(callback) { errorCallback = callback }
	}
}