module.exports = function(wrapperSelector, callback, onLoadingStepCallback) {

	var assets = [];
	var totalAssets  = 0;
	var loaded = 0;
	var wrapper = document;

	if(wrapperSelector)
		wrapper = document.querySelector(wrapperSelector);

	var loadedAsset = function(){
		var percent = 0;
		var data = {};

		if(totalAssets > 0)
			percent = Math.round(++loaded / totalAssets * 100);
		else
			percent = 100;

		if(onLoadingStepCallback) {
			data = {
				loaded: loaded,
				total: totalAssets,
				percent: percent
			}
			onLoadingStepCallback(data);
		}

		if(loaded === totalAssets){
			if(typeof DEV !== 'undefined')
				console.log('Loaded ' + totalAssets + ' assets.');

			callback();
		}
	};

	//Adding assets by attribute src
	var imgs = wrapper.getElementsByTagName('img[src!=""]');
	for (var i = 0, max = imgs.length; i < max; i++) {
		var url = imgs[i].getAttribute('src');
		if(null !== url && false !== url.empty())
			assets.push(url.trim());
	}

	//Adding assets by style properties
	var DOM = wrapper.getElementsByTagName("*");
	for (var i = 0, max = DOM.length; i < max; i++) {
		var url = window.getComputedStyle(DOM[i], false).backgroundImage;

		if("none" !== url) {
			url = url.match(/url\(["']?([^"']*)["']?\)/)[1];
			assets.push(url.trim());
		}
	}

	var totalAssets = assets.length;

	if(typeof DEV !== 'undefined')
		console.log('Downloading ' + totalAssets + ' assets...');

	if(0 === totalAssets) {
		loadedAsset();
		return;
	}


	for (var i = 0, max = assets.length; i < max; i++) {
		var img = new Image();

        img.onload = img.onerror = loadedAsset;
        img.src = assets[i];
	}
}