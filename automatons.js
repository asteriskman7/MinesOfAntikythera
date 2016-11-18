'use strict';

function Automaton(state, div, price) {
  this.state = state;
  this.div = div;
  this.price = price;
  this.purchase = function() {
    this.state.purchased = true;
  };
  this.update = function(deltaTime) {};
  this.draw = function() {
    if (this.state.purchased) {
      this.div.innerHTML = 'a';
    } else {
      this.div.innerHTML = '$' + this.price;
    }
  };
}

function initAutomatonState() {
  return {
    purchased: false
  };
}

