
let blacklist;

//Logout func
const logoutBtn = document.getElementById('logoutTrigger');
if(logoutBtn){
  logoutBtn.addEventListener('click', function() {
    chrome.runtime.sendMessage({type: "logout"});
  });
}

//Activity page
const activityBtn = document.getElementById('activity');
if(activityBtn){
  activityBtn.addEventListener('click', function() {
        window.location.href = "activity.html";
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "redirect") {
      window.location.href = request.url;
    }
});

chrome.runtime.sendMessage({type: "getUsername"})
.then(response => {
  document.getElementById('userLogged').innerHTML = response.username;
  document.getElementById('browserType').innerHTML = getBrowser(navigator.userAgent);
  document.getElementById('os').innerHTML = getOS(navigator.userAgent);
})
.catch(error => {
    console.error(error);
});

function getOS(userAgent) {
  var browser = bowser.getParser(userAgent).parse();
  return browser.getOS()['name']
}
function getBrowser(userAgent){
  var browser = bowser.getParser(userAgent).parse();
  return browser.getBrowserName() + "-" + browser.getBrowserVersion()
}
chrome.runtime.sendMessage({type: "getBlacklist"})
.then(response => {
  blacklist = response.blacklist;
  console.log(blacklist);
}).catch(error => {
    console.error(error);
});

// chrome.runtime.sendMessage({type: "sendDevice"}).then(response => {
//   console.log(response);
// }).catch(error => {
//   console.log(error);
// });


// chrome.tabCapture.capture({audio: true, video: true}, function(stream) {
//   var chunks = [];
//   var options = { mimeType: 'video/webm; codecs=vp9' };
//   var mediaRecorder = new MediaRecorder(stream, options);

//   mediaRecorder.ondataavailable = function(e) {
//       chunks.push(e.data);
//   }

//   mediaRecorder.start();

//   setTimeout(function(){
//       mediaRecorder.stop();
//       stream.getTracks().forEach(track => track.stop());
//   },5000);

//   mediaRecorder.onstop = function(e) {
//       var blob = new Blob(chunks, { type: "video/webm" });
//       var url = URL.createObjectURL(blob);
//       var a = document.createElement("a");
//       document.body.appendChild(a);
//       a.style = "display: none";
//       a.href = url;
//       a.download = 'tabcapture.webm';
//       a.click();
//       window.URL.revokeObjectURL(url);
//   }
// });

// document.getElementById('capture-btn').addEventListener('click', function() {
//   chrome.tabCapture.capture({audio: true, video: true}, function(stream) {
//     var video = document.getElementById('captured-video');
//     video.srcObject = stream;
//     video.play();
//   });
// });

var browser = bowser.getParser(navigator.userAgent).parse();
for (let prop in browser) {
  console.log(prop + ": " + browser[prop]);
}

console.log(browser.getBrowserName());

chrome.runtime.sendMessage({type: "getDeviceName"})
.then(response => {
  document.getElementById('device_name').innerHTML = response.device;
})
.catch(error => {
    console.error(error);
});

