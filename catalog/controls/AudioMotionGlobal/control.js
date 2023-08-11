(function (ActionAppCore, $) {

  var ControlSpecs = {
    options: {
      padding: false
    },
    content: [{
      ctl: "spot",
      name: "AudioMotionAnalyzerBody",
      text: '<div id="containermic"></div>'
    }]
  }

  var ControlCode = {};

  var currStream = false,
  readyFlag = false,
  audioMotion = false;



  
  ControlCode.refreshMediaSources = refreshMediaSources;
  function refreshMediaSources() {
    var self = this;
    navigator.mediaDevices.enumerateDevices().then(function(theDevices){
        self.mediaInfo.devices = theDevices;
        self.publish('NewMediaSources')
    });
  }


  ControlCode.setActiveDeviceId = setActiveDeviceId
  function setActiveDeviceId(theDeviceId) {
      this.activeDeviceId = theDeviceId;
  }

  ControlCode.isReady = isReady;
  function isReady() {
    return readyFlag;
  }

  ControlCode.initSetup = initSetup;
  function initSetup() {

    // instantiate analyzer

    audioMotion = audioMotion || new AudioMotionAnalyzer(
      document.getElementById('containermic'),
      {
        gradient: 'rainbow',
        height: window.innerHeight - 40,
        showScaleY: true,
        useCanvas: true,
        onCanvasDraw: function(instance) {
          ThisApp.common.eqDataMic = {
            bands: instance.getBars(),
            peak: instance.getEnergy('peak'),
            bass: instance.getEnergy('bass'),
            lowMid: instance.getEnergy('lowMid'),
            mid: instance.getEnergy('mid'),
            highMid: instance.getEnergy('highMid'),
            treble: instance.getEnergy('treble')
          }
        }

      }
    );
    window.audioMotionInUse = audioMotion;
    var tmpFrameEl = ThisApp.util.resizeToParent(audioMotion.canvas);
    tmpFrameEl.css('overflow', 'hidden')
    audioMotion.mode = 6;
    readyFlag = true;

  }

  ControlCode.micOn = micOn;
  function micOn() {
    console.log('micOn ctl');
    if (!(readyFlag)) {
      initSetup();
    }
    var tmpConstraints = {
      audio: true,
      video: false
    };
    if (this.activeDeviceId) {
      tmpConstraints.audio = {
        deviceId: {
          exact: [this.activeDeviceId]
        }
      }
    }
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia(tmpConstraints).then(function(stream) {
        const micStream = audioMotion.audioCtx.createMediaStreamSource(stream);
        audioMotion.connectInput(micStream);
        audioMotion.volume = 0;
      })
      .catch(function(err) {
        console.error('Error accessing mic', err);
      });

    } else {
      console.error('Mic not supported');
    }
  }

  //-- ToDo: Load like three js
  async function isAnalyserThere() {
    var dfd = jQuery.Deferred();
    ThisApp.delay(25).then(function() {
      if (window.AudioMotionAnalyzer) {
        dfd.resolve(true);
      } else {
        dfd.resolve(false);
      }
    })
    return dfd.promise();
  }

  async function waitForAnalyzer() {
    var dfd = jQuery.Deferred();
    for (var i = 0; i < 100; i++) {
      if (await isAnalyserThere()) {
        dfd.resolve(true)
      }
      if (i >= 90) {
        dfd.resolve(false);
      }
    }
    return dfd.promise();
  }
  ControlCode.micOff = micOff;
  function micOff() {
    if (audioMotion) {
      audioMotion.disconnectInput(false, true);
    }
  }































  ControlCode.setup = setup;
  function setup() {
    console.log("Ran setup")
  }

  ControlCode._onInit = _onInit;
  
  function _onInit() {
    window.AMG = this;
    this.mediaInfo = {
      index: {}
    }

    //waitForAnalyzer().then(initSetup)
  }

  var ThisControl = {
    specs: ControlSpecs,
    options: {
      proto: ControlCode,
      parent: ThisApp
    }};
  return ThisControl;
})(ActionAppCore, $);