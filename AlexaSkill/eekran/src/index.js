/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Hello World to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/***
 * Variables to be used in the applciation
 */

var currbalance = 10000;
var curramount = 0;



/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * Ikran is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */

var Ikran = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Ikran.prototype = Object.create(AlexaSkill.prototype);
Ikran.prototype.constructor = Ikran;

Ikran.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("HelloWorld onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Ikran.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("HelloWorld onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    //var speechOutput = "Welcome to the Alexa Skills Kit, you can say hello";
    //var speechOutput = "YO! YO! YO! Hello I am Alexa's annoying sister.";
    /*var speechOutput = "Hello I am EEKRAM. Your financial buddy!. I can help you provide portfolios based on you age and income. Can you tell me your age please?";
    var repromptText = "Don't be shy. 11 out of 10 people where happy after investing in my recommendations. I am sure so will you. So please tell me your age";
    response.ask(speechOutput, repromptText);*/

    var cardTitle = "EEKRAN!";
    var repromptText = "I can help you with your account balance or make a transfer to a friend on behalf of you";
    var speechText = "<p>DO BANKING WITH JUST VOICE COMMANDS, WELCOME TO THE FUTURE OF BANKING. WELCOME TO EEKRAN</p>";
    var cardOutput = "Welcome to the new age of banking.?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.

    var speechOutput = {
        speech: "<speak>" + speechText + "</speak>",
        type: AlexaSkill.speechOutputType.SSML
    };
    var repromptOutput = {
        speech: repromptText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, cardTitle, cardOutput);
};

Ikran.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("HelloWorld onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
    var cardTitle = "Goodbye!";
    var repromptText = "I can help you with your account balance or make a transfer to a friend on behalf of you";
    var speechText = "<p>THANK YOU! FOR USING EEKRAN. GOODBYE</p>";
    var cardOutput = "THANK YOU FOR USING EEKRAN ";

    var speechOutput = {
        speech: "<speak>" + speechText + "</speak>",
        type: AlexaSkill.speechOutputType.SSML
    };
    var repromptOutput = {
        speech: repromptText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, cardTitle, cardOutput);

};

Ikran.prototype.intentHandlers = {
    // register custom intent handlers

    "TransferIntent": function (intent, session, response) {

        curramount = intent.slots.amount;
        console.dir("Current Amount Detected" + curramount );
        console.dir("Current Balance Detected " + currbalance);

        ///Making an HTTP POST request
        var http = require('http');
        var endpoint  = "http://173.236.121.70:8899/makeTransfers";
        var queryString = "?payee_account=Savings&payer_account=Savings&payer=maddy&payee=ash&descp=MHACKS8&curr_date=2016-10-08&amount="+curramount;
        http.get(endpoint + queryString, function (res) {
            var responseString = '';
            console.log('Status Code: ' + res.statusCode);
            res.on('data', function (data) {
                responseString += data;

            });

            res.on('end', function () {
                var responseObject = JSON.parse(responseString);
                console.log(responseObject);
                //currbalance = responseObject['Accounts']['Savings'];
                //currbalance = 10000;
                var cardTitle = "YOUR ACCOUNT BALANCE";
                var repromptText = ".";
                var speechText = "<p>Transfer Initiated to Ash's account for amount </p>"+"$"+curramount+"."+
                                 "<p>Once the transaction is complete, the balance will be reflected in your account.</p>";
                var cardOutput = "Transfer Initiated to Ash's account for amount $ "+ curramount;
                var speechOutput = {
                    speech: "<speak>" + speechText + "</speak>",
                    type: AlexaSkill.speechOutputType.SSML
                };
                var repromptOutput = {
                    speech: repromptText,
                    type: AlexaSkill.speechOutputType.PLAIN_TEXT
                };
                response.tell(speechOutput, repromptOutput, cardTitle, cardOutput);
            });
        }).on('error', function (e) {
            console.log("Communications error: " + e.message);
        });

        /*

        var payload = {
            "payee_account":"Savings",
            "payer_account":"Savings",
            "payer": "ash",
            "payee": "maddy",
            "descp": "MHACKS 8 Payment",
            "amount" : 150
        };

        var options = {
            hostname: '173.236.121.70',
            port: 8899,
            path: '/makeTransfers',
            body: req.body,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };
        var req = http.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (body) {
                console.log('Body here: ' + body);
                //res.send(body);

                var http = require("http");
                var result = "";
                var options = {
                    hostname: '173.236.121.70',
                    port: 8899,
                    path: '/showBalance',
                    body: req.body,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                };
                var req = http.request(options, function(res) {
                    res.setEncoding('utf8');
                    res.on('data', function (body) {
                        console.log('Body here: ' + body);
                        result = body;
                    });
                });
                req.on('error', function(e) {
                    console.log('problem with request: ' + e.message);
                });
                // write data to request body
                var data = {"nickname":"ash"};
                req.write(JSON.stringify(data));
                req.end();
                response.send("Testing");
                currbalance = result['Accounts']['Savings'];

                var cardTitle = "TRANSFER INITIATED";
                var repromptText = "I can help you with your banking needs";
                var speechText = "<p>Transfer was completed successfully</p>";
                var cardOutput = "Next you can check your balance too";
                // If the user either does not reply to the welcome message or says something that is not
                // understood, they will be prompted again with this text.

                var speechOutput = {
                    speech: "<speak>" + speechText + "</speak>",
                    type: AlexaSkill.speechOutputType.SSML
                };
                var repromptOutput = {
                    speech: repromptText,
                    type: AlexaSkill.speechOutputType.PLAIN_TEXT
                };
                response.askWithCard(speechOutput, repromptOutput, cardTitle, cardOutput);
            });
        });
        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });
        // write data to request body

        req.write(JSON.stringify(payload));
        req.end();
        response.send("Testing Complete");

        currbalance = currbalance - curramount;
        console.log(curramount+ " "+currbalance);
        //currbalance= currbalance - parseInt(curramount);
        */

    },
    "CheckBalanceIntent": function (intent, session, response) {

        ///Making an HTTP POST request
        var http = require('http');
        var endpoint  = "http://173.236.121.70:8899/showBalance";
        var queryString = "?nickname=maddy";
        http.get(endpoint + queryString, function (res) {
            var responseString = '';
            console.log('Status Code: ' + res.statusCode);

            res.on('data', function (data) {
                responseString += data;
            });

            res.on('end', function () {
                var responseObject = JSON.parse(responseString);
                currbalance = responseObject['Accounts']['Savings'];
                //currbalance = 10000;
                var cardTitle = "YOUR ACCOUNT BALANCE";
                var repromptText = ".";
                var speechText = "<p>Your Savings Account balance is </p>"+"$"+ currbalance;
                var cardOutput = "Your account balance is "+ currbalance;
                // If the user either does not reply to the welcome message or says something that is not
                // understood, they will be prompted again with this text.
                var speechOutput = {
                    speech: "<speak>" + speechText + "</speak>",
                    type: AlexaSkill.speechOutputType.SSML
                };
                var repromptOutput = {
                    speech: repromptText,
                    type: AlexaSkill.speechOutputType.PLAIN_TEXT
                };
                response.tell(speechOutput, repromptOutput, cardTitle, cardOutput);

            });
        }).on('error', function (e) {
            console.log("Communications error: " + e.message);
        });

        /*
        var http = require("http");
        var result = "";
        var options = {
            hostname: '173.236.121.70',
            port: 8899,
            path: '/showBalance',
            body: req.body,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };
        var req = http.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (body) {
                console.log('Body here: ' + body);
                result = body;
                currbalance = result['Accounts']['Savings'];
                //currbalance = 10000;
                var cardTitle = "YOUR ACCOUNT BALANCE";
                var repromptText = ".";
                var speechText = "<p>Your Savings Account balance is </p>"+"$"+ currbalance;
                var cardOutput = "Your account balance is "+ currbalance;
                // If the user either does not reply to the welcome message or says something that is not
                // understood, they will be prompted again with this text.
                var speechOutput = {
                    speech: "<speak>" + speechText + "</speak>",
                    type: AlexaSkill.speechOutputType.SSML
                };
                var repromptOutput = {
                    speech: repromptText,
                    type: AlexaSkill.speechOutputType.PLAIN_TEXT
                };
                response.tell(speechOutput, repromptOutput, cardTitle, cardOutput);
            });
        });
        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });
        // write data to request body
        var data = {"nickname":"ash"};
        req.write(JSON.stringify(data));
        req.end();
        response.send("Testing");
        */

    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("I can tell your balance or help you transfer some cash!");
    },
    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = {
            speech: "Goodbye",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = {
            speech: "Goodbye",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HelloWorld skill.
    var ikranObj = new Ikran();
    ikranObj.execute(event, context);
};

