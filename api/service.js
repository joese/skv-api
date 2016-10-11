var fs = require("fs");
var taxtableData;
var taxrateData;

exports.readTaxtable = function readTaxtable(func){
    if(taxtableData){
        return func();
    } else{
        fs.readFile(__dirname + "/data/" + "taxes.json", 'utf8', function(err, data) {
            if(err){
                console.log("Error reading file");
            } else{
                taxtableData = JSON.parse(data);
                return func();
            }    
        });
    }
}

/**
 *
 * Returns tax table entries
 *
 */
exports.getTaxtable = function getTaxtable(table, salary, column){
    return exports.readTaxtable(function(){
        var rData;
        if(table){
            for (var key in taxtableData) {
                var obj = taxtableData[key];
                if(obj && obj.table == table){
                    if (salary){
                        if(obj.min <= salary && (obj.max >= salary || obj.max == 0)) {
                            if(column){
                                if(salary > 80001){
                                    rData.push(Math.round(salary * (obj['column'] + column / 100)));
                                } else{
                                    rData.push(obj['column' + column]);
                                }
                                break;
                            }
                            rData = obj;
                            break;
                        }
                    } else {
                        rData.push(obj);
                    }
                }
            }
            
        } else{
            return taxtableData;
        }
        return rData;
    });
}

exports.readTaxrate = function readTaxrate(func){
    if(taxrateData){
        return func();
    } else{
        fs.readFile(__dirname + "/data/" + "municipalTaxes.json", 'utf8', function(err, data) {
            if(err){
                console.log("Error reading file");
            } else{
                taxtableData = JSON.parse(data);
                return func();
            }    
        });
    }
}

exports.getTaxrate = function(municipal){
    return exports.readTaxrate(function(){
        var rdata = [];
        if(municipal){
            for (var key in taxrateData) {
                var obj = taxrateData[key];
                if (obj.municipal.match(new RegExp("^" + municipal, 'i'))) {
                    rdata.push(obj);
                }
            }
        } else {
            rdata = taxrateData;
        }
        return rdata;
    });
};
