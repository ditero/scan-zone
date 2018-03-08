const Mapper = () => {
    getPoData = async() => await GetPoForm().getPo();
    getItemData = async() => await GetItem().getItem();

    jdeMapper = async formIdentifier => {
        let formId = formIdentifier.charAt(formIdentifier.length - 1);
        let data;

        switch (formId) {
            case "A":
                data = await getPoData();
                break;
            case "B":
                data = await getItemData();
            default:
                break;
        }


        let rowset = data[formIdentifier].data.gridData.rowset;
        let processNewForm = new Promise(async(resolve, reject) => {
            let poForm = [];

            // loop through the key value pairs data
            for (var x = 0; x < rowset.length; x++) {
                // save the current row
                cRow = rowset[x];

                // get the keys of the current row
                let keys = Object.keys(cRow);

                // stringify the current
                let stringRowset = JSON.stringify(cRow);
                let replaceVal = stringRowset;

                // loop through each key
                keys.forEach(key => {
                    // get the title of the current row
                    let title = cRow[key].title;
                    let value = cRow[key].value;

                    if (title) {
                        let newKey = title.split(" ").join("");
                        let cKey = key;

                        // call replaceAll func and pass in the stringified rowset and current key and the new key
                        replaceVal = replaceAll(replaceVal, cKey, newKey);
                    }
                });
                let parseRowset = JSON.parse(replaceVal);

                poForm.push(parseRowset);
            }

            // set poForm to the returned form
            poForm = createKeyValPairs(poForm);

            // Function to find and replace all the keys in jde stringified data
            function replaceAll(str, find, replace) {
                let newStr = str.replace(new RegExp(find, "g"), replace);
                return newStr;
            }

            //Transform poForm data to key value pairs
            function createKeyValPairs(form) {
                //get keys of form param
                let keys = Object.keys(form);

                let keyValForm = [];

                for (var i = 0; i < form.length; i++) {
                    let currentRow = form[i];

                    let keys = Object.keys(currentRow);

                    keys.forEach(key => {
                        // Remove MOExist 
                        switch (currentRow[key]) {
                            case false:
                                delete currentRow[key];
                            case true:
                                delete currentRow[key];
                            default:
                                break;
                        }

                        // get current value of current row
                        // delete the keys that doesn't have the value key prop to it
                        let currentValue = currentRow[key];
                        if (currentValue && typeof currentValue !== "number") {
                            let currentKey = Object.keys(currentValue);
                            currentKey.forEach(cKey => {
                                if (cKey !== "value") {
                                    delete currentRow[key][cKey];
                                }
                            });
                        }
                    });
                    keyValForm.push(currentRow);
                }
                return keyValForm;
            }
            resolve(poForm);
        });

        processNewForm.then(newForm => {
            console.log(newForm);
            return newForm;
        });
    };

    return {
        jdeMapper
    };
};

const myFunc = function() {
    let myP = Mapper().jdeMapper("fs_P43081_W43081A");
};

myFunc();