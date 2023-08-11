(function (ActionAppCore, $) {

    var SiteMod = ActionAppCore.module("site");

    //~thisPageSpecs//~
var thisPageSpecs = {
	"pageName": "AudioMotionHome",
	"pageTitle": "Audio Motion",
	"navOptions": {
		"topLink": true,
		"sideLink": true
	}
}
//~thisPageSpecs~//~

    var pageBaseURL = 'app/pages/' + thisPageSpecs.pageName + '/';

    //~layoutOptions//~
thisPageSpecs.layoutOptions = {
        baseURL: pageBaseURL,
        north: false,
        east: { html: 'east' },
        west: false,
        center: { name: 'am', control: "AudioMotionGlobal", source:"__app" },
        south: false
    }
//~layoutOptions~//~

    //~layoutConfig//~
thisPageSpecs.layoutConfig = {
        west__size: "500"
        , east__size: "250"
    }
//~layoutConfig~//~
    //~required//~
thisPageSpecs.required = {

    }
//~required~//~

    var ThisPage = new SiteMod.SitePage(thisPageSpecs);

    var actions = ThisPage.pageActions;

    ThisPage._onPreInit = function (theApp) {
        //~_onPreInit//~

//~_onPreInit~//~
    }

    ThisPage._onInit = function () {
        //~_onInit//~

//~_onInit~//~
    }


    ThisPage._onFirstActivate = function (theApp) {
        //~_onFirstActivate//~

//~_onFirstActivate~//~
        ThisPage.initOnFirstLoad().then(
            function () {
                //~_onFirstLoad//~
window.ThisPageNow = ThisPage;

ThisPage.parts.am.subscribe('NewMediaSources', function(){

	var tmpDevices = ThisPage.parts.am.mediaInfo.devices;
  var tmpHTML = ['<div class="ui vertical menu fluid">'];
    const tmpAudioDevices = tmpDevices.filter(device => device.kind == 'audioinput'); //or videoinput 
      tmpAudioDevices.map(theDevice => {
        var tmpLabel = theDevice.label || "(unknown)";
        var tmpDeviceId = theDevice.deviceId;
        tmpHTML.push(`<div class="item active" pageaction="selectSource" deviceId="${theDevice.deviceId}" label="${tmpLabel}">
          	<div class="content">
          	  <div class="header" style="line-height: 25px;">
          		<i class="icon video blue"></i> ${tmpLabel}
          	  </div>
          	</div>
        </div>`);
    });
    tmpHTML.push('</div>');
    ThisPage.loadSpot('audio-sources',tmpHTML.join('\n'));
})

ThisPage.parts.am.refreshMediaSources();
//~_onFirstLoad~//~
                ThisPage._onActivate();
            }
        );
    }


    ThisPage._onActivate = function () {
        //~_onActivate//~

//~_onActivate~//~
    }

    ThisPage._onResizeLayout = function (thePane, theElement, theState, theOptions, theName) {
        //~_onResizeLayout//~

//~_onResizeLayout~//~
    }

    //------- --------  --------  --------  --------  --------  --------  -------- 
    //~YourPageCode//~
actions.micOn = micOn;
function micOn(){
  this.parts.am.micOn();
}

actions.micOff = micOff;
function micOff(){
  this.parts.am.micOff();
}



actions.selectSource = selectSource;
function selectSource(theParams,theParams){
  this.parts.am.selectSource(theParams,theParams);
}


actions.selectSource = selectSource;
  function selectSource(theParams,theParams) {
      var tmpParams = ThisApp.getActionParams(theParams,theParams,['deviceId','label'])
      ThisPage.parts.am.setActiveDeviceId(tmpParams.deviceId)
  }
//~YourPageCode~//~

})(ActionAppCore, $);
