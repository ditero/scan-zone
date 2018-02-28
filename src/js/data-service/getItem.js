const GetItem = () => {

    getItem = async () => {
          let ItemData = new Promise((resolve, reject) => {
               $.getJSON('js/docs/po_step2.json', (data) => resolve(data))
                   .fail((err) => resolve(err));
          });
          let resp = await ItemData.then((f) => f);
   
          return resp;
       }
   
       return {
           getItem
       }
   }