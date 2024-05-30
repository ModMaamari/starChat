chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "starChat",
      title: "Star this Chat",
      contexts: ["page"]
    });
  
    chrome.storage.sync.set({ starredChats: [] });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "starChat") {
      chrome.storage.sync.get('starredChats', (data) => {
        const starredChats = data.starredChats || [];
        const chatUrl = tab.url;
        const chatTitle = tab.title;
        if (!starredChats.some(chat => chat.url === chatUrl)) {
          starredChats.push({ title: chatTitle, url: chatUrl });
          chrome.storage.sync.set({ starredChats });
        }
      });
    }
  });
  