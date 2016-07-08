require('dotenv').config();
var OnFleet = require('./../apis/onfleet');
var onfleet = new OnFleet(process.env.ONFLEET_KEY);

var PickupForm = function(props){
  /* Set default props to empty object */
  var props = typeof props !== 'undefined' ? props : {}

  /* Attributes */
  this.address = props.address;
  this.name = props.name;
  this.phone = props.phone;
  this.completeBefore = props.completeBefore;
  this.notes = props.notes;

  /* Setup */
  this.save = function(){
    return onfleet.addTask({
      address: this.address,
      name: this.name,
      phone: this.phone,
      completeBefore: this.completeBefore,
      notes: this.notes
    })
    .then(function(response){
      if(response.status !== 200){
        throw response.statusText;
      }
    })
    .catch(function(err){
        this.errors = typeof this.errors !== 'undefined' ? this.errors : [];
        this.errors.push(`Error saving to Onfleet: ${err}`);
        throw "Error saving to OnFleet";
    }.bind(this))
  }
}

module.exports = PickupForm;