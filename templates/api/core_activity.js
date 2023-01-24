

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "redirect") {
      window.location.href = request.url;
    }
});

chrome.runtime.sendMessage({type: "getHistory"}, function(response) {
    if(response.history){
        const history = response.history;
        const historyList = document.getElementById('historyListTable');
        history.forEach(function(item){
            const thead = document.createElement('p');
            thead.classList.add("text-md", "font-semibold")
            thead.innerHTML = item.url;
            historyList.appendChild(thead);
        }
        );

    }
});

chrome.runtime.sendMessage({type: "getDeviceName"})
.then(response => {
  document.getElementById('device_name').innerHTML = response.device;
})
.catch(error => {
    console.error(error);
});