var express = require('express');
var path = require('path');
var app = express();
var fs = require("fs");

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function getError(c, m, f){
    var code = c;
    var message = m;
    var fields = f;
    return {code,message,fields};
}

function handleInput(res, err, table, salary, column) {
    var error = new Object();
    if (err != null) {
        error["code"]=500;
        error["message"]="Internal server error";
        error["fields"]= ["table","salary","column"];
    }
    else if (table && !isNumber(table) || (table < 29 || table > 40)) {
        error["code"]=400;
        error["message"]="Bad request, not a valid table. Valid tables are between 29 and 40.";
        error["fields"]= "table";
    }
    else if (salary && !isNumber(salary) || salary < 1) {
        error["code"]=400;
        error["message"]="Bad request, not a valid salary. Salary needs to be an positive number.";
        error["fields"]= "salary";
    }
    else if (column && !isNumber(column) || (column < 1 || column > 6)) {
        error["code"]=400;
        error["message"]="Bad request, not a valid column. Valid columns are between 1 and 6.";
        error["fields"]= "salary";
    }
    if(error["code"] != null) {
        res.status(error["code"]).end(JSON.stringify(error));
        return false;
    }
    return true;
}



app.get('/taxtable', function(req, res) {
   
        var rdata = [];
        fs.readFile(__dirname + "/data/" + "taxes.json", 'utf8', function(err, data) {
            if (handleInput(res, err, req.query.table, req.query.salary, req.query.column)) {
                var jdata = JSON.parse(data);
                if(req.query.table){
                    for (var key in jdata) {
                        var obj = jdata[key];
                        if (obj && obj.table == req.query.table) {
                            if (req.query.salary) {
                                var salary = req.query.salary;
                                var column = req.query.column;
                                // Leta rätt intervall
                                if (obj.min <= salary && (obj.max >= salary || obj.max == 0)) {
                                    if (column) {
                                        if (req.query.salary > 80001) {
                                            rdata.push(Math.round(salary * (obj['column'] + column / 100)));
                                        }
                                        else {
                                            rdata.push(obj['column' + column]);
                                        }
                                        break;
                                    }
                                    else {
                                        rdata = obj;
                                        break;
                                    }
                                }
                            }
                            else {
                                rdata.push(obj);
                            }
                        }
    
                    }
                }else{
                    rdata = jdata;
                }
                    
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify(rdata));
            }
        })
});

app.get('/taxrate', function(req, res) {
    
        fs.readFile(__dirname + "/data/" + "municipalTaxes.json", 'utf8', function(err, data) {
            if(handleInput(res, err)){
                
                
                var jdata = JSON.parse(data);
                var rdata = [];
                if(req.query.municipal){
                    for (var key in jdata) {
                        var obj = jdata[key];
                        if (obj.municipal.match(new RegExp("^" + req.query.municipal, 'i'))) {
                            rdata.push(obj);
                        }
                    }
                } else {
                    rdata = jdata;
                }
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify(rdata));
            }
        });
        
    
});


app.use('/public', express.static('./public'));
app.use('/', express.static('./node_modules/swagger-ui'));

// Start server
var server = app.listen(process.env.PORT, function() {
    console.log("Taxtable app listening at http://%s:%s", process.env.IP, process.env.PORT)
})

// To the owner of a black Toyota prius, please move your car. You managed to tripple park in handicap zone, (I dont know how you did that).