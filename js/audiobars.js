function audioBars(url) {
  this.url = url;  

  this.play = document.getElementById("play"); //Play button

  this.meterWrapper = document.querySelector('.meter__wrapper'); //Meter wrapper
  this.meterNumber = 60; //Number of bars
  this.appendMeters();

  this.initialized = false;
  this.bind();
}

audioBars.prototype = {
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
  appendMeters: function() {
    var wrapperSize = this.meterWrapper.offsetWidth;
        meterWidth = wrapperSize / this.meterNumber;

    for(var y = 0; y < this.meterNumber; y++) {
      this.meterWrapper.innerHTML += "<div class='meter'>";
    }

    this.meter = document.querySelectorAll('.meter'); //Get all audio meters

    for(var x = 0; x < this.meter.length; x++) {            
      this.meter[x].style.width = meterWidth+"px";
    }
  },

  //Calculates loudness and sets the meters height according to it
  calcVolume: function(evt) {
    var _this = this;        
        input = evt.inputBuffer.getChannelData(0);        

    for(var x = 0; x < _this.meter.length; x++) {            
      _this.meter[x].style.height = ( Math.abs(input[x]) * 100 ) + '%';                                                    
    }      
  }
}
