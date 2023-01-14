// In popup.js

let redirect = false;
window.onload = function() {
  chrome.runtime.sendMessage({type: "checkAuth"}, function(response) {
    if(response.authenticated){
       window.location.href = "dashboard.html";
    }
    }
  );
};

//Get Started
const getStartedBtn = document.getElementById('getStarted');
if(getStartedBtn){
  getStartedBtn.addEventListener('click', function() {
    window.location.href = "login.html";
  });
}


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
    chrome.runtime.sendMessage({type: "checkAuth"}, function(response) {
      if(response.authenticated){
         window.location.href = "activity.html";
      }
      }
    );
  });
}
//Redirect request.TYPE
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "redirect") {
    window.location.href = request.url;
  }
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
      console.log("Request submitted: " + details.url);
  },
  {urls: ["<all_urls>"]},
  ["requestHeaders"]
);

