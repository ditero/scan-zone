const updateItem = () => {
    itemUpdated = async(itemToUpdate, poNumber) => {
        console.log(itemToUpdate, poNumber);
        // Update The Information
        let updateResponse = await $.ajax({
            type: 'POST',
            url: "http://localhost:3001/updateItem/" + poNumber,
            data: JSON.stringify(itemToUpdate),
            contentType: 'application/json',
            fail: (xhr, textStatus, errorThrow) => {
                console.log(xhr);

                return { xhr, textStatus, errorThrow };
            },
            success: (results) => {
                return results;
            }
        });

        console.log(updateResponse);
        return updateResponse;
    };

    return {
        itemUpdated
    };
};