'use strict';

var main = {
  lastTick: undefined,
  state: undefined,
  eLevelDisplayDiv: undefined,
  init: function() {
    console.log('init');
    
    main.eLevelDisplayDiv = document.getElementById('div_level_display');
    
    document.getElementById('button_level_0').onclick = function() {main.changeLevel(0);};
    
    main.loadState();
    
    main.changeLevel(main.state.curLevel);        
    
    setInterval(main.saveState, 10000);
    
    requestAnimationFrame(main.tick);
  },
  loadDefaultState: function() {
    main.state = {
      currency: [],
      code: [],
      curLevel: 0,
      levelStates: []
    };
  },
  loadState: function() {
    var key;
    main.loadDefaultState();
    var loadedState = JSON.parse(localStorage.getItem('state'));
    for (key in loadedState) {
      main.state[key] = loadedState[key];
    }
    var i = 0;
    main.state.levelStates.forEach(function(v) {
      levels[i].load(v);
      i++;
    });    
  },
  saveState: function() {
    var i = 0;
    levels.forEach(function(v) {
      main.state.levelStates[i] = v.save();
      i++;
    });
    var newState = JSON.stringify(main.state);
    localStorage.setItem('state', newState);
  },
  resetState: function() {
    main.loadDefaultState();
    main.saveState();
  },
  tick: function(timestamp) {
    var deltaTime;
    if (main.lastTick !== undefined) {
      //deltaTime is time since last tick in milliSeconds
      deltaTime = timestamp - main.lastTick;
      main.updateGame(deltaTime);
      main.updateDisplay(deltaTime);
    }    
    
    main.lastTick = timestamp;
    requestAnimationFrame(main.tick);
  },
  updateGame: function(deltaTime) {
    var levelNum;
    for (levelNum = 0; levelNum < levels.length; ++levelNum) {
    }    
    levels.forEach(function(v) {
      v.update(deltaTime);
    });
  },
  updateDisplay: function(deltaTime) {
    levels[main.state.curLevel].draw(main.eLevelDisplayDiv);
  },
  changeLevel: function(newLevel) {
    main.eLevelDisplayDiv.innerHTML = '';
    levels[newLevel].start(main.eLevelDisplayDiv);
    main.state.curLevel = newLevel;
    document.getElementById('div_level_number').innerHTML = 'Level ' + newLevel;
  }
};

main.init();
