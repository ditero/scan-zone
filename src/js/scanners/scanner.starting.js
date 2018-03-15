const ScannerStarting = () => {
    const onStartQRScanner = (element) => {
        // QR Scanner
        var video = element;

        var scanner = new Instascan.Scanner({ video: video });

        let scanResult = new Promise((resolve, reject) => {
            scanner.addListener('scan', async(content) => {
                self.qr_state("Scanning..")
                    // self.qrVal(content);
                resolve(content);
                // if (self.qrVal.length !== -1) {
                self.qr_state("Done.");
                // }
                // if (self.currentPage() == 1) {
                //     scanner.stop();
                // }
            });
            Instascan.Camera.getCameras()
                .then((cameras) => {
                    if (cameras.length > 0) {
                        scanner.start(cameras[0]);
                    } else {
                        console.error('No cameras found.');
                    }
                }).catch((error) => {
                    console.log(error);
                    reject(error);
                });
        });

        let scannerResult;

        scanResult.then((content) => {
            scannerResult = content;
        });

        return scannerResult;
    };


    return {
        onStartQRScanner
    };
};