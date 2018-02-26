/**
  Copyright (c) 2015, 2017, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojbutton','../data-table/data-table.loader', 'Quagga', 'purchase-order-process'], function (oj, ko, $) {
        'use strict';

        function ExampleComponentModel(context) {
            var self = this;

            self.composite = context.element;
               // Scanner Selection
               this.handleScannerChange = function (event, ui) {
                if (ui.option === "checked") {
                    if (ui.value === 'barcode') {
                        $('.br').removeClass('hidden');
                        $('.qr').addClass('hidden');
                        // startScanner();
                    } else if (ui.value === 'qr') {
                        $('.br').addClass('hidden');
                        $('.qr').removeClass('hidden');
                        // Quagga.stop();
                    }
                }
            };

            
            

            context.props.then(function (propertyMap) {
                //Store a reference to the properties for any later use
                self.properties = propertyMap;

                //Parse your component properties here 

            });
        };

        ExampleComponentModel.prototype.attached = function (context) {
            $('#output-form').addClass('hidden');
            $('#poForm').addClass('hidden');
            $("#formTable").addClass('hidden');


            self.activeQR = false;
            this.scanners = [
                { id: 'qr', label: 'QR' },
                { id: 'barcode', label: 'Barcode' },
            ];
            this.opts = ko.observable("qr");


            console.log(context);

            self.qrVal = ko.observable("");
            self.qr_state = ko.observable("");
            self.scanErrors = ko.observable("")

            // Item Values
            self.itemNo = ko.observable("");
            self.itemCost = ko.observable("");
            self.itemQty = ko.observable("");
            self.itemDesc = ko.observable("");
            self.confirm = ko.observable(true);
            self.pending = ko.observable(false);

            // PO Form Values
            self.poNumber = ko.observable();
            self.poSupplier = ko.observable();
            self.poOrderDate = ko.observable();
            self.poTotalAmount = ko.observable();

            self.tableData = ko.observable();

            self.tableDate = [];
            self.tableState = true;

            self.currentPage = ko.observable(0);
            
            // localStorage.setItem('currentPagination', 1);

            var storedqrVal = self.qrVal();

            let watchqrVal = setInterval(function() {
                // legetItem('currentPagination'));
                if (self.qrVal() !== storedqrVal) {
                    fsm.onProcessPO(self.qrVal());
                    storedqrVal = self.qrVal();
                }
            }, 100);

            self.rescanPo = function() {
                $('#poForm').addClass('hidden');
                $('.alert').addClass('hidden');
                self.qrVal("");
                storedqrVal = self.qrVal();
                self.currentPage(0);  
            }

            self.UpdateItem = function() {
                fsm.onUpdateItem()
            }
            // $('.pagination').on("click", function(event, num){
            //     let cMovement = event.target.id;
            //     if (cMovement === 'previousScreen') {
            //         if (currentPage == 1) {
            //             fsm.switchScreens(1)
            //         } else {
            //             currentPage--;
            //             fsm.switchScreens(currentPage);
            //         }
            //     }
            // });

            fsm.onStartQRScanner();
        };

        ExampleComponentModel.prototype.bindingsApplied = function (context) {
            $('.br').addClass('hidden')
        };
        return ExampleComponentModel;
    });