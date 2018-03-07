const Mapper = () => {
    getPoData = async() => await GetPoForm().getPo();
    getItemData = async() => await GetItem().getItem();

    poMapper = async() => {
        let data = await getPoData();
        console.log(data)
        let rowset = data['fs_P43081_W43081A'].data.gridData.rowset;
        let titles = data['fs_P43081_W43081A'].data.gridData.titles;

        let newKeys = {};
        let newObj = {};

        let processNewForm = new Promise(async(resolve, reject) => {
            for (var title in titles) {
                let cTitle = titles[title].split(" ").join("");
                newKeys[cTitle] ? undefined : newKeys[cTitle] = "";
            }

            let poForm = [];

            function replaceAll(str, find, replace) {
                let manip = str.replace(new RegExp(find, 'g'), replace);
                return manip;
            }

            for (var x = 0; x < rowset.length; x++) {
                cRow = rowset[x];

                let keys = Object.keys(cRow);
                let stringRowset = JSON.stringify(cRow);
                let replaceVal = "";

                keys.forEach(async key => {
                    let title = cRow[key].title;

                    if (title) {
                        let newTitle = JSON.stringify(title.split(" ").join(""));
                        let cKey = JSON.stringify(key);

                        replaceVal = replaceAll(stringRowset, cKey, newTitle);
                    }
                })

                let parseRowset = JSON.parse(replaceVal);

                poForm.push(parseRowset)
            }


            // let newO = {}
            // let n = 0

            console.log(poForm)
                // newObj[index] ? undefined : newObj[index] = row;
        })

        // console.log(rowset)

        // processNewForm.then((state) => { console.log(PoForm); return PoForm });


    }

    itemMapper = async() => {
        let data = await getItemData();
        let rowset = data['fs_P43081_W43081B'].data.gridData.rowset;
        let Item = {};
        let processNewItems = new Promise(async(resolve, reject) => {
            await rowset.forEach(item => {
                let keys = Object.keys(item);
                keys.forEach(key => {
                    // If Need Be Add More Values
                    let id = item[key].id;
                    let title = item[key].title ? true : false;
                    let value = item[key].value;
                    let internalValue = item[key].internalValue;

                    if (title) {
                        let newTitle = item[key].title.split(" ").join("");
                        Item[newTitle] ? undefined : Item[newTitle] = { id, value, internalValue };
                    }
                });
            });
            resolve(true);
        })
        processNewItems.then((state) => { console.log(Item) });
    }

    return {
        poMapper,
        itemMapper
    }
}

const myFunc = function() {

    let myP = Mapper().poMapper();
    // let myI = Mapper().itemMapper();

}

myFunc();