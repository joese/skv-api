var sw = require("swagger-node-express");
var paramTypes = sw.paramTypes;
var url = require("url");
var swe = sw.errors;

var data = require("./service.js");

// the description will be picked up in the resource listing
exports.findByTable = {
  'spec': {
    description : "Operations about taxtables",  
    path : "/taxtable",
    method: "GET",
    summary : "Find table by number",
    notes : "Returns a table based on table number",
    type : "Taxtable",
    nickname : "getByTaxtable",
    produces : ["application/json"],
    responseMessages : [swe.invalid('table'), swe.notFound('pet')]
  },
  'action': function (req,res) {
    
    var table = parseInt(req.query.table);
    var salary = parseInt(req.query.salary);
    var column = parseInt(req.query.column);
    var dt = data.getTaxtable(table, salary, column);

    if(dt) res.send(JSON.stringify(dt));
    else throw swe.notFound('table', res);
  }
};

exports.findByMunicipal = {
  'spec': {
    description : "Operations about tax rate",  
    path : "/taxrate",
    method: "GET",
    summary : "Find by name of the municipal",
    notes : "Returns data about tax rate",
    type : "Taxrate",
    nickname : "getByMunicipal",
    produces : ["application/json"],
    responseMessages : [swe.invalid('municipal'), swe.notFound('pet')]
  },
  'action': function (req,res) {
    res.send(JSON.stringify(data.getTaxtable(req.query.municipal)));
  }
};