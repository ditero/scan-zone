var fsm = new StateMachine({
    init: 'solid',
    transitions: [
        { name: 'addItem', from: 'creatingItem', to: 'addingItem' }
    ],
    methods: {
        BuildScreen: async() => {
            let screenValues = await $.getJSON('js/screens/addItem.json')
            return screenValues;
        },
        ProcessInputs: async(itemValues) => {
            let keys = Object.keys(itemValues);

            let valid = keys.map((key) => {
                return itemValues[key] == undefined || itemValues[key] == "" ? false : true;
            });

            valid.indexOf(false) !== -1 ? this.onError("check your input") : this.addItem(itemValues);
        },
        addItem: async function(item) {
            let modifiedItem = {
                itemNo: Number(item["itemno"]),
                itemDescription: item["itemdesc"],
                itemQty: Number(item["itemqty"])
            };
            console.log(modifiedItem);
        },
        onError: async function(err) {
            $('.spinner').removeClass('hidden');
            console.log(err);
        }
    }
});