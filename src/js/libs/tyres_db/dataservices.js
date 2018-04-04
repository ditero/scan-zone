define(['knockout', 'jquery'], function (ko, $) {

  function getItemsAPI() {
    // use a promise for async data
    const df = $.Deferred();
    return df.promise()
  }

  function getItemsStatic() {
    // filter-table requires an observable for the rows
    let logData = ko.observableArray();
    let storeLocation = ko.observableArray();
    var items;
    var obj = {}
    $.ajax({
      url: "http://localhost:3001/manager",
      type: 'get',
      contentType: 'application/json',
      headers:{'Authorization': localStorage.getItem('token')},
      success: function (result) {
        items = result
        let cnt = 0; // var for our rowIndex prop
        // add the rowIndex
        items.forEach(function (oneItem) {
          oneItem.rowIndex = cnt; // add rowIndex since our rows do not have unique keys
          cnt++
        })
        logData(items);
        console.log(items);
      }
    })

    // return an object we can use in filter-table
    return {
      rows: logData
    }
  }

  return {
    getItemsStatic: getItemsStatic,
    getItemsAPI: getItemsAPI
  }
});
