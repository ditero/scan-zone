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
                var cUser = { username: credentials.username, password: credentials.password, deviceName };
            }
            
            console.log(cUser);

            await $.ajax({
                type: 'post',
                data: JSON.stringify(cUser),
                contentType: "application/json",
                url: credentials.ais + "/jderest/v2/tokenrequest",
                fail: function (xhr, textStatus, errorThrow) { //if the request fail print the error
                    console.log(xhr)
                }
            }).done(function (results) { //if successful print the token
                console.log(results)
                if (results.userInfo.token) {
                    //set token in local storage
                    localStorage.setItem('token', JSON.stringify(results.userInfo.token));
                    //set username in local storage
                    localStorage.setItem('username', JSON.stringify(results.username));
                }
            });

            this.onLogin();        
        },
        onLogin: function () {
                 oj.Router.rootInstance.go('menu');
         }
    }
});