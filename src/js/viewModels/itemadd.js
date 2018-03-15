define(['ojs/ojcore', 'knockout', 'jquery', 'addItemProcess', 'jet-composites/create-item/loader'],
    function(oj, ko, $) {

        function MenuViewModel() {
            var self = this;

            // Get Screen
            const getAddItemValues = new Promise((resolve, reject) => {
                let values = fsm.BuildScreen();
                resolve(values);
            }).then((itemValues) => {
                self.itemInputs(itemValues);
            });

            self.itemInputs = ko.observable();
        }
        return new MenuViewModel();
    }
);