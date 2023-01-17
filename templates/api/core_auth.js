document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById("loginForm");
    var regForm = document.getElementById("registerForm");
    if(form){
      form.addEventListener("submit", function(event) {
        event.preventDefault();
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        chrome.runtime.sendMessage({type: "authenticate", username: username, password: password});
    
      });
    }
    if(regForm){
      regForm.addEventListener("submit", function(event) {
        event.preventDefault();
        var username = document.getElementById("username").value;
        var password = document.getElementById("pass1").value;
        var password2 = document.getElementById("pass2").value;
        var firstname = document.getElementById("firstname").value;
        var lastname = document.getElementById("lastname").value;
        var email = document.getElementById("email").value;
        chrome.runtime.sendMessage({type: "register", username: username, password: password, password2: password2 , firstname: firstname, lastname: lastname, email: email});
    
      });
    }
});

//Redirect request.TYPE
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "redirect") {
      window.location.href = request.url;
    }
  });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if(request.type === "invalid_auth"){
    document.getElementById('toast-danger').classList.remove('hidden');
    document.getElementById('toast-danger').classList.add('flex');
    document.getElementById('messages').innerHTML = request.message;
  }
});



function getBrowserName(userAgent) {
  // The order matters here, and this may report false positives for unlisted browsers.

  if (userAgent.includes("Firefox")) {
    // "Mozilla/5.0 (X11; Linux i686; rv:104.0) Gecko/20100101 Firefox/104.0"
    return "Firefox";
  } else if (userAgent.includes("SamsungBrowser")) {
    // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36"
    return "Samsung";
  } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_5_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36 OPR/90.0.4480.54"
    return "Opera";
  } else if (userAgent.includes("Trident")) {
    // "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)"
    return "Explorer";
  } else if (userAgent.includes("Edge")) {
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
    return "Edge-Legacy";
  } else if (userAgent.includes("Edg")) {
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36 Edg/104.0.1293.70"
    return "Edge";
  } else if (userAgent.includes("Chrome")) {
    // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
    return "Chrome";
  } else if (userAgent.includes("Safari")) {
    // "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1"
    return "Safari";
  } else {
    return "unknown";
  }
}