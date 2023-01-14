

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
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');
            const tr = document.createElement('tr');
            const td2 = document.createElement('td');
            tr.classList.add('overflow-hidden');
            td2.classList.add('overflow-hidden');
            td2.innerHTML = item.url;
            thead.innerHTML = "<th>URL</th>";
            tr.appendChild(td2);
            thead.appendChild(tr);
            historyList.appendChild(thead);
            historyList.appendChild(tbody);
            historyList.appendChild(tr);
        }
        );

    }
});
