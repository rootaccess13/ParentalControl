
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
  document.getElementById('appVersion').innerHTML = navigator.appVersion;
  document.getElementById('browserType').innerHTML = getBrowserName(navigator.userAgent);
})
.catch(error => {
    console.error(error);
});

function getBrowserName(userAgent) {
  // The order matters here, and this may report false positives for unlisted browsers.
  console.log(userAgent);
  if (userAgent.includes("Firefox")) {
    // "Mozilla/5.0 (X11; Linux i686; rv:104.0) Gecko/20100101 Firefox/104.0"
    return "Mozilla Firefox";
  } else if (userAgent.includes("SamsungBrowser")) {
    // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36"
    return "Samsung Internet";
  } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_5_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36 OPR/90.0.4480.54"
    return "Opera";
  } else if (userAgent.includes("Trident")) {
    // "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)"
    return "Microsoft Internet Explorer";
  } else if (userAgent.includes("Edge")) {
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
    return "Microsoft Edge (Legacy)";
  } else if (userAgent.includes("Microsoft Edge (Chromium)")) {
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36 Edg/104.0.1293.70"
    return "Edge";
  } else if (userAgent.includes("Chrome")) {
    // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
    return "Google Chrome/Chromium";
  } else if (userAgent.includes("Safari")) {
    // "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1"
    return "Apple Safari";
  } else {
    return "unknown";
  }
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
