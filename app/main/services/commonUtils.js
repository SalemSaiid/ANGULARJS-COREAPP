angular.module('CommonUtils', [])
    .factory('CommonUtils', ['$window','$state', '$q','$log','Storage', 'loader',function ($window,$state, $q, $log, Storage, loader) {

        /**
         * Error Handler
         * @param response
         */
        errorHandler = function(response){
            loader.hide();
            $log.error("An error has occurred while calling an adapter ", response);

            // @TODO To be replace by checkResponse with full error handling!
            WL.SimpleDialog.show(
                "Error", "An error has occurred while getting response from the server",
                [
                    {text: "Retry", handler: function() {$state.reload(); }},
                    {text: "Cancel", handler: function() {$window.history.back(); }}
                ]
            );


        };

        /**
         * Getting data from adapter and fill the cache
         * @param adapterParams
         * @param cacheParams
         * @returns {*}
         */
        invokeAndFillCache = function(adapterParams, cacheParams){
            var dfd = $q.defer();
            try{
                invokeAdapter(adapterParams).then(function(data){
                    $log.warn("Filling up the cache with new data : ", cacheParams.key ,data);
                    Storage.set(cacheParams.key, data);
                    dfd.resolve(data);
                }, function(){
                    dfd.reject();
                });
            }catch(e){
                $log.error("An error occurred while invoking an adapter and filling the cache",adapterParams, cacheParams, e);
                dfd.reject();
            }
            return dfd.promise;
        };

        /**
         * Check if the cache has expired
         * @param savedCacheTimestamp
         * @param lifeTime
         * @param lifeTimeUnit
         * @returns {boolean}
         */
        cacheExpired = function(savedCacheTimestamp, lifeTime, lifeTimeUnit){
            try{
                if(typeof lifeTimeUnit == "undefined" || !lifeTimeUnit || (lifeTimeUnit != "minutes" && lifeTimeUnit != "hours" && lifeTimeUnit != "days")){
                    $log.warn("Cache Expiry calculation warning : using 'minutes' as a default unit ! Please check your lifeTimeUnit ! it should be 'minutes', 'days' or 'hours'!");
                    lifeTimeUnit = "minutes";
                }
                switch (lifeTimeUnit) {
                    case "minutes" :
                        lifeTime = lifeTime * 60000;
                        break;
                    case "hours" :
                        lifeTime = lifeTime * 60000 * 60;
                        break;
                    case "days" :
                        lifeTime = lifeTime * 60000 * 60 * 24;
                        break;
                    default :
                        break;
                }

                var currentTimestamp = new Date().getTime();
                return ((currentTimestamp - (savedCacheTimestamp + lifeTime))  >= 0);
            }catch(e){
                $log.error("Failed to verify timestamp !", e);
            }
            return true;
        };

        /**
         * Load Resource From Cache Or Adapter as a fallback
         * @param adapterParams
         * @param cacheParams
         * @returns {deferred}
         */
        loadResource = function(adapterParams, cacheParams){
            try{
                if(cacheParams && typeof cacheParams.enabled != "undefined" && cacheParams.enabled){
                    var dfd = $q.defer();
                    Storage.get(cacheParams.key).then(function(data){
                        if(typeof data.timestamp == "undefined" || cacheExpired(data.timestamp, cacheParams.lifeTime, cacheParams.lifeTimeUnit)){
                            $log.warn("Loading Resources : Cache Expired !", adapterParams, cacheParams);
                            invokeAndFillCache(adapterParams, cacheParams).then(function(newData){
                                dfd.resolve(newData);
                            }, function(){
                                $log.warn("Failed to get new data from adapter ! Getting old data from cache !", cacheParams.key, data);
                                dfd.resolve(data);
                            });
                        }else{
                            $log.info("Getting data from cache : ", cacheParams.key, data);
                            dfd.resolve(data);
                        }
                    },function(){
                        invokeAndFillCache(adapterParams, cacheParams).then(function(data){
                            dfd.resolve(data);
                        }, function(){
                            dfd.reject();
                        });
                    });
                    return dfd.promise;
                }else{
                    return invokeAdapter(adapterParams);
                }
            }catch(e){
                $log.error("Failed to load resource from either cache or adapter : ", e);
            }
        };

        /**
         * Invoke Adapter
         * @param invocationData
         * @returns {*}
         */
        invokeAdapter = function (invocationData) {
            var dfd = $q.defer();
            // LOADER SHOW HERE
            loader.show();
            try {
                WL.Client.invokeProcedure(invocationData, {
                    onSuccess: loadSuccess,
                    onFailure: loadFailure,
                    timeout: 30000
                });
                $log.info("Adapter Request : ", invocationData);
                function loadSuccess(data) {
                    try {
                        // LOADER HIDE HERE
                        loader.hide();
                        $log.info("Adapter Response : ", data);
                        if (typeof data.invocationResult != "undefined") {
                            dfd.resolve(data.invocationResult);
                        } else {
                            errorHandler(data);
                            dfd.reject(data);
                        }
                    } catch (e) {
                        $log.info("Error while sending data : ", e);
                        errorHandler(data);
                        dfd.resolve(data.invocationResult);
                    }
                }

                function loadFailure(result) {
                    // LOADER HIDE HERE
                    loader.hide();
                    $log.info("Invocation Failure : ", result);
                    errorHandler(result);
                    dfd.reject(result.invocationResult);
                }
            } catch (e) {
                loader.hide();
                $log.info("Sending data error : ", e);
                errorHandler(e);
            }
            return dfd.promise;
        };

        return {
            errorHandler : errorHandler,
            loadResource : loadResource,
            invokeAdapter : invokeAdapter
        };
    }]);