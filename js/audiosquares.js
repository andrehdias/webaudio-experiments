function audioSquares(url) {
  this.url = url;  

  this.play = document.getElementById("play"); //Play button

  this.squaresWrapper = document.querySelector('.audioSquares'); //Squares wrapper
  this.squaresNumber = 210; //Number of squares
  this.append();

  this.initialized = false;
  this.animationComplete = true;
  this.bind();
}

audioSquares.prototype = {
  //Setups the sound of the url passed as parameter of the class
  setup: function() {
    var _this = this;          

    this.ctx = new AudioContext();
    this.audio = new Audio(this.url);
    this.processor = this.ctx.createScriptProcessor(2048, 1, 1); // 2048 sample buffer, 1 channel in, 1 channel out  

    this.source = this.ctx.createMediaElementSource(this.audio);
    this.source.connect(this.processor);
    this.source.connect(this.ctx.destination);
    this.processor.connect(this.ctx.destination);
    
    this.processor.onaudioprocess = function(evt){
      _this.processAnime(evt);
    }
  },

  //Bind button event
  bind: function() {
    var _this = this;    

    this.play.addEventListener('click', function(){
      if (!_this.initialized) {        
        _this.setup();
        _this.initialized = true;
      }

      if(!_this.audio.paused) {
        _this.audio.pause();
      } else {        
        _this.audio.play();      
      }      
    });    
  },

  append: function() {    
    var colors = ['#FF324A', '#31FFA6', '#206EFF', '#FFFF99'];    
    var sectionEl = document.createElement('section');

    for (var i = 0; i < this.squaresNumber; i++) {
      var el = document.createElement('div');
      el.style.background = colors[anime.random(0, 3)];
      sectionEl.appendChild(el);
    }

    this.squaresWrapper.appendChild(sectionEl);    
  },

  processAnime: function(evt) {
    if(this.animationComplete) {
      var _this = this;        
          input = evt.inputBuffer.getChannelData(0),
          len = input.length,
          total = i = 0,    
          rms = 0;

      while (i < len) total += Math.abs(input[i++]);
      rms = Math.sqrt(total/len) * 10;

      this.animationComplete = false;

      anime({
        targets: '.audioSquares div',
        translateX: function() { return (rms / 5) * anime.random(-1, 1) + 'rem'; },
        translateY: function() { return (rms / 5) * anime.random(-1, 1) + 'rem'; },
        scale: function() { return rms / 4; },
        rotate: function() { return (rms * 3) * anime.random(-1, 1); },
        duration: 200,
        direction: 'alternate',
        complete: function() {
          _this.animationComplete = true;
        }
      });      
    }
  }
}
