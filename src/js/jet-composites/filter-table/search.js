onmessage = function(e) {
    // parse data and filter from the event object
    var filter = e.data.filter;
    var rows = e.data.rows;
    // array to return after filtering
    var tmp = [];
    // loop over data to find matches in filter
    for (var i in rows) {
        for (var j in rows[i]) {
            if (String(rows[i][j]).toLowerCase().trim().indexOf(filter.toLowerCase().trim()) > -1) { //if the cell contains the search term as a substring
                tmp.push(rows[i]);
                break; //so the same row isn't pushed to the filteredTable multiple times
            }
        }
    }
    // post back from the worker to the host process
    postMessage(tmp);
}
