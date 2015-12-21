angular.module('ngDebug', [])

.factory('$debugService',function () {
 
	var Log = Error; // does this do anything?  proper inheritance...?
	Log.prototype.write = function (args,type) {
		  
		/// <summary>
		/// Paulirish-like console.log wrapper.  Includes stack trace via @fredrik SO suggestion (see remarks for sources).
		/// </summary>
		/// <param name="args" type="Array">list of details to log, as provided by `arguments`</param>
		/// <remarks>Includes line numbers by calling Error object -- see
		/// * http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
		/// * http://stackoverflow.com/questions/13815640/a-proper-wrapper-for-console-log-with-correct-line-numberhttp://stackoverflow.com/questions/13815640/a-proper-wrapper-for-console-log-with-correct-line-number
		/// * http://stackoverflow.com/a/3806596/1037948
		/// </remarks>
		
		var LevelType ={
			LOG:0, INFO:1, DEBUG:2, WARN:3, ERROR:4
		};
		
		// via @fredrik SO trace suggestion; wrapping in special construct so it stands out
		/*var suffix = {
				"@": (this.lineNumber
						? this.fileName + ':' + this.lineNumber + ":1" // add arbitrary column value for chrome linking
						: extractLineNumberFromStack(this.stack)
				)
		};*/
		
		var suffix =  this.lineNumber ? this.fileName + ':' + this.lineNumber + ":1" : extractLineNumberFromStack(this.stack);
		 
		args = args.concat([suffix]);
		// via @paulirish console wrapper 
		switch (type){
			case LevelType.LOG:				
				if (console && console.log) {
					if (console.log.apply) { console.log.apply(console, args); } else { console.log(args); } // nicer display in some browsers
				}				
				break;
			case LevelType.INFO:
				if (console && console.info) {
					if (console.info.apply) { console.info.apply(console, args); } else { console.info(args); } // nicer display in some browsers
				}		
				break;
			case LevelType.DEBUG:
				if (console && console.debug) {
					if (console.debug.apply) { console.debug.apply(console, args); } else { console.debug(args); } // nicer display in some browsers
				}		
				break;
			case LevelType.WARN:
				if (console && console.warn) {
					if (console.warn.apply) { console.warn.apply(console, args); } else { console.warn(args); } // nicer display in some browsers
				}		
				break;
			case LevelType.ERROR:
				if (console && console.error) {
					if (console.error.apply) { console.error.apply(console, args); } else { console.error(args); } // nicer display in some browsers
				}		
				break;
		}		 
	};
	 
	var extractLineNumberFromStack = function (stack) {
		/// <summary>
		/// Get the line/filename detail from a Webkit stack trace.  See http://stackoverflow.com/a/3806596/1037948
		/// </summary>
		/// <param name="stack" type="String">the stack string</param>
		
		try {
			// correct line number according to how Log().write implemented
			var line = stack.split('\n')[3];
			// fix for various display text
			line = ( line.indexOf(' (') >= 0
				? line.split(' (')[1].substring(0, line.length - 1)
				: line.split('at ')[1]
				);
			return line.substring(0, line.length - 1);
			
		} catch (e) {
			return false;
		}
	};
	
	return {
		Log: Log
	};    
})

.factory('$logger', ['$config', '$debugService' ,function ($config,$debugService) {
	var enableLogger = $config.enableLogger; 
    //var logLevel  = $config.logLevel;
    var LevelType ={
			LOG:0, INFO:1, DEBUG:2, WARN:3, ERROR:4
	};
      
    var service =  {
    	enableLogger : enableLogger,
        info:function(){
        	if(service.enableLogger){  
        		if($config.isBlackberry){
        			if(console){ console.info.apply(console,arguments); }        			
        		}else{
        			$debugService.Log().write(Array.prototype.slice.call(arguments, 0),LevelType.INFO);
        		}             		
        	}           
        },
        debug:function(){
        	if(service.enableLogger){  
        		if($config.isBlackberry){
        			if(console){ console.debug.apply(console,arguments); }        			
        		}else{
        			$debugService.Log().write(Array.prototype.slice.call(arguments, 0),LevelType.DEBUG);
        		}            		
        	}                
        },
        warn:function(){
        	if(service.enableLogger){  
        		if($config.isBlackberry){
        			if(console){ console.warn.apply(console,arguments); }        			
        		}else{
        			$debugService.Log().write(Array.prototype.slice.call(arguments, 0),LevelType.WARN);
        		}           		
        	}              
        },
        error:function(){
        	if(service.enableLogger){  
        		if($config.isBlackberry){
        			if(console){ console.error.apply(console,arguments); }        			
        		}else{
        			$debugService.Log().write(Array.prototype.slice.call(arguments, 0),LevelType.ERROR);
        		}        		
        	}                
        },
        log : function(){
        	if(service.enableLogger){
//        		if(console){ 			
//					writeLog(console,arguments,LevelType.LOG);									
//				}         		
        		if($config.isBlackberry){
        			if(console){ console.log.apply(console,arguments); }        			
        		}else{
        			$debugService.Log().write(Array.prototype.slice.call(arguments, 0),LevelType.LOG);
        		}          		
        	}  
        } 
    };
    
    return service;

}]);