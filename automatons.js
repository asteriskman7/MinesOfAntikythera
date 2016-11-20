'use strict';

function Automaton(state, div, price) {
  this.state = state;
  this.div = div;
  this.price = price;
}

Automaton.prototype.purchase = function() {
  this.state.purchased = true;
};
Automaton.prototype.update = function(deltaTime) {};
Automaton.prototype.draw = function() {
  if (this.state.purchased) {
    this.div.innerHTML = 'a';
  } else {
    this.div.innerHTML = '$' + this.price[0];
  }
};

function initAutomatonState() {
  return {
    purchased: false
  };
}

