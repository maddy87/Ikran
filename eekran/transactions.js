/**
 * Created by rajeshetty on 10/8/16.
 */
'use strict'
/****
 * Gets the current balabce of the user
 * @param req
 * @param res
 */
var repo = require('./repo');
var request = require('request');
var base_url = "http://api.reimaginebanking.com/";

exports.getBalance = function(req,res) {
    //var card_type = req.body.card_type;
    var nickname = req.body.nickname;
    try{

        var cust_id = repo[nickname]['cust_id'];
        //console.log(cust_id);
        var key = repo.key;
        var url = base_url+"customers/"+cust_id+"/accounts?key="+key;
        request.get(url,function(error,response,body){
            if(!error){
                //res.send(JSON.parse(body));
                var result = JSON.parse(body);
                var balances = {Savings:0,'Credit Card':0,'Checking':0};
                for(var x in result){
                    //console.log(result[x]['type']);
                    //var test = result[x]['type'];
                    //balances.push({result[x]['type']: result[x]['balance']});
                    balances[result[x]['type']]=result[x]['balance'];
                }
                console.log("Displaying Balance Information");
                console.log(balances);
                res.send({"Accounts":balances});
            }else{
                console.log("Oops some error occured while getting the balance information");
                response.send({'error':'An error has occured please try again'});
            }
        });
    }
    catch (err) {
        console.log(err);
    }
}

exports.showTransactions = function(req,res) {
    var card_type = req.body.card_type;
    var nickname = req.body.nickname;
    try{

        var cust_id = repo[nickname]['cust_id'];
        var type_id = repo[nickname][card_type];
        //console.log(cust_id);
        //console.log(type_id);
        var key = repo.key;
        var url = base_url+"accounts/"+type_id+"/transfers?type=payer&key="+key;
        request.get(url,function(error,response,body){
            if(!error){
                var result = JSON.parse(body);
                console.log("Showing the list of transactions");
                console.log(result);
                res.send(result);
            }else{
                response.send({'error':'An error has occured please try again'});
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

exports.listUsers = function(req,res){
  console.log("Displaying List of Users");
  console.log(repo.users);
  res.send({"users":repo.users});
};

exports.makeTransfers = function(req,res){
    //var card_type = req.body.card_type;
    var nickname_payer = req.body.payer;
    var nickname_payee = req.body.payee;
    var payer_account = req.body.payee_account;
    var payee_account = req.body.payer_account;
    var descp = req.body.description;
    var amount = req.body.amount;
    try{

        var payercust_id = repo[nickname_payer][payer_account];
        var payeecust_id = repo[nickname_payee][payee_account];
        var d  = new Date();
        console.log("Payer cust id "+payercust_id+" "+payeecust_id);
        var key = repo.key;
        var payload = {
            "medium": "balance",
            "payee_id": payeecust_id,
            "amount": amount,
            "transaction_date": ""+d.getFullYear()+"-"+ d.getMonth()+"-"+ d.getDay()+"",
            "description": descp
        };
        var url = base_url+"accounts/"+payercust_id+"/transfers?key="+key;
        var options = {
            method: 'post',
            body: payload,
            json: true,
            url: url
        };
        request(options,function(error,response,body){
            if(!error){
                res.send(body);
                console.log("Showing list of transactions");
                console.log(body);
            }else{
                response.send({'error':'An error has occured please try again'});
            }
        });
    }
    catch (err) {
        console.log(err);
    }

};

exports.test = function(req,response) {


    var http = require("http");
    /*
    var options = {
        hostname: '173.236.121.66',
        port: 8899,
        path: '/showBalance',
        body: req.body,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    var req = http.request(options, function(res) {
        console.log('Status: ' + res.statusCode);
        console.log('Headers: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (body) {
            console.log('Body here: ' + body);
            //res.send(body);
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

    var payload = {
        "payee_account":"Savings",
        "payer_account":"Savings",
        "payer": "ash",
        "payee": "maddy",
        "descp": "MHACKS 8 Payment",
        "amount" : 150
    };

    var options = {
        hostname: '173.236.121.66',
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
        });
    });
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
// write data to request body

    req.write(JSON.stringify(payload));
    req.end();
    response.send("Testing Complete");


}
