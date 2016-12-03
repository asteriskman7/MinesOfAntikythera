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

function BlockStart() {
  Block.call(this);
}
BlockStart.prototype = Object.create(Block.prototype);
BlockStart.prototype.constructor = BlockStart;
blockTypes.start = BlockStart;
