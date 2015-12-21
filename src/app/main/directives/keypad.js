app.directive('keyPad',['dataEncLib',function(dataEncLib) {

    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/main/widgets/keypad.html',
        link: function (scope, element, attrs) {
            scope.digits = ["", "2", "", "3", "", "6", "5", "1", "", "7", "9", "", "8", "", "4"];
            scope.toBeSent = "";

            scope.shuffle = function (array) {
                var currentIndex = array.length, temporaryValue, randomIndex;
                while (0 !== currentIndex) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }
                return array;
            };

            /**
             * This example show how to toggle open/close
             * state of the keypad and set a position at the same time.
             */
            scope.toggleKeypadPosition = function () {
                var params = {
                    position: {
                        x: 600,
                        y: 70
                    }
                };
                //Toggling KeyPad Locking state, second argument is Keypad ID, third is the param object.
                scope.$emit(Keypad.TOGGLE_OPENING, "numeric", params);
            };

            scope.listenedString = "";

            scope.enctedStr = function () {
                var x = Math.floor(Math.random() * 2) + 1;
                var str = '';
                for (i = 1; i <= x; i++) {
                    str += '*';
                }
                return str;
            };

            /**
             * This example show how to listen for the KEY_PRESSED event thrown
             * by the keypad and do what you need to do with it.
             */

            scope.$on(Keypad.KEY_PRESSED, function (event, data) {
                if (data !== '') {
                    scope.toBeSent += dataEncLib.compute(data);
                    scope.listenedString += scope.enctedStr();
                    scope.$digest();
                }
            });


            scope.toggleKeypadOpening = function () {
                //Toggling KeyPad Locking state, second argument is Keypad ID
                scope.$emit(Keypad.TOGGLE_OPENING, "numeric");
            };


            //DEMO APPLICATION CODE NOT WORTH READING

            scope.opened = true;
            scope.openLabel = "Open Keypad";

            scope.$on(Keypad.OPENED, function (event, id) {
                scope.openLabel = "Close Keypad";
                scope.opened = true;
                scope.digits = scope.shuffle(scope.digits);
                if (!scope.$$phase) {
                    scope.$apply();
                }
            });

            scope.closeKeypad = function () {
                close();
                scope.$emit(Keypad.CLOSE, "numeric");
            };
            scope.$on(Keypad.CLOSED, function (event, id) {
                scope.opened = false;
                if (!scope.$$phase) {
                    scope.$apply();
                }
            });


            scope.$on(Keypad.MODIFIER_KEY_PRESSED, function (event, key, id) {
                switch (key) {
                    case "VALIDATE":
                        // @TODO
                        scope.$emit(Keypad.CLOSE, "numeric");
                        alert(scope.toBeSent);
                        break;
                    case "CLEAR":
                        scope.listenedString = "";
                        scope.toBeSent = "";
                        scope.$digest();
                        break;
                }
            });
            scope.locked = true;
            scope.lockLabel = "Lock Keypad";

            scope.toggleKeypadLock = function () {
                toggleLock();
                //Toggling KeyPad Locking state, second argument is Keypad ID
                scope.$emit(Keypad.TOGGLE_LOCKING, "numeric");
            };
            function toggleLock() {
                scope.locked = !scope.locked;

                if (scope.locked) {
                    scope.lockLabel = "Lock Keypad";
                } else {
                    scope.lockLabel = "Unlock Keypad";
                }
            }
        }
    };
}]);