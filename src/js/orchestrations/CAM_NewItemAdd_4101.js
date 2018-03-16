const OrchestrationCalls = () => {

    const NewItemAdd = async(credentials, itemData) => {
        let base64_credentials = encoder(credentials);
        let base_url = 'http://sandbox921.steltix.com/jderest/orchestrator/';

        // let results = await $.ajax({
        //     url: base_url + 'CAM_NewItemAdd_4101',
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         "Authorization": `Basic ${base64_credentials}`
        //     },
        //     data: JSON.stringify(itemData),
        //     fail: (xhr, error) => {
        //         console.log(xhr, error);
        //     },
        //     success: (result) => {
        //         console.log(result);
        //     }
        // });

        let results = await fetch(base_url + 'CAM_NewItemAdd_4101', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${base64_credentials}`
            },
            body: JSON.stringify(itemData)
        }).then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log(error);
        });
        return results;
    };
    const encoder = (text) => {
        let encodedText = btoa(text);

        return encodedText;
    };


    return {
        NewItemAdd
    };
};