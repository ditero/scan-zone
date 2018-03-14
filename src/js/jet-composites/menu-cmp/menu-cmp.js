define(
    ['ojs/ojcore', 'knockout', 'jquery', 'menu-process'],
    function(oj, ko, $) {
        'use strict';

        function MenuComponent(context) {
            var self = this;
            self.composite = context.element;

            self.currentProcess = ko.observable();

            MenuComponent.prototype.attached = function(context) {
                $('#processButtons').click(function(e) {
                    self.currentProcess(e.target.value);
                    self.handleClick();
                });
            };

            // Add New Button Handlers Here
            self.handleClick = () => {
                switch (self.currentProcess()) {
                    case "Purchase Order":
                        self.purchaseOrder();
                        break;
                    case "Add Item":
                        self.addItem();
                        break;
                    default:
                        break;
                }
            };

            // Add your custom button functions.
            self.purchaseOrder = () => {
                oj.Router.rootInstance.go('purchase');
            };

            self.addItem = () => {
                oj.Router.rootInstance.go('itemadd');
            };

            self.logout = function() {
                oj.Router.rootInstance.go('/');
            };

            context.props.then(function(propertyMap) {
                //Store a reference to the properties for any later use
                self.properties = propertyMap;

                //Parse your component properties here 
                // console.log(self.properties)
            });


        };

        return MenuComponent;
    });