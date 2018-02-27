const Mapper = () => {
    getPoData = async () => await GetPoForm().getPo();

    mapper = async () => {
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
                        PoForm[newTitle] ? undefined : PoForm[newTitle] = { id, value, internalValue }
                    }
                });
            });
            resolve(true);
        })
        processNewForm.then((state) => {return PoForm});
    }

    return {
        getPoData,
        mapper
    }
}

const myFunc = function () {

    let myf = Mapper().mapper();

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