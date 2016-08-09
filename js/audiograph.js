function audiograph(url) {
  this.url = url;  

  this.play = document.getElementById("play"); //Play button

  this.meterWrapper = document.querySelector('.meter__wrapper'); //Meter wrapper
  this.meterNumber = 60; //Number of bars
  this.append();

  this.initialized = false;
  this.bind();
}

audiograph.prototype = {
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
      _this.calcVolume(evt);
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

  //Append bars to meter wrapper
  append: function() {
    var maxElements = 210;
    var colors = ['#FF324A', '#31FFA6', '#206EFF', '#FFFF99'];    
    var sectionEl = document.createElement('section');

    for (var i = 0; i < maxElements; i++) {
      var el = document.createElement('div');
      el.style.background = colors[anime.random(0, 3)];
      sectionEl.appendChild(el);
    }

    document.body.appendChild(sectionEl);
  },

  //Calculates loudness and sets the meters height according to it
  calcVolume: function(evt) {
    var _this = this;        
        input = evt.inputBuffer.getChannelData(0),
        len = input.length;        

    for(var x = 0; x < _this.meter.length; x++) {            
      _this.meter[x].style.height = ( Math.abs(input[x]) * 100 ) + '%';                                                    
    }      
  }
}

anime({
  targets: 'div',
  translateX: function() { return anime.random(-6, 6) + 'rem'; },
  translateY: function() { return anime.random(-6, 6) + 'rem'; },
  scale: function() { return anime.random(10, 20) / 10; },
  rotate: function() { return anime.random(-360, 360); },
  delay: function() { return 400 + anime.random(0, 500); },
  duration: function() { return anime.random(1000, 2000); },
  direction: 'alternate',
  loop: true
});