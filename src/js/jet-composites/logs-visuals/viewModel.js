/**
  Copyright (c) 2015, 2018, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
define(
  ['ojs/ojcore', 'knockout', 'jquery','chats', 'ojs/ojchart'],
  function(oj, ko, $, chats) {
    'use strict';



    function ChartModel() {
      var self = this;
      self.threeDValue = ko.observable('off');
      self.stackLabelValue = ko.observable('on');
      self.datasource = ko.observableArray();
      // var m = chats.getPickerTimes();
      // self.datasource.push(m)
      $.ajax({
        url: "http://localhost:3001/timespend",
        type: 'get',
        contentType: 'application/json',
        headers: {
          'Authorization': sessionStorage.getItem('token')
        },
        success: function (result) {
          console.log(result)
          result.forEach(pickerData => {
            self.datasource.push(pickerData);
            
          });
        }
      })
    }

    var chartModel = new ChartModel();
    return chartModel;

  });
