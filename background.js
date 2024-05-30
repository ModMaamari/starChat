chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "starChat",
    title: "Star this Chat",
    contexts: ["page"]
  });

  chrome.storage.sync.set({ starredChats: [], pinnedChats: [] });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "starChat") {
    // Check if the URL is from chatgpt.com
    if (tab.url.startsWith("https://chatgpt.com/")) {
      chrome.storage.sync.get('starredChats', (data) => {
        const starredChats = data.starredChats || [];
        const chatUrl = tab.url;
        const chatTitle = tab.title;

        // Ensure the chat is not already starred
        if (!starredChats.some(chat => chat.url === chatUrl)) {
          starredChats.push({ title: chatTitle, url: chatUrl });
          chrome.storage.sync.set({ starredChats });
        }
      });
    } else {
      alert("You can only star chats from https://chatgpt.com/");
    }
  }
});
