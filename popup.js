document.addEventListener('DOMContentLoaded', () => {
    const chatList = document.getElementById('chat-list');
    
    chrome.storage.sync.get('starredChats', (data) => {
      const starredChats = data.starredChats || [];
      starredChats.forEach((chat) => {
        const chatLink = document.createElement('a');
        chatLink.href = chat.url;
        chatLink.innerText = chat.title;
        chatLink.target = '_blank';
        chatLink.classList.add('chat-link');
        chatList.appendChild(chatLink);
      });
    });
  });
  