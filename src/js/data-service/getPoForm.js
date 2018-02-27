const GetPoForm = () => {

 getPo = async () => {
       let formData = new Promise((resolve, reject) => {
            $.getJSON('js/docs/po_step1.json', (data) => resolve(data))
                .fail((err) => resolve(err));
       });
       let resp = await formData.then((f) => f);

       return resp;
    }

    return {
        getPo
    }
}