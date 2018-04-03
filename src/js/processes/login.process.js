var fsm = new StateMachine({
    init: 'solid',
    transitions: [
        { name: 'login', from: 'login', to: 'menu' }
    ],
    methods: {
        LoginScreen: async function() {
          let inputValues = await  $.getJSON('js/screens/login.json')
           return inputValues;
        },
        onVerify: function (credentials, deviceName) {
            console.log('Verifying User Input')
            let verifcation = false;

            if (credentials['username'] && credentials['password'] && credentials['ais']) {
                verifcation = true;
            }
       
            if (verifcation) {
                this.onGetToken(credentials, deviceName)
            } else {
                return "Something Went Wrong ! Please Check Your Login Credentials.";
            }
        },
        onGetToken: async function (credentials, deviceName) {
            console.log('Verifying User On JDE');
            if (credentials['username'] && credentials['password']) {
                var cUser = { username: credentials.username, password: credentials.password, deviceName};
            }
            
            if (credentials.ais === "http://localhost:3001/scanZone") {
                console.log(cUser);         
                console.log(credentials.ais)
                await $.ajax({
                    url: 'http://localhost:3001/scanZone', // "http://localhost:3001/login", // <<- ScanZone API token service
                    type: 'post', // <<- the method that we using
                    data: JSON.stringify(cUser), // <<- JSON of our request obj
                    contentType: 'application/json', // <<- telling server how we are going to communicate
                    authorization: 'bearer',
                    fail: function(xhr, textStatus, errorThrown) {
        
                      console.log(errorThrown, textStatus, xhr); //  <<- log any http errors to the console
                        return false;  
                    }
                  }).done(function(results, textStatus, xhr, auth) {
                   console.log(results);
                 oj.Router.rootInstance.go('dashboard');
                   
                   if (results.token) {
                    //set token in local storage
                    localStorage.setItem('token', results.token);
                    //set username in local storage
                    localStorage.setItem('username', results.username);
                }
                  });
                
            }else if (credentials.ais === "http://demo.steltix.com" || "http://sandbox921.steltix.com") {
                console.log(cUser);         
                console.log(credentials.ais)
            
            //      await $.ajax({
            //     type: 'post',
            //     data: JSON.stringify(cUser),
            //     contentType: "application/json",
            //     url: credentials.ais + "/jderest/v2/tokenrequest",
            //     fail: function (xhr, textStatus, errorThrow) { //if the request fail print the error
            //         console.log(xhr)
            //     }
            // }).done(function (results) { //if successful print the token
            //     console.log(results)
            //     if (results.userInfo.token) {
            //         //set token in local storage
            //         localStorage.setItem('token', JSON.stringify(results.userInfo.token));
            //         //set username in local storage
            //         localStorage.setItem('username', JSON.stringify(results.username));
            //     }
            //     oj.Router.rootInstance.go('menu');
                
            // });
            oj.Router.rootInstance.go('menu');
            
                
            }
                      

           // this.onLogin();        
        },
        onLogin: function () {
                 oj.Router.rootInstance.go('dashboard');
         }
    }
});