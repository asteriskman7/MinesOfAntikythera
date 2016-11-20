'use strict';

/* globals Automaton, initAutomatonState, levels */

var main = {
  lastTick: undefined,
  state: undefined,
  eLevelDisplayDiv: undefined,
  ePlayerDiv: undefined,
  automatons: [],
  maxAutomatons: 8,
  currencyRatio: 1000,
  currencyCount: 3,
  init: function() {
    var i;
    var eAutomatonDiv;
    var automatonPrices = [[10], [100], [200], [300], [400], [500], [600], [700]];
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
      currency: [],
      code: [],
      curLevel: 0,
      levelStates: [],
      unfoldLevel: 0,
      automatons: [],
    };
    for (i = 0; i < main.currencyCount; i++) {
      main.state.currency.push(0);
    }
    for (i = 0; i < main.maxAutomatons; i++) {
      main.state.automatons[i] = initAutomatonState();
      if (main.automatons[i] !== undefined) {
        main.automatons[i].state = main.state.automatons[i];
      }
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
    var currencyHTML = '';
    var i;
    var currencyStart = false;
    for (i = main.currencyCount - 1; i >= 0; i--) {
      currencyStart =main.state.currency[i] > 0;
      if (currencyStart) {
        currencyHTML += main.state.currency[i] + 'x' + i + ' ';        
      }
    }
    if (!currencyStart) {
      currencyHTML += '0x0';
    }
    
    currencyHTML = 'Currency: ' + currencyHTML;
    main.ePlayerDiv.innerHTML = currencyHTML;
    
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
    main.state.currency = main.normalizeCurrency(main.state.currency);
    if (main.state.currency[0] >= 10 && main.state.unfoldLevel < 1) {
      main.state.unfoldLevel = 1;
      main.unfold(main.state.unfoldLevel);
      main.showModal('Wow, mining is pretty tiring work. Good thing we (the Antikytherans) have automatons to help us. Try purchasing an automaton by clicking it.');
      levels[0].active = true;
    }    
  },
  checkCurrency: function(checkValues) {
    //return true if there is at least currency equal to checkValues currency available
    var i;
    var newCurrency = [];
    for (i = 0; i < main.currencyCount; i++) {
      if (checkValues[i] !== undefined) {
        newCurrency.push(main.state.currency[i] - checkValues[i]);
      } else {
        newCurrency.push(main.state.currency[i]);
      }
    }
    var normVal = main.normalizeCurrency(newCurrency);
    return normVal[main.currencyCount - 1] >= 0;
  },
  spendCurrency: function(spendValues) {
    spendValues.forEach(function(v,i) {
      main.state.currency[i] -= v;
    });
    main.state.currency = main.normalizeCurrency(main.state.currency);
  },
  normalizeCurrency: function(currency) {
    var normCurrency = currency.slice(); //copy currency
    var i;
    //don't normalize the highest currency because you can't carry from it or borrow to it
    for (i = 0; i < normCurrency.length - 1; i++) {

      while (normCurrency[i] > main.currencyRatio) {
        normCurrency[i+1] += 1;
        normCurrency[i] -= main.currencyRatio;
      }

      while (normCurrency[i] < 0) {  
        normCurrency[i+1] -= 1;
        normCurrency[i] += main.currencyRatio;
      }

    }
    return normCurrency;
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
    var automaton = main.automatons[automatonIndex];
    console.log('sa ' + automatonIndex);
    if (automaton.state.purchased) {
    } else {
      if (main.checkCurrency(automaton.price)) {
        main.spendCurrency(automaton.price);
        automaton.state.purchased = true;
      }
    }
  },
};

main.init();
