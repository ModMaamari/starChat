document.addEventListener('DOMContentLoaded', () => {
  const chatList = document.getElementById('chat-list');

  chrome.storage.sync.get('starredChats', (data) => {
    const starredChats = data.starredChats || [];
    starredChats.forEach((chat, index) => {
      const chatItem = document.createElement('div');
      chatItem.classList.add('chat-item');

      const chatLink = document.createElement('a');
      chatLink.href = chat.url;
      chatLink.innerText = chat.title;
      chatLink.target = '_blank';
      chatLink.classList.add('chat-link');

      const deleteBtn = document.createElement('span');
      deleteBtn.innerText = '✖';
      deleteBtn.classList.add('delete-btn');
      deleteBtn.addEventListener('click', () => {
        removeChat(index);
      });

      chatItem.appendChild(chatLink);
      chatItem.appendChild(deleteBtn);
      chatList.appendChild(chatItem);
    });
  });

  function removeChat(index) {
    chrome.storage.sync.get('starredChats', (data) => {
      const starredChats = data.starredChats || [];
      starredChats.splice(index, 1);
      chrome.storage.sync.set({ starredChats }, () => {
        // Reload the popup to reflect changes
        chatList.innerHTML = '';
        starredChats.forEach((chat, newIndex) => {
          const chatItem = document.createElement('div');
          chatItem.classList.add('chat-item');

          const chatLink = document.createElement('a');
          chatLink.href = chat.url;
          chatLink.innerText = chat.title;
          chatLink.target = '_blank';
          chatLink.classList.add('chat-link');

          const deleteBtn = document.createElement('span');
          deleteBtn.innerText = '✖';
          deleteBtn.classList.add('delete-btn');
          deleteBtn.addEventListener('click', () => {
            removeChat(newIndex);
          });

          chatItem.appendChild(chatLink);
          chatItem.appendChild(deleteBtn);
          chatList.appendChild(chatItem);
        });
      });
    });
  }
});
