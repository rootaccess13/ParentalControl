
  //Authenticate Listener
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.type === "authenticate") {
        var username = request.username;
        var password = request.password;
        authenticate(username, password).then(token => {
          // Do something with the token
          console.log(token.access)
          chrome.storage.local.set({token: token}, function() {
            console.log("Token saved to storage" + token.access);
            // redirect to dashboard.html
            chrome.runtime.sendMessage({type: "redirect", url: "dashboard.html"});

          });
        }).catch(error => {
          // Handle error
          console.log(error)
        });
      }
  });
  //Register Listener
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if(request.type === "register"){
        var username = request.username;
        var password = request.password;
        var password2 = request.password;
        var first_name = request.firstname;
        var last_name = request.lastname;
        var email = request.email;
        register(username ,password , password2, first_name, last_name, email).then(response => {
          // Do something with the token
          console.log(response);
          chrome.runtime.sendMessage({type: "redirect", url: "login.html"});
        }).catch(error => {
          // Handle error
          console.log(error)
        });
      }
    }
  );
  //Authentication Function
  async function authenticate(username, password) {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      return response.json();
    } catch (error) {
      throw new Error(`Failed to authenticate user: ${error}`);
    }
  }
  //Register Function
  async function register(username,password, password2, first_name, last_name, email) {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username,password, password2, first_name, last_name, email })
      });
      return response.json();
    } catch (error) {
      throw new Error(`Failed to register user: ${error}`);
    }
  }
  //Logout
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "logout") {
      chrome.storage.local.remove('token', function () {
        console.log("Token removed from storage");
        chrome.runtime.sendMessage({ type: "redirect", url: "login.html" });
      });
    }
  }
  );
  //CheckAuth
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "checkAuth") {
      chrome.storage.local.get('token', function (result) {
        if (result.token) {
          sendResponse({ authenticated: true });
        } else {
          sendResponse({ authenticated: false });
        }
      });
    }
    return true;
  }
  );
  //Check History
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      if (request.type === "getHistory") {
          chrome.history.search({text: '', maxResults: 10}, function(results) {
              sendResponse({ history: results });
          });
          
      }
    }
  );
  //Analyze URL
  chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        const target = tab.url;
        // const apiUrl = 'http://127.0.0.1:8000/api/v1/analyze/';
        // const data = { user: '2', url: target };
        // AnalyzeURL(data,apiUrl).then(response => {
        //   var res = JSON.parse(response);
        //   try{
        //     if(res.is_secure === false){
        //       // chrome.tabs.remove(tabId);
        //       console.log("Explicit")
        //     }
        //   }catch(error){
        //     console.log(error);
        //   }
        // }).catch(error => {
        //   console.log(error);
        // });
        getBlacklist().then(response => {
          var res = JSON.parse(response);
          for (const property in res) {
            console.log(property, res[property].url);
          }
          // checkBlacklist(res,target).then(response => {
          //   var res = JSON.parse(response);
          //   console.log(res);
          // }
          // ).catch(error => {
          //   console.log(error);
          // }
          // );
        }).catch(error => {
          console.log(error);
        }
        );
      }
  });

  //Get Token from Chrome.storage
  function getToken() {
      return new Promise((resolve, reject) => {
          chrome.storage.local.get("token", (data) => {
              if (chrome.runtime.lastError) {
                  reject(chrome.runtime.lastError);
              } else {
                  resolve(data.token);
              }
          });
      });
  }
  //Resend Request
  async function resendReq(token, API_URL, data) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    return await response.text();
  }
 //Refresh Access Token
  async function renewAccessToken(refreshToken) {
    const body = JSON.stringify({refresh: refreshToken});
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + refreshToken
    });
    const response = await fetch('https://127.0.0.1:8000/api/v1/login/refresh/', {
        method: 'POST',
        headers: headers,
        body: body
    });
    const json = await response.json();
    if (json.error) {
        throw new Error(json.error);
    }
    return json.access_token;
  }
 //Get Profile Instances
  chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.type === "getUsername") {
      getToken().then(token => {
          fetch(`http://127.0.0.1:8000/api/v1/profile/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token.access
            }
          }).then(response => response.json())
            .then(data => {
              for (const property in data) {
                console.log(property, data[property].first_name);
                sendResponse({username: data[property].username});
              }
            })
            .catch(error => {
              sendResponse(error);
              if(error.status === 401){
                console.log("Unauthorized baby");
              }
            });

      })
    }
    return true;
  });

  chrome.downloads.onCreated.addListener(async function(downloadItem) {
    //check if download is complete
    if (downloadItem.state === "complete") {
      console.log(downloadItem + "Completed");
      const target = downloadItem.url;

    }
  });

  //Analyzing URL function
  async function AnalyzeURL(data,api_url){
    const response = await fetch(api_url,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    return await response.text();
  }

  async function checkBlacklist(obj, url){
    let blacklist = obj;
    
    let checkUrl = url.toString();
    let found = false;
    
    for (let key in blacklist) {
      if (blacklist[key].url && blacklist[key].url.includes(checkUrl)) {
        found = true;
        break;
      }
    }
    
    if (found) {
      console.log(`The URL ${checkUrl} is in the blacklist.`);
    } else {
      console.log(`The URL ${checkUrl} is not in the blacklist.`);
    }
    
  }
  //Get Blacklist function
  async function getBlacklist(){
    const response = await fetch('http://127.0.0.1:8000/api/v1/blacklist/',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return await response.text();
  }

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "getBlacklist") {
      getBlacklist().then(response => {
        var res = JSON.parse(response);
        sendResponse({ blacklist: res });
      }).catch(error => {
        sendResponse(error);
      });
    }
    return true;
  });

