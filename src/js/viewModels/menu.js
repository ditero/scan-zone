define(['ojs/ojcore', 'knockout', 'jquery','menu-process', 'jet-composites/menu-cmp/menu-cmp-loader'],
 function(oj, ko, $) {
  
    function MenuViewModel() {
      var self = this;

        const getMenuValues = new Promise(async function(resolve, reject){
          let menuValues = await fsm.MenuScreen();

          resolve(menuValues);
        });
        
        getMenuValues.then(function(menuValues) {
            self.menuInputs(menuValues)
        });

        self.menuInputs = ko.observable();
    }
    return new MenuViewModel();
  }
);
