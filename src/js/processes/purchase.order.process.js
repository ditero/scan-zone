var CurrentItems = [];
var rowSet;

var fsm = new StateMachine({
    init: 'solid',
    transitions: [
        { name: 'purchaseOrder', from: 'getPO', to: 'updateItem' }
    ],
    methods: {
        onStartBarcodeScanner: function () {
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

                }, function (err) {
                    if (err) {
                        console.log(err);
                        return
                    }

                    console.log("Initialization finished. Ready to start");
                    Quagga.start();

                    // Set flag to is running
                    _scannerIsRunning = true;
                });

                Quagga.onDetected(function (data) {
                    console.log(data.codeResult.code)
                    // console.log("Barcode detected and processed : [" + result.codeResult.code + "]", result);
                });
            }
        },
        onStartQRScanner: function () {
            // QR Scanner
            let video = document.querySelector('#preview');

            let scanner = new Instascan.Scanner({ video: video });

            let scanResult = new Promise(function (resolve, reject) {
                scanner.addListener('scan', async function (content) {
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
            Instascan.Camera.getCameras().then(function (cameras) {
                if (cameras.length > 0) {
                    scanner.start(cameras[0]);
                } else {
                    console.error('No cameras found.');
                }
            }).catch(function (e) {
                console.error(e);
            });
        },
        onProcessPO: function (PO) {
            if (PO !== undefined || PO !== "") {
                if (self.currentPage() == 1) {
                    this.onSearchItem(PO);
                } else if (self.currentPage() == 0) {
                    this.onGetItem(PO);
                }
            } else {
                return false;
            }
        },
        onGetItem: async function (PO) {
            // Make AJAX CALL TO API
            var item;

            var form = $.getJSON('js/docs/po_step1.json', function () {
                console.log('success');
            })
            .done(function (form) {
                if (form.fs_P43081_W43081A) {
                    rowSet = form.fs_P43081_W43081A.data.gridData.rowset;
                    rowSet.forEach(item => {
                        console.log(item)
                    })
                }
            })
            .fail(function (err) {
                console.log('error')
            })

            // await $.ajax({
            //     type: 'GET',
            //     url: "http://localhost:3001/PO",
            //     fail: function (xhr, textStatus, errorThrow) { //if the request fail print the error
            //         console.log(xhr)
            //     }
            // }).done(function (results) { //if successful print the token
            //     item = results[0];
            // });

            // this.onsetValues(item)                
        },
        onsetValues: async function (item) {
            if (item) {
                console.log(item);
                CurrentItems = item;
                self.poNumber(item.PO);
                self.poSupplier(item.SupplierNo);
                self.poOrderDate(item.orderDate);
                self.poTotalAmount(item.totalAmount);

                this.onChangePage();
            } else {
                return false;
            }
        },
        onSearchItem: function (itemNo) {
            let itemList = CurrentItems.Details;
            itemList.forEach(item => {
                if (item.ItemNo == itemNo) {
                    console.log(item);
                    self.itemNo(item.ItemNo);
                    self.itemCost(item.Cost);
                    self.itemQty(item.Qty);
                    if (item.Status == false) {
                        self.pending(true);
                        self.confirm(false)
                    } else {
                        self.pending(false);
                        self.confirm(true)
                    }
                };
            });

            this.onChangePage();
        },
        onUpdateItem: async function () {
            let status = false;
            var confirmed = $("#Confirm").prop('checked');

            console.log(confirmed);

            let itemToUpdate = {
                ItemNo: self.itemNo(),
                Cost: Number(self.itemCost()),
                Qty: Number(self.itemQty()),
                Status: confirmed
            }
            let result = false;

            // Update The Information
            await $.ajax({
                type: 'POST',
                url: "http://localhost:3001/updateItem/" + self.poNumber(),
                data: JSON.stringify(itemToUpdate),
                contentType: 'application/json',
                fail: function (xhr, textStatus, errorThrow) { //if the request fail print the error
                    console.log(xhr)
                }
            }).done(function (results) { //if successful print the token
                if (results.ok == 1) {
                    result = true;
                    console.log(results);
                }
            });

            if (result == true) {
                this.onChangePage();
                this.onGetUpdatedInfo();
            } else {
                alert('Something went wrong. Could not update the item');
            }
        },
        onGetUpdatedInfo: async function () {
            await $.ajax({
                type: 'GET',
                url: "http://localhost:3001/PO",
                fail: function (xhr, textStatus, errorThrow) { //if the request fail print the error
                    console.log(xhr)
                }
            }).done(function (results) { //if successful print the token
                self.tableData(results[0].Details);
                console.log(results)
            });

            console.log(self.tableData())
        },
        onChangePage: function () {
            let inc = self.currentPage() + 1;
            self.currentPage(inc);
            console.log(self.currentPage())
            this.switchScreens(self.currentPage());
        },
        switchScreens: async function (index) {
            switch (index) {
                case 1:
                    $('#poForm').removeClass('hidden');
                    $('.alert').removeClass('hidden');
                    break;
                case 2:
                    $('#scan-controls').addClass('hidden');
                    $("#output-form").removeClass('hidden');
                    $(".alert").addClass('hidden');
                    $('#rescanPO').addClass('hidden');
                    break;
                case 3:
                    $("#output-form").addClass('hidden');
                    $("#formTable").removeClass('hidden');
                    break;
                default:
                    break;
            }
        }

    }
});