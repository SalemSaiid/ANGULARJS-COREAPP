angular.module('ExternalLoads', [])
    .factory('ExternalLoads', ['$window','$state','globalAppConfig', '$q','$log','Storage', 'loader',function ($window,$state,globalAppConfig, loader) {

        /**
         * Dials Phone Number
         * @param numTel
         */
        tel = function(numTel){
            if(WL.Client.getEnvironment() == WL.Environment.ANDROID){
                win = window.open('tel:'+numTel, '_blank');
                setTimeout(function(){win.close();},200);
            }else{
                window.location.href = 'tel:'+numTel;
            }
        };

        /**
         * Send Mail To the address in params
         * @param mail
         */
        mailto = function(mail){
            if(WL.Client.getEnvironment() == WL.Environment.ANDROID){
                win = window.open('mailto:'+mail, '_blank');
                setTimeout(function(){win.close();},200);
            }else{
                window.location.href = 'mailto:'+mail;
            }
        };

        /**
         * Opens Maps with itinerary to the lat long in params
         * @param lat
         * @param long
         */
        openItinerary = function(lat, long){
            try{
                WL.App.openURL("https://maps.google.com?daddr="+ lat +","+ long, "_new");
            }catch(e){
                window.open(globalAppConfig.googleMapsUrl + "?daddr=" + lat + "," + long , "_new");
            }
        };

        /**
         * Opens External Links
         * @param link
         */
        openExternalLink = function(link){
            try{
                WL.App.openURL(link, "_new");
            }catch(e){
                window.open(link, "_new");
            }
        };

        return {
            tel : tel,
            mailto : mailto,
            openItinerary :  openItinerary,
            openExternalLink : openExternalLink
        }
    }]
);