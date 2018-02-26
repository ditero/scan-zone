define(['ojs/ojcore', 'knockout', 'jquery', 'login-process', 'jet-composites/login-cmp/login-cmp-loader'], function(oj, ko, $) { 
     function LoginViewModel() {
      var self = this;
      
     // Get Input Values
     const getInputVals = new Promise(async function(resolve, reject) {
        let values = await fsm.LoginScreen();
         resolve(values);
     });
      getInputVals.then(function(values) {
        self.loginValues(values);
      });

     self.loginValues = ko.observable();
    }
    return new LoginViewModel();
  }
);
