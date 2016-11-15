'use strict';

function Level() {
  this.update = function(deltaTime) {};
  this.draw = function(displayDiv) {};
  this.save = function() {return {};}
  this.load = function(state) {this.state = state};
  this.start = function(displayDiv) {};
  this.state = {};
}

var levels = [];

var level0 = new Level();
level0.start = function(displayDiv) {
  displayDiv.innerHTML = '<button type="button">PRESS</button>';
};

levels.push(level0);
