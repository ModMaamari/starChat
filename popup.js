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

      const renameBtn = document.createElement('span');
      renameBtn.innerHTML = '<i class="fas fa-edit"></i>'; // Font Awesome icon
      renameBtn.classList.add('rename-btn');
      renameBtn.addEventListener('click', () => {
        renameChat(index);
      });

      const deleteBtn = document.createElement('span');
      deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Font Awesome icon
      deleteBtn.classList.add('delete-btn');
      deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this starred chat?')) {
          removeChat(index);
        }
      });

      chatItem.appendChild(chatLink);
      chatItem.appendChild(renameBtn);
      chatItem.appendChild(deleteBtn);
      chatList.appendChild(chatItem);
    });
  });

  function renameChat(index) {
    const newName = prompt('Enter the new name for the chat:');
    if (newName) {
      chrome.storage.sync.get('starredChats', (data) => {
        const starredChats = data.starredChats || [];
        starredChats[index].title = newName;
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

            const renameBtn = document.createElement('span');
            renameBtn.innerHTML = '<i class="fas fa-edit"></i>'; // Font Awesome icon
            renameBtn.classList.add('rename-btn');
            renameBtn.addEventListener('click', () => {
              renameChat(newIndex);
            });

            const deleteBtn = document.createElement('span');
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Font Awesome icon
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => {
              if (confirm('Are you sure you want to delete this starred chat?')) {
                removeChat(newIndex);
              }
            });

            chatItem.appendChild(chatLink);
            chatItem.appendChild(renameBtn);
            chatItem.appendChild(deleteBtn);
            chatList.appendChild(chatItem);
          });
        });
      });
    }
  }

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

          const renameBtn = document.createElement('span');
          renameBtn.innerHTML = '<i class="fas fa-edit"></i>'; // Font Awesome icon
          renameBtn.classList.add('rename-btn');
          renameBtn.addEventListener('click', () => {
            renameChat(newIndex);
          });

          const deleteBtn = document.createElement('span');
          deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Font Awesome icon
          deleteBtn.classList.add('delete-btn');
          deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this starred chat?')) {
              removeChat(newIndex);
            }
          });

          chatItem.appendChild(chatLink);
          chatItem.appendChild(renameBtn);
          chatItem.appendChild(deleteBtn);
          chatList.appendChild(chatItem);
        });
      });
    });
  }
});
