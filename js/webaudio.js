function webAudio(url) {
  this.url = url;  

  this.play = document.getElementById("play"); //Play button
  this.meter = document.querySelectorAll('.meter'); //Get all audio meters
  this.initialized = false;

  this.bind();
}

webAudio.prototype = {
  //Setups the sound of the url passed as parameter of the class
  setup: function() {
    var _this = this;
        
    this.channels = this.meter.length; //Set number of channels according the number of audio meters

    this.ctx = new AudioContext();
    this.audio = new Audio(this.url);
    this.processor = this.ctx.createScriptProcessor(2048, this.channels, this.channels); // 2048 sample buffer, 1 channel in, 1 channel out  

    this.source = this.ctx.createMediaElementSource(this.audio);
    this.source.connect(this.processor);
    this.source.connect(this.ctx.destination);
    this.processor.connect(this.ctx.destination);

    // loop through PCM data and calculate average
    // volume for a given 2048 sample buffer
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

  //Calculates loudness and sets meter width according to it
  calcVolume: function(evt) {
    var _this = this;        

    for(var x = 0; x < this.channels; x++) {
      input = evt.inputBuffer.getChannelData(x),
      len = input.length,
      total = i = 0,
      rms = 0;

      while ( i < len ) total += Math.abs( input[i++] );
      rms = Math.sqrt( total / len );
      
      _this.meter[x].style.width = ( rms * 100 ) + '%';                  
    }
  }
}
