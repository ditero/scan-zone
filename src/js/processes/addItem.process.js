var fsm = new StateMachine({
    init: 'solid',
    transitions: [
        { name: 'addItem', from: 'creatingItem', to: 'addingItem' }
    ],
    methods: {
        BuildScreen: async() => {
            let screenValues = await $.getJSON('js/screens/addItem.json');
            return screenValues;
        },
        ProcessInputs: (itemValues) => {
            let process = fsm;

            // console.log(process, fsm);

            let keys = Object.keys(itemValues);

            let valid = keys.map((key) => {
                return itemValues[key] == undefined || itemValues[key] == "" ? false : true;
            });

            valid.indexOf(false) !== -1 ? process.Errors("check your input") : process.OrchestratorCall(itemValues);
        },
        OrchestratorCall: (item) => {
            let process = fsm;
            console.log(item);

            let modifiedItem = {};

            modifiedItem["inputs"] = [
                { name: "itemNumber", "value": item["itemno"] },
                { name: "itemDesc", "value": item["itemdesc"] },
                { name: "stockingType", "value": "1" },
                { name: "qty", "value": item["itemqty"] },
                { name: "branchPlant", "value": "20" }
            ];

            let credentials = "jdesys:steltixE1";

            // Orchestrator Data Service
            let results = OrchestrationCalls().NewItemAdd(credentials, modifiedItem);

            // console.log(results);

        },
        Errors: (err) => {
            $('.spinner').removeClass('hidden');
            console.log(err);
        }
    }
});