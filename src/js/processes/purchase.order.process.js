var CurrentItems = [];
var rowSet;

var fsm = new StateMachine({
    init: 'solid',
    transitions: [
        { name: 'purchaseOrder', from: 'getPO', to: 'updateItem' }
    ],
    methods: {
        onStartBarcodeScanner: function() {
            // Barcode Scanner
            // safely access `navigator.mediaDevices.getUserMedia
            if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
                // safely access `navigator.mediaDevices.getUserMedia


                var _scannerIsRunning = false;
                Quagga.init({
                    inputStream: {
                        name: "Live",
                        type: "LiveStream",
                        target: document.getElementById('scanelem'),
                        constraints: {
                            width: 400,
                            height: 165,
                            facingMode: "environment"
                        },
                    },
                    decoder: {
                        readers: [
                            "code_128_reader",
                            "ean_reader",
                            "ean_8_reader",
                            "code_39_reader",
                            "code_39_vin_reader",
                            "codabar_reader",
                            "upc_reader",
                            "upc_e_reader",
                            "i2of5_reader"
                        ],
                        debug: {
                            showCanvas: false,
                            showPatches: false,
                            showFoundPatches: false,
                            showSkeleton: false,
                            showLabels: false,
                            showPatchLabels: false,
                            showRemainingPatchLabels: false,
                            boxFromPatches: {
                                showTransformed: false,
                                showTransformedBox: false,
                                showBB: false
                            }
                        }
                    },

                }, function(err) {
                    if (err) {
                        console.log(err);
                        return
                    }

                    console.log("Initialization finished. Ready to start");
                    Quagga.start();

                    // Set flag to is running
                    _scannerIsRunning = true;
                });

                Quagga.onDetected(function(data) {
                    console.log(data.codeResult.code)
                        // console.log("Barcode detected and processed : [" + result.codeResult.code + "]", result);
                });
            }
        },
        onStartQRScanner: function() {
            // QR Scanner
            var video = document.querySelector('#preview');

            var scanner = new Instascan.Scanner({ video: video });

            let scanResult = new Promise(function(resolve, reject) {
                scanner.addListener('scan', async function(content) {
                    self.qr_state("Scanning..")
                    self.qrVal(content);
                    resolve(content);
                    if (self.qrVal.length !== -1) {
                        self.qr_state("Done.");
                    }
                    if (self.currentPage() == 1) {
                        scanner.stop();
                    }
                });
            });
            Instascan.Camera.getCameras().then(function(cameras) {
                if (cameras.length > 0) {
                    scanner.start(cameras[0]);
                } else {
                    console.error('No cameras found.');
                }
            }).catch(function(e) {
                console.error(e);
            });
        },
        onProcessPO: function(PO) {
            if (PO !== undefined || PO !== "") {
                if (self.currentPage() == 1) {
                    this.onGetItem(PO);
                } else if (self.currentPage() == 0) {
                    this.onGetPurchaseOrder(PO);
                }
            } else {
                return false;
            }
        },
        onGetPurchaseOrder: async function(PO) {
            // Make AJAX call
            let itemPO;
            let myPOForm = await Mapper().jdeMapper("fs_P43081_W43081A");

            // get PO Number
            let getPO = [];
            myPOForm.map((formItem) => {
                if (formItem['OrderNumber'].value == PO) {
                    getPO.push(formItem)
                } else {
                    return false
                }
            });
            console.log(getPO);
            getPO.length > 0 ? this.onsetValues(getPO, "po") : this.onErrors('PO Form Was Not Found! Try Entering a PO Number Again');
        },
        onGetItem: async function(itemNo) {
            // get items list
            let myItems = await Mapper().jdeMapper("fs_P43081_W43081B");

            // get Item Number
            let foundItem = [];
            myItems.map((item) => {
                let currentItemNo = item['ItemNumber'].value;
                if (Number(currentItemNo) == Number(itemNo)) {
                    foundItem.push(item)
                } else {
                    return false
                }
            });

            foundItem.length > 0 ? this.onsetValues(foundItem, "item") : this.onErrors('Item Not Found. Please Rescan Or Enter Item Number Again.');
        },
        onsetValues: async function(data, type) {
            const populatePO = (po) => {
                self.poNumber(po.OrderNumber.value);
                self.poSupplier(po.SupplierName.value);
                self.poOrderDate(po.OrderDate.value);
                self.poTotalAmount(po.OrderAmount.value);

                this.onChangePage();
            };

            const populateItem = (item) => {
                self.itemNo(item.ItemNumber.value);
                self.itemCost(item.UnitCost.value);
                self.itemQty(item.QuantityOrdered.value);
                self.itemDesc(item.Description.value);
                item.Status.value == 'Cancelled' ? () => {
                    self.pending(!false);
                    self.confirm(!true);
                } : () => {
                    self.pending(!false);
                    self.confirm(!true);
                };
                this.onChangePage();
            };

            type == "po" ? populatePO(data[0]) : type == 'item' ? populateItem(data[0]) : alert('Something Went Horribly Wrong !');
        },

        onUpdateItem: async function() {
            let status = false;
            var confirmed = $("#Confirm").prop('checked');
            let modifiedCost = self.itemCost().split(",").join("");

            let itemToUpdate = {
                ItemNo: Number(self.itemNo()),
                Cost: parseFloat(modifiedCost).toFixed(2),
                Qty: Number(self.itemQty()),
                Status: confirmed
            };

            // Update The Information
            let results = await updateItem().itemUpdated(itemToUpdate, self.poNumber());

            // success function to change page and get updated info
            const processUpdates = () => {
                this.onChangePage();
                this.onGetUpdatedInfo();
            };

            // Check wether the update was successful
            results.message == 'success' ? processUpdates() : alert('Something went wrong. Could not update the item. Review your values');
        },
        onGetUpdatedInfo: async function() {
            let updatedItems = await queryUpdates().getUpdatedItems();
            updatedItems.length > 0 ? self.tableData(updatedItems[0].Details) : alert('Could not retrieve updated information.');
        },
        onChangePage: function() {
            let inc = self.currentPage() + 1;
            self.currentPage(inc);
            let checkingProcess = `Currently at process No. ${self.currentPage()}`;
            console.log(checkingProcess);
            this.switchScreens(self.currentPage());
        },
        switchScreens: async function(index) {
            switch (index) {
                case 1:
                    $('#poForm').removeClass('hidden');
                    $('#scanSuccess').removeClass('hidden');
                    break;
                case 2:
                    $('#scan-controls').addClass('hidden');
                    $("#output-form").removeClass('hidden');
                    $("#scanSuccess").addClass('hidden');
                    $('#rescanPO').addClass('hidden');
                    break;
                case 3:
                    $("#output-form").addClass('hidden');
                    $("#formTable").removeClass('hidden');
                    break;
                default:
                    break;
            }
        },
        onErrors: async function(error) {
            $('#scanErrorElement').removeClass("hidden");
            // this.onStartQRScanner();
            self.scanErrors(error);
            setTimeout(() => $('#scanErrorElement').addClass('hidden'), 3500);
        }
    }
});