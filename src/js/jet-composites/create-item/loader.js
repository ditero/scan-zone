/**
  Copyright (c) 2015, 2018, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
define(['ojs/ojcore', 'text!./create-item.html', './create-item', 'text!./create-item.json', 'css!./styles', 'ojs/ojcomposite'],
    function(oj, view, viewModel, metadata) {
        oj.Composite.register('create-item', {
            view: { inline: view },
            viewModel: { inline: viewModel },
            metadata: { inline: JSON.parse(metadata) }
        });
    }
);