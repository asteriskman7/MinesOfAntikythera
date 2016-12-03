'use strict';

/* globals main, blockTypes */

function Level(gridTypes) {
  this.state = {};
  this.active = false;
  this.gridTypes = gridTypes;
  this.displayDiv = undefined;
  this.startPos = undefined;
}

Level.prototype.update = function(deltaTime) {};
Level.prototype.draw = function(displayDiv) {};
Level.prototype.save = function() {return {};};
Level.prototype.load = function(state) {this.state = state;};
Level.prototype.start = function(displayDiv) {
  this.displayDiv = displayDiv;
  var width = 8;
  var height = 8;
  for (var y = 0; y < height; y++) {
    for(var x = 0; x < width; x++) {
      var gridType = this.gridTypes[y * width + x];
      if (gridType === 'start') {
        this.startPos = {x: x, y: y};
      }
    }
  }
};


var levels = [];

var level0 = new Level([]);
level0.start = function(displayDiv) {
  displayDiv.innerHTML = '<button type="button" id="button_l0_press">Mine</button>';
  document.getElementById('button_l0_press').onclick = function() {
    main.addCurrency(0,1);
  };
};

levels.push(level0);
