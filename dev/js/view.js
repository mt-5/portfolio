const waitForAssets = require('./waitForAssets');


function View(options) {

	options = options || {};

	this._titleSeparator = options.titleSeparator || ' / ';
	this._viewsPath = options.viewsPath || '/';
	this._wrapperSelector = options.wrapperSelector || 'body';
	this._loaderSelector = options.loaderSelector || 'body';
	this._progressbarSelector = options.progressbarSelector || 'body';
	this._baseTitle = options.baseTitle || document.title;
	this._wrapper = document.querySelector(this._wrapperSelector);
	this._progressbar = document.querySelector(this._progressbarSelector);
	this._loader = document.querySelector(this._loaderSelector);
	this._beforeCallback = options.beforeCallback || function(){};
	this._afterCallback = options.afterCallback || function(){};
	this._wrapper = document.querySelector(options.wrapperSelector);
}

View.prototype.load = function(name, afterLoading){

	this._beforeCallback();
	that = this;

	//Show loading screen
	that._loader.classList.add('loading');
	that._wrapper.classList.remove('page-loaded');

	Axios({
		method: 'get',
		url: that._viewsPath + '/' + name + '.html',
		contentType: 'text/plain'
	})
	.then(function (response) {

		that._wrapper.innerHTML = response.data;
		
		var h1 = that._wrapper.getElementsByTagName('h1');
		
		if(h1.length && that._baseTitle !== h1[0].innerHTML )
			document.title = that._baseTitle + that._titleSeparator + h1[0].innerHTML;
		else
			document.title = that._baseTitle;

		if(typeof DEV !== 'undefined')
			console.log('Current view: "' + name + '"');
		
		waitForAssets(that._wrapper, function() {

			that._afterCallback();

			if(afterLoading)
				afterLoading(response.data);

			//Hide loading screen
			that._wrapper.classList.add('page-loaded');
			that._loader.classList.remove('loading');
			setTimeout(function(){
				that._progressbar.style.width = '0%';
			}, 300);

		}, function(data){
			//Animating progress on loading screen
			that._progressbar.style.width = data.percent + '%';
		});

	}).catch(function(){
		that.load('404');
	});
};

View.prototype.before = function(callback) {
	this._beforeCallback = callback;
}

View.prototype.after = function(callback) {
	this._afterCallback = callback;
}

module.exports = View;