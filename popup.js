document.addEventListener('DOMContentLoaded', () => {
  const chatList = document.getElementById('chat-list');
  const deleteAllBtn = document.getElementById('delete-all-btn');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');

  // Load theme preference
  chrome.storage.sync.get('theme', (data) => {
    const theme = data.theme || 'light';
    document.body.classList.add(`${theme}-theme`);
    updateThemeIcon(theme);
  });

  // Function to load and display chats
  function loadChats() {
    chrome.storage.sync.get(['starredChats', 'pinnedChats'], (data) => {
      const starredChats = data.starredChats || [];
      const pinnedChats = data.pinnedChats || [];

      chatList.innerHTML = ''; // Clear the list to avoid duplicates

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

        const pinBtn = document.createElement('span');
        pinBtn.innerHTML = pinnedChats.includes(chat.url) ? '<i class="fas fa-thumbtack" style="color: gold;"></i>' : '<i class="fas fa-thumbtack"></i>'; // Font Awesome icon
        pinBtn.classList.add('pin-btn');
        pinBtn.addEventListener('click', () => {
          pinChat(index);
        });

        chatItem.appendChild(chatLink);
        chatItem.appendChild(renameBtn);
        chatItem.appendChild(deleteBtn);
        chatItem.appendChild(pinBtn);
        chatList.appendChild(chatItem);
      });
    });
  }

  function renameChat(index) {
    const newName = prompt('Enter the new name for the chat:');
    if (newName) {
      chrome.storage.sync.get('starredChats', (data) => {
        const starredChats = data.starredChats || [];
        starredChats[index].title = newName;
        chrome.storage.sync.set({ starredChats }, loadChats);
      });
    }
  }

  function removeChat(index) {
    chrome.storage.sync.get(['starredChats', 'pinnedChats'], (data) => {
      const starredChats = data.starredChats || [];
      const pinnedChats = data.pinnedChats || [];
      const chatUrl = starredChats[index].url;

      starredChats.splice(index, 1);
      const newPinnedChats = pinnedChats.filter(url => url !== chatUrl);

      chrome.storage.sync.set({ starredChats, pinnedChats: newPinnedChats }, loadChats);
    });
  }

  function pinChat(index) {
    chrome.storage.sync.get(['starredChats', 'pinnedChats'], (data) => {
      const starredChats = data.starredChats || [];
      const pinnedChats = data.pinnedChats || [];
      const chatUrl = starredChats[index].url;

      if (pinnedChats.includes(chatUrl)) {
        const newPinnedChats = pinnedChats.filter(url => url !== chatUrl);
        chrome.storage.sync.set({ pinnedChats: newPinnedChats }, loadChats);
      } else {
        if (pinnedChats.length < 5) {
          pinnedChats.push(chatUrl);
          chrome.storage.sync.set({ pinnedChats }, loadChats);
        } else {
          alert('You can only pin up to 5 chats.');
        }
      }
    });
  }

  function deleteAllChats() {
    if (confirm('Are you sure you want to delete all starred chats? This action cannot be undone.')) {
      chrome.storage.sync.set({ starredChats: [], pinnedChats: [] }, loadChats);
    }
  }

  function toggleTheme() {
    const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.body.classList.remove(`${currentTheme}-theme`);
    document.body.classList.add(`${newTheme}-theme`);
    chrome.storage.sync.set({ theme: newTheme });

    updateThemeIcon(newTheme);
  }

  function updateThemeIcon(theme) {
    const icon = theme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    themeToggleBtn.innerHTML = icon;
  }

  themeToggleBtn.addEventListener('click', toggleTheme);
  deleteAllBtn.addEventListener('click', deleteAllChats);

  loadChats(); // Initial load
});
