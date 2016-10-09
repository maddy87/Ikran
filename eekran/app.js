/**
 * Created by rajeshetty on 10/8/16.
 */
var express = require('express');
var moment = require('moment');
var bodyParser = require('body-parser');
var cors = require('cors');
var async = require('async');
moment().format();
var app = express();

var jsonParser = bodyParser.json();

var transactions = require('./transactions');
var transactionsGet = require('./transactionsGet');


var http = require('http');
var session = require('express-session')({
    secret: "thisisnotasecret",
    resave: true,
    saveUninitialized: true
});
var port = 8899;
var sharedsession = require('express-socket.io-session');
var httpServer = http.Server(app);
var compression = require('compression');
app.use(compression());
app.use(cors());
httpServer.listen(port, function () {
    console.log("server listening on port", port);
});


app.get('/listusers',transactions.listUsers);

app.post('/showBalance',jsonParser,transactions.getBalance);
app.post('/showTransactions',jsonParser,transactions.showTransactions);
app.post('/makeTransfers',jsonParser,transactions.makeTransfers);
app.post('/test',jsonParser,transactions.test);

app.get('/showBalance',jsonParser,transactionsGet.getBalance);
app.get('/showTransactions',jsonParser,transactionsGet.showTransactions);
app.get('/makeTransfers',jsonParser,transactionsGet.makeTransfers);
