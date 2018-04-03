define(['knockout', 'jquery'], function(ko, $) {

  function getPickerTimes() {
    // filter-table requires an observable for the rows
    let pickerData = ko.observableArray();

    $.ajax({
      url: "http://localhost:3001/timespend",
      type: 'get',
      contentType: 'application/json',
      headers: {
        'Authorization': sessionStorage.getItem('token')
      },
      success: function(result) {
        result.forEach(picker => {
          pickerData.push(picker);
        });
       }
    })
console.log(pickerData());
    
  }

  return {
    getPickerTimes
  }
});
