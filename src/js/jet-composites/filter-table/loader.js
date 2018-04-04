define(['ojs/ojcore', 'text!./filter-table.html', './filter-table', 'text!./filter-table.json', 'css!./filter-table.css', 'ojs/ojcomposite'], function (oj, view, viewModel, metadata) {
        oj.Composite.register('filter-table', {
            view: {inline: view},
            viewModel: {inline: viewModel},
            metadata: {inline: JSON.parse(metadata)}
    });
    }   
);
