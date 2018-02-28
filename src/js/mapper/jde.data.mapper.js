const Mapper = () => {
    getPoData = async () => await GetPoForm().getPo();
    getItemData = async () => await GetItem().getItem();

    poMapper = async (jdeForm) => {
        let data = await getPoData();
        let rowset = data['fs_P43081_W43081A'].data.gridData.rowset;
        let PoForm = {};
        let processNewForm = new Promise(async (resolve, reject) => {
            await rowset.forEach(form => {
                let keys = Object.keys(form);
                keys.forEach(key => {
                    // If Need Be Add More Values
                    let id = form[key].id;
                    let title = form[key].title ? true : false;
                    let value = form[key].value;
                    let internalValue = form[key].internalValue;

                    if (title) {
                        let newTitle = form[key].title.split(" ").join("");
                        PoForm[newTitle] ? undefined : PoForm[newTitle] = { id, value, internalValue };
                    }
                });
            });
            resolve(true);
        })
        processNewForm.then((state) => {console.log(PoForm); return PoForm});
    }

    itemMapper = async () => {
        let data = await getItemData();
        let rowset = data['fs_P43081_W43081B'].data.gridData.rowset;
        let Item = {};
        let processNewItems = new Promise(async (resolve, reject) => {
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
        processNewItems.then((state) => {console.log(Item)});
    }

    return {
        poMapper,
        itemMapper
    }
}

const myFunc = function () {

    let myP = Mapper().poMapper();
    let myI = Mapper().itemMapper();

}

myFunc();


// if (form.fs_P43081_W43081A) {
//     rowSet = form.fs_P43081_W43081A.data.gridData.rowset;
//     rowSet.forEach(item => {
//         if (item.mnOrderNumber_22.internalValue == Number(PO)) {
//             resolve(item);
//         } else {
//             resolve(false);
//         }
//     });
// } else {
//     console.log('did not find the form')
//     resolve(false);
// }