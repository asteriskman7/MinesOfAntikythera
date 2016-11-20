'use strict';

/* globals main, blocks */

function Level(blocks) {
  this.state = {};
  this.active = false;
  this.blocks = blocks;
}

Level.prototype.update = function(deltaTime) {};
Level.prototype.draw = function(displayDiv) {};
Level.prototype.save = function() {return {};};
Level.prototype.load = function(state) {this.state = state;};
Level.prototype.start = function(displayDiv) {};


var levels = [];

var level0 = new Level([]);
level0.start = function(displayDiv) {
  displayDiv.innerHTML = '<button type="button" id="button_l0_press">Mine</button>';
  document.getElementById('button_l0_press').onclick = function() {
    main.addCurrency(0,1);
  };
};

levels.push(level0);
