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