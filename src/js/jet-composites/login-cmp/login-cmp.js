/**
  Copyright (c) 2015, 2017, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojrouter', 'login-process'], function (oj, ko, $) {
        'use strict';

        function LoginComponent(context) {
            var self = this;
            self.composite = context.element;

            self.validMsg = ko.observable("");
            self.deviceName = ko.observable(new Date().getMilliseconds() + 'jde');

            self.login = async function () {
                let loginForm = {};


                let response = new Promise(function (resolve, reject) {
                    $('.loginInputs').each(function (index) {
                        let cName = $(this)[index - index].name;
                        let cVal = $(this).val();

                        loginForm[cName] = cVal;
                    });

                    resolve(true);
                })

                response.then(async function (PromiseStatus) {
                    let resp = await fsm.onVerify(loginForm, self.deviceName());

                    $(".spinner").removeClass('hidden');
                    if (resp) {
                        self.validMsg(resp);
                        $('#validation').removeClass('hidden');
                        $(".spinner").addClass('hidden');
                    }
                    setTimeout(function () {
                        defaultConfig()
                    }, 5000)
                })

            }
            
            const defaultConfig = function () {
                $('#validation').addClass('hidden');
                self.validMsg("");
            }

            context.props.then(function (propertyMap) {
                self.properties = propertyMap;
            });

        };
        return LoginComponent;
    });