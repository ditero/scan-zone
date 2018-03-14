const queryUpdates = () => {
    getUpdatedItems = async() => {
        // Get Updated The Information
        let newItems = await $.ajax({
            type: 'GET',
            url: "http://localhost:3001/PO",
            fail: function(xhr, textStatus, errorThrow) { //if the request fail print the error
                console.log(xhr, textStatus, errorThrow);
                return { xhr, textStatus, errorThrow };
            },
            success: (results) => {
                return results;
            }
        });

        console.log(newItems);
        return newItems;
    };

    return {
        getUpdatedItems
    };
};