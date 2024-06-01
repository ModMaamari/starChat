chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "starChat",
    title: "Star this Chat",
    contexts: ["page"]
  });

  chrome.storage.sync.set({ starredChats: [], pinnedChats: [] });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const allowedUrls = ['https://chatgpt.com/', 'https://chat.mistral.ai/'];

  if (info.menuItemId === "starChat") {
    // Check if the URL is from any allowed URL
    const isAllowedUrl = allowedUrls.some(allowedUrl => tab.url.startsWith(allowedUrl));

    if (isAllowedUrl) {
      chrome.storage.sync.get('starredChats', (data) => {
        const starredChats = data.starredChats || [];
        const chatUrl = tab.url;
        const chatTitle = tab.title;

        // Check if the chat is already starred
        if (starredChats.some(chat => chat.url === chatUrl)) {
          // Show a fading notification for already starred chat
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              const notification = document.createElement('div');
              notification.innerText = 'This chat has already been starred!';
              notification.style.position = 'fixed';
              notification.style.top = '50%';
              notification.style.left = '50%';
              notification.style.transform = 'translate(-50%, -50%)';
              notification.style.backgroundColor = '#f44336';
              notification.style.color = 'white';
              notification.style.padding = '10px';
              notification.style.borderRadius = '5px';
              notification.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
              notification.style.zIndex = '10000';
              notification.style.opacity = '1';
              notification.style.transition = 'opacity 1s ease-out';
              document.body.appendChild(notification);
              setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                  document.body.removeChild(notification);
                }, 1000);
              }, 2000);
            }
          });
        } else {
          starredChats.push({ title: chatTitle, url: chatUrl });
          chrome.storage.sync.set({ starredChats }, () => {
            // Show a fading notification for success
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: () => {
                const notification = document.createElement('div');
                notification.innerText = '✨ Chat starred successfully!';
                notification.style.position = 'fixed';
                notification.style.top = '50%';
                notification.style.left = '50%';
                notification.style.transform = 'translate(-50%, -50%)';
                notification.style.backgroundColor = '#4CAF50';
                notification.style.color = 'white';
                notification.style.padding = '10px';
                notification.style.borderRadius = '5px';
                notification.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                notification.style.zIndex = '10000';
                notification.style.opacity = '1';
                notification.style.transition = 'opacity 1s ease-out';
                document.body.appendChild(notification);
                setTimeout(() => {
                  notification.style.opacity = '0';
                  setTimeout(() => {
                    document.body.removeChild(notification);
                  }, 1000);
                }, 2000);
              }
            });
          });
        }
      });
    } else {
      // Inject a fading notification for error
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const notification = document.createElement('div');
          notification.innerText = 'You can only star chats from https://chatgpt.com/ or https://chat.mistral.ai/';
          notification.style.position = 'fixed';
          notification.style.top = '50%';
          notification.style.left = '50%';
          notification.style.transform = 'translate(-50%, -50%)';
          notification.style.backgroundColor = '#f44336';
          notification.style.color = 'white';
          notification.style.padding = '10px';
          notification.style.borderRadius = '5px';
          notification.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
          notification.style.zIndex = '10000';
          notification.style.opacity = '1';
          notification.style.transition = 'opacity 1s ease-out';
          document.body.appendChild(notification);
          setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
              document.body.removeChild(notification);
            }, 1000);
          }, 2000);
        }
      });
    }
  }
});
