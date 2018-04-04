define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojtable', 'ojs/ojarraytabledatasource', 'ojs/ojdatagrid', 'ojs/ojcollectiondatagriddatasource', 'ojs/ojmodel', 'ojs/ojcollectiontabledatasource'],
    function(oj, ko, $) {
      function model(context) {
                var self = this;
                // set up vars
								self.tableId = ko.observable();
                self.filterBy = ko.observable("");
                self.headerArray = [];
                self.rows = ko.observableArray();
                self.datasource = ko.observable();

                // do the filtering in a new worker 2thread
                var worker = new Worker("js/jet-composites/filter-table/search.js");

                // override the displose method of the component
                self.dispose = function() {
                  worker.terminate();
                }
                // handle the response from the worker thread
                worker.onmessage = function(e) {
                    if(self.datasource()){
                      self.datasource().reset(e.data); // refreshes the binding with filtered data
                    }
                }
                // this will be overriden by the props passed in
                self.rowclicked = function() {
                    console.log("Row clicked but no handler implemented");
                }
                // obj to manage the worker threads for filtering
                self.filterTable = ko.computed(function() {
                    // spin off the worker
                    worker.postMessage({
                        filter: self.filterBy(),
                        rows: self.rows()
                    });
                });
                // add rateLimit
                self.filterTable.extend({rateLimit: 250});

                // parse out the properties passed into the component
                context.props.then(function(properties) {

                    // cache table id for data look ups if passed in
										if (properties.tableid) {
											self.tableId(properties.tableid);
                    }
                    // to catch an implementation without any data passed in
                    if (properties.data) {
                      self.rows = properties.data.rows;
                      self.headers = properties.data.headers;
                      var filteredHeaders = {};

                      if(properties.visiblecolumns) { // can be an array
                        self.columns = properties.visiblecolumns;
                        for(var i = 0; i < self.columns.length; i++) {
                          for(var headerName in self.headers) {
                            if(self.headers[headerName] === self.columns[i]) {
                              filteredHeaders[headerName] = self.columns[i]
                              break;
                            }
                          }
                        }
                      } else {
                        filteredHeaders = self.headers;
                      }
                      // build up the headers array - if filtered
                      for(var prop in filteredHeaders) {
                        var col = {
                          headerText: filteredHeaders[prop],
                          field: prop
                        };
                        self.headerArray.push(col);
                      }
                      // for debugging
                      console.log("header array == "+JSON.stringify(self.headerArray))
                      console.log("rows array == "+JSON.stringify(self.rows))


                      self.datasource(new oj.ArrayTableDataSource([], {idAttribute : "rowIndex"}));
                      self.filterBy(" "); //forces the filterTable computed to run initially, populating the table
                      self.filterBy(properties.filter);
                      self.header = properties.data.headers;
                      if (properties.onrowclick) {
                          self.rowclicked = properties.onrowclick;
                      }

                    } else {
                        console.error("ERROR: must pass 'data' parameter to filter-table. data is an object containing 'headers' (array) and 'rows' (observableArray)");
                    }
                });
        }
    return model;
});
