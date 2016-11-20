'use strict';

function Block() {
}

Block.prototype.draw = function() {};

var blockTypes = {};


function BlockEmpty() {
  Block.call(this);
}
BlockEmpty.prototype = Object.create(Block.prototype);
BlockEmpty.prototype.constructor = BlockEmpty;
blockTypes.empty = BlockEmpty;

function BlockWall() {
  Block.call(this);
}
BlockWall.prototype = Object.create(Block.prototype);
BlockWall.prototype.constructor = BlockWall;
blockTypes.wall = BlockWall;


