/**
  Copyright (c) 2015, 2017, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojtable', 'ojs/ojarraytabledatasource'],
    function(oj, ko, $) {
        'use strict';

        function ExampleComponentModel(context) {
            var self = this;
            self.composite = context.element;

            var items = ko.observable([]);

            self.datasource = ko.observable(new oj.ArrayTableDataSource([]))

            context.props.then(function(propertyMap) {
                //Store a reference to the properties for any later use
                self.properties = propertyMap;

                //Parse your component properties here 

                var listenData = setInterval(function() {
                    if (self.properties.formData !== undefined) {
                        self.properties.formData.forEach(item => {
                            if (item.Status == true) {
                                item.Status = 'Confirmed';
                            } else {
                                item.Status = 'Pending';
                            }
                        });
                        items(self.properties.formData);
                        self.datasource(new oj.ArrayTableDataSource(items))
                        clearInterval(listenData);
                    }
                }, 100);

            });
        };

        //Lifecycle methods - uncomment and implement if necessary 
        //ExampleComponentModel.prototype.activated = function(context){
        //};

        //ExampleComponentModel.prototype.attached = function(context){
        //};

        //ExampleComponentModel.prototype.bindingsApplied = function(context){
        //};

        //ExampleComponentModel.prototype.detached = function(context){
        //};

        return ExampleComponentModel;
    });