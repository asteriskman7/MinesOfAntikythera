'use strict';

/* globals Automaton, initAutomatonState, levels */

var main = {
  lastTick: undefined,
  state: undefined,
  eLevelDisplayDiv: undefined,
  ePlayerDiv: undefined,
  automatons: [],
  maxAutomatons: 8,
  init: function() {
    var i;
    var eAutomatonDiv;
    var automatonPrices = [10, 100, 200, 300, 400, 500, 600, 700];
    console.log('init');
    
    main.eLevelDisplayDiv = document.getElementById('div_level_display');
    main.ePlayerDiv = document.getElementById('div_player');
    
    document.getElementById('button_level_0').onclick = function() {main.changeLevel(0);};
    document.getElementById('button_modal_close').onclick = function() {main.hideModal();};
    
    main.loadState();    
    
    for (i = 0; i < main.maxAutomatons; i++) {
      eAutomatonDiv = document.getElementById('div_automaton_' + i);
      main.automatons[i] = new Automaton(main.state.automatons[i], eAutomatonDiv, automatonPrices[i]);      
      eAutomatonDiv.onclick = (function(x) {return function() {main.selectAutomaton(x);}; })(i);
    }
    
    main.unfold(main.state.unfoldLevel);

    
    if (main.state.firstPlay) {
      main.showIntro();
      main.state.firstPlay = false;
    }
    
    main.changeLevel(main.state.curLevel);        
    
    setInterval(main.saveState, 10000);
    
    requestAnimationFrame(main.tick);
  },
  loadDefaultState: function() {
    var i;
    main.state = {
      firstPlay: true,
      currency: [0],
      code: [],
      curLevel: 0,
      levelStates: [],
      unfoldLevel: 0,
      automatons: [],
    };
    for (i = 0; i < main.maxAutomatons; i++) {
      main.state.automatons[i] = initAutomatonState();
    }
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
    main.unfold(main.state.unfoldLevel);
    main.showIntro();
    main.state.firstPlay = false;
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
    main.automatons.forEach(function(v) {
      v.update(deltaTime);
    });
    
    levels.forEach(function(v) {
      v.update(deltaTime);
    });
  },
  updateDisplay: function(deltaTime) {
    main.ePlayerDiv.innerHTML = 'Currency: ' + main.state.currency[0];
    levels[main.state.curLevel].draw(main.eLevelDisplayDiv);
    main.automatons.forEach(function(v) {
      v.draw();
    });
    
  },
  changeLevel: function(newLevel) {
    main.eLevelDisplayDiv.innerHTML = '';
    levels[newLevel].start(main.eLevelDisplayDiv);
    main.state.curLevel = newLevel;
    document.getElementById('div_level_number').innerHTML = 'Level ' + newLevel;
  },
  addCurrency: function(type, quantity) {
    main.state.currency[type] += quantity;
    if (main.state.currency[0] >= 10 && main.state.unfoldLevel < 1) {
      main.state.unfoldLevel = 1;
      main.unfold(main.state.unfoldLevel);
      main.showModal('Wow, mining is pretty tiring work. Good thing we (the Antikytherans) have automatons to help us. Try purchasing an automaton by double clicking.');
      levels[0].active = true;
    }
  },
  showModal: function(html) {
    var eModal = document.getElementById('div_modal');
    var eContent = document.getElementById('div_modal_content');
    var eBody = document.getElementsByTagName("body")[0];
        
    eBody.style.pointerEvents = 'none';
    eModal.style.opacity = '1';
    eContent.innerHTML = html;
  },
  hideModal: function() {
    var eModal = document.getElementById('div_modal');
    var eBody = document.getElementsByTagName("body")[0];
        
    eBody.style.pointerEvents = 'auto';
    eModal.style.opacity = '0';    
  },
  showIntro: function() {
    main.showModal('Welcome to The Mines of Antikythera. Try mining a little and see what happens.');
  },
  unfold: function(level) {
  
    ['div_code', 'div_level_select', 'div_automaton_container'].forEach(function(v) {
      document.getElementById(v).style.display = 'none';
    });
  
    // disable jshint requirement for breaks in switch since we intend for it to fall through
    /* jshint -W086 */
  
    switch (level) {
      case 3: 
        document.getElementById('div_code').style.display = 'block';
      case 2:
        document.getElementById('div_level_select').style.display = 'block';          
      case 1:
        document.getElementById('div_automaton_container').style.display = 'block';
        break;
    }    
    
    /* jshint +W086 */
  },
  selectAutomaton: function(automatonIndex) {
    console.log('sa ' + automatonIndex); 
  },
};

main.init();
