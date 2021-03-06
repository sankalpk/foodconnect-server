require('dotenv').config();
var gcloud = require('gcloud');
var datastore = gcloud.datastore();
var bluebird = require('bluebird');
var datastore_save = bluebird.promisify(datastore.save,  {context: datastore});

var DriverForm = function(props){
  /* Set default props to empty object */
  var props = typeof props !== 'undefined' ? props : {}

  /* Attributes */
  this.name = props.name;
  this.email = props.email;
  this.phone = props.phone;

  /* Setup */
  this.save = function(){
    return datastore_save({
      key: datastore.key('DriverForm'),
      data: {
        createdAt: new Date().toJSON(),
        name: this.name,
        email: this.email,
        phone: this.phone
      }
    }).catch(function(err){
        this.errors = typeof this.errors !== 'undefined' ? this.errors : [];
        this.errors.push(`Error saving data in datastore: ${err.message}`);
        throw "Error fetching data";
    }.bind(this))
  }
}
DriverForm.all = function(onData, onError, onInfo){
  var query = datastore.createQuery('DriverForm');
  datastore.runQuery(query)
  .on('data', onData)
  .on('error', onError)
  .on('info', onInfo)
}

module.exports = DriverForm;