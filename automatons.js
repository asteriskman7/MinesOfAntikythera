'use strict';

/* globals main, levels */

function Automaton(state, div, price) {
  this.state = state;
  this.div = div;
  this.price = price;
}

Automaton.prototype.purchase = function() {
  this.state.purchased = true;
};
Automaton.prototype.select = function() {
  var level = levels[main.state.curLevel];
  var startPos = level.startPos;
  this.state = initAutomatonState();
  this.state.purchased = true;
  if (startPos !== undefined) {
    this.state.level = main.state.curLevel;
    this.state.pos = startPos;
  }
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
    purchased: false,
    level: -1,
    pos: undefined
  };
}

