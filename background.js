
  //Authenticate Listener
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.type === "authenticate") {
        var username = request.username;
        var password = request.password;
        var device_name = request.name_device;
        authenticate(username, password).then(token => {
          // Do something with the token
          console.log(token.access)
          if(token.access == undefined){
              console.log(token['detail'])
              if(token['detail'] === "No active account found with the given credentials"){
                chrome.runtime.sendMessage({type: "invalid_auth", message: token['detail']});
              }
          }else{
            chrome.storage.local.set({token: token}, function() {
              
              console.log("Token saved to storage" + token.access);
              // redirect to dashboard.html
              chrome.runtime.sendMessage({type: "redirect", url: "dashboard.html"});
            });
            chrome.notifications.create({
              type: "basic",
              iconUrl: "images/logo.png",
              title: "Welcome",
              message: "Successfully Logged in.",
              priority: 2
            }, function(notificationId) {
              console.log("Sign in Notification created with ID: " + notificationId);
            });
            chrome.storage.local.set({name_device:device_name}, function(){
              console.log("Saved Device name " + device_name);
            });

          }

        })
        .catch(error => {
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
        const apiUrl = 'http://127.0.0.1:8000/api/v1/analyze/';
        const USER_ID = await getID();
        const DEVICE_NAME = await getDeviceID();
        const data = { user: USER_ID.id, url: target, device: DEVICE_NAME.device_id  };
        console.log(USER_ID.id + " " + DEVICE_NAME.device_id);
        AnalyzeURL(data,apiUrl).then(response => {
          var res = JSON.parse(response);
          try{
            if(res.is_secure === false){
              // chrome.tabs.remove(tabId);
              console.log("Explicit")
            }
          }catch(error){
            console.log(error);
          }
        }).catch(error => {
          console.log(error);
        });
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
        const ID = await getID();
        const DEVICE_ID = await getDeviceID();
        console.log(ID.id + " " + DEVICE_ID.device_id);
        getReminders(ID.id,DEVICE_ID.device_id);
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

  function getID() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("id", (data) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(data);
            }
        });
    });
}

function getDeviceID() {
  return new Promise((resolve, reject) => {
      chrome.storage.local.get("device_id", (data) => {
          if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
          } else {
              resolve(data);
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
    const response = await fetch('http://127.0.0.1:8000/api/v1/login/refresh/', {
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
                chrome.storage.local.set({id: data[property].id}, function() {
                  saveBrowserInstances(data[property].id).then(response => {
                    console.log(response);
                    for (const key in response) {
                      if(key === 'id'){
                        console.log(response[key]);
                        chrome.storage.local.set({device_id:response[key]})
                      }
                    }
                  }).catch(error => {
                    console.log(error);
                  })
                });
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


  // chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  //   if(request.type === "sendDevice"){
  //     saveBrowserInstances().then(response => {
  //       console.log(response);
  //       sendResponse(response);
  //     }).catch(error => {
  //       console.log(error);
  //     })
  //   }
  // })
  
  async function getDeviceNameValue() {
    try {
        const data = await chrome.storage.local.get("name_device");
        console.log(data.name_device);
        return data.name_device;
    } catch (error) {
        console.log(error);
    }
}


async function saveBrowserInstances(id) {
  const userAgent = navigator.userAgent;
  const browser = getBrowserName(userAgent);
  const device_name = await getDeviceNameValue();
  const _id = id;
  var datas = {
    device_name:device_name,
    device_type:browser,
    user_agent: userAgent,
    user: _id
  }
  const response = await fetch('http://127.0.0.1:8000/api/v1/devices/', {
    method: 'POST',
    body: JSON.stringify(datas),
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  return data;
}


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
      return "Edge-Legacy)";
    } else if (userAgent.includes("Edg")) {
      // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36 Edg/104.0.1293.70"
      return "Edge)";
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

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log(msg);
    if (msg.type === 'block') {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "images/logo.png",
        title: "Blocked",
        message: "Website blocked by Parental Control Extension",
        priority: 2
    }, function (notificationId) {
        console.log("Blocked Notification created with ID: " + notificationId);
    });
    }
  });

//   async function getReminders(user, device){
//     const endpoint = 'http://127.0.0.1:8000/api/v1/reminder/get/';
//     try {
//         const response = await fetch(`${endpoint}${device}/${user}/`).then(response => response.json())
//         .then(data => {
//           console.log(data[0]['user']);
//           if(data[0]['device'] === device){
//             console.log(true);
//           }
//           chrome.notifications.create({
//             type: "basic",
//             iconUrl: "images/logo.png",
//             title: "Reminders",
//             message: data[0]['message'],
//             priority: 2
//           }, function(notificationId) {
//             console.log("Notification created with ID: " + notificationId);
//           });
//         });
//     } catch (error) {
//         console.log(error);
//     }
// }
async function getReminders(user, device){
  const endpoint = 'http://127.0.0.1:8000/api/v1/reminder/get/';
  try {
      const response = await fetch(`${endpoint}${device}/${user}/`)
      const data = await response.json();
      if(data[0]['device'] === device){
          chrome.notifications.create({
              type: "basic",
              iconUrl: "images/logo.png",
              title: "Reminders",
              message: data[0]['message'],
              priority: 2
          }, function(notificationId) {
              console.log("Notification created with ID: " + notificationId);
          });
      }
  } catch (error) {
      console.log(error);
  }
}


chrome.storage.local.get(null, function(items) {
  console.log(items);
});
