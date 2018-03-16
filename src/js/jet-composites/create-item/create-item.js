/**
  Copyright (c) 2015, 2018, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
define(
    ['ojs/ojcore', 'knockout', 'jquery', 'StartScanner', 'addItemProcess', 'addItemOrchestrator'],
    function(oj, ko, $, scanner) {
        'use strict';

        function CreateItemModel(context) {
            var self = this;
            self.composite = context.element;


            self.navigateHome = () => {
                oj.Router.rootInstance.go('menu');
            };

            self.inputs = {};
            self.qr_state = ko.observable();
            self.qrVal = ko.observable();
            self.currentPage = ko.observable();

            self.getInputs = () => {
                console.log('Running Click Event');
                $(".spinner").removeClass('hidden');
                $('.newItemInputs').each((index, item) => {
                    let name = item.name;
                    let value = item.value;
                    self.inputs[name] = value;
                });
                console.log(self.inputs);
                fsm.ProcessInputs(self.inputs)
            };


            context.props.then(function(propertyMap) {
                //Store a reference to the properties for any later use
                self.properties = propertyMap;
            });
        };

        CreateItemModel.prototype.attached = function(context) {
            let elem = document.querySelector('#addItemScanner');
            // pick a scanner to start
            // let content = ScannerStarting().onStartQRScanner(elem);

        };

        return CreateItemModel;
    });