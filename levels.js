'use strict';

/* globals main */

function Level() {
  this.update = function(deltaTime) {};
  this.draw = function(displayDiv) {};
  this.save = function() {return {};};
  this.load = function(state) {this.state = state;};
  this.start = function(displayDiv) {};
  this.state = {};
  this.active = false;
}

var levels = [];

var level0 = new Level();
level0.start = function(displayDiv) {
  displayDiv.innerHTML = '<button type="button" id="button_l0_press">Mine</button>';
  document.getElementById('button_l0_press').onclick = function() {
    main.addCurrency(0,1);
  };
};

levels.push(level0);
