var fetch = require('node-fetch');

var OnFleet = function(apiKey){
  var base_url = 'https://onfleet.com/api/v2';
  var base64_key = new Buffer(apiKey).toString('base64');
  var headers = {Authorization: `Basic ${base64_key}`}

  this.get = function(endpoint){
    var opts = {headers: headers};
    return fetch(`${base_url}${endpoint}`, opts);
  }

  this.post = function(endpoint, body){
    var opts = {method: 'POST', headers: headers, body: body};
    return fetch(`${base_url}${endpoint}`, opts);
  }

  this.authTest = function(){
    return this.get('/auth/test');
  }

  this.addTask = function(params){
    var data = {
      "destination": {
        "address": {
          "unparsed": params.address
        },
        "notes" : "none"
      },
      "recipients": [
        {
          "name": params.name,
          "phone": params.phone,
        }
      ],
      "completeBefore": params.completeBefore,
      "completeAfter": params.completeAfter,
      "notes": params.notes,
      "pickupTask": true
    }
    return this.post('/tasks', JSON.stringify(data));
  }
}

module.exports = OnFleet;