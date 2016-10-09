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
    var nickname =  req.param('nickname');
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
    var card_type = req.param('card_type');
    var nickname = req.param('nickname');
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


exports.makeTransfers = function(req,res){
    //var card_type = req.body.card_type;
    var nickname_payer = req.param('payer');
    var nickname_payee = req.param('payee');
    var payer_account = req.param('payee_account');
    var payee_account = req.param('payer_account');
    var descp = req.param('description');
    var amount = parseInt(req.param('amount'));
    var currDate = req.param('curr_date');
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
            "transaction_date": currDate,//""+d.getFullYear()+"-"+ d.getMonth()+"-"+ d.getDay()+"",
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