require('dotenv').config();
var gcloud = require('gcloud');
var datastore = gcloud.datastore();
var bluebird = require('bluebird');
var datastore_save = bluebird.promisify(datastore.save,  {context: datastore});

var GetUpdatesForm = function(props){
  /* Set default props to empty object */
  var props = typeof props !== 'undefined' ? props : {}

  /* Attributes */
  this.email = props.email;

  /* Setup */
  this.save = function(){
    return datastore_save({
      key: datastore.key('GetUpdatesForm'),
      data: {
        createdAt: new Date().toJSON(),
        email: this.email
      }
    }).catch(function(err){
        this.errors = typeof this.errors !== 'undefined' ? this.errors : [];
        this.errors.push(`Error saving data in datastore: ${err.message}`);
        throw "Error fetching data";
    }.bind(this))
  }
}

GetUpdatesForm.all = function(){
  var query = datastore.createQuery('GetUpdatesForm');
  datastore.runQuery(query)
  .on('data', onData)
  .on('error', onError)
  .on('info', onInfo)
}

module.exports = GetUpdatesForm;