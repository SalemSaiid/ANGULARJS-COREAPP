angular.module('loader', [])
    .factory('loader', ["$rootScope", '$log', '$filter',
        function ($rootScope, $log, $filter) {

            var service = {
                isOpen: false,
                show: function (text) {
                    service.isOpen = true;
                    var text = typeof text != "undefined" ? text : "";
                    if (jQuery('body').find('#resultLoading').attr('id') != 'resultLoading') {
                        jQuery('body').append('<div id="resultLoading" style="display:none"><div><img src="assets/img/loader.gif" width="69" height="25"><div id="loadingText">' + text +
                            '</div></div><div class="bg"></div></div>');
                    } else {
                        $('#loadingText').html(text);
                    }

                    jQuery('#resultLoading').css({
                        'width': '100%',
                        'height': '100%',
                        'position': 'fixed',
                        'z-index': '10000000',
                        'top': '0',
                        'left': '0',
                        'right': '0',
                        'bottom': '0',
                        'margin': 'auto'
                    });

                    jQuery('#resultLoading .bg').css({
                        'background': '#2F2F2F',
                        'opacity': '0.7',
                        'width': '100%',
                        'height': '100%',
                        'position': 'absolute',
                        'top': '0'
                    });

                    jQuery('#resultLoading>div:first').css({
                        'width': '250px',
                        'height': '75px',
                        'text-align': 'center',
                        'position': 'fixed',
                        'top': '0',
                        'left': '0',
                        'right': '0',
                        'bottom': '0',
                        'margin': 'auto',
                        'font-size': '16px',
                        'z-index': '10',
                        'color': '#ffffff'

                    });

                    jQuery('#resultLoading .bg').height('100%');
                    jQuery('#resultLoading').fadeIn(300);
                },
                hide: function () {
                    if (service.isOpen) {
                        jQuery('#resultLoading .bg').height('100%');
                        jQuery('#resultLoading').fadeOut(300);
                        service.isOpen = false;
                    }
                }
            };
            window.loader = service;
            return service;
        }]
);