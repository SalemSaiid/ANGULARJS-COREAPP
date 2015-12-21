scriptUtils = {
	getResolved: function(name,files){
		return {
	        lazy: ['$ocLazyLoad', function($ocLazyLoad) {
	            return $ocLazyLoad.load({
	                name: name,
	                files: files
	            });
	        }]
		  }
	}
};
