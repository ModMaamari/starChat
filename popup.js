document.addEventListener('DOMContentLoaded', () => {
  const chatList = document.getElementById('chat-list');
  const folderList = document.getElementById('folder-list');
  const addFolderBtn = document.getElementById('add-folder-btn');
  const deleteAllBtn = document.getElementById('delete-all-btn');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');

  // Load theme preference
  chrome.storage.sync.get('theme', (data) => {
    const theme = data.theme || 'light';
    document.body.classList.add(`${theme}-theme`);
    updateThemeIcon(theme);
  });

  // Function to load and display folders
  function loadFolders() {
    chrome.storage.sync.get('folders', (data) => {
      const folders = data.folders || [];

      folderList.innerHTML = '';

      folders.forEach((folder, index) => {
        const folderItem = document.createElement('div');
        folderItem.classList.add('folder-item');
        folderItem.setAttribute('data-index', index);

        const folderLink = document.createElement('span');
        folderLink.innerText = folder.name;
        folderLink.classList.add('folder-link');
        folderLink.addEventListener('click', () => {
          loadChats(folder.name);
        });

        const editBtn = document.createElement('span');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>'; // Font Awesome icon
        editBtn.classList.add('rename-btn');
        editBtn.addEventListener('click', () => {
          renameFolder(index);
        });

        const deleteBtn = document.createElement('span');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Font Awesome icon
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
          if (confirm('Are you sure you want to delete this folder?')) {
            removeFolder(index);
          }
        });

        folderItem.appendChild(folderLink);
        folderItem.appendChild(editBtn);
        folderItem.appendChild(deleteBtn);
        folderList.appendChild(folderItem);
      });
    });
  }

  // Function to load and display chats
  function loadChats(folderName) {
    chrome.storage.sync.get(['starredChats', 'pinnedChats'], (data) => {
      const starredChats = data.starredChats || [];
      const pinnedChats = data.pinnedChats || [];
      const folderChats = starredChats.filter(chat => chat.folder === folderName);

      // Clear the list to avoid duplicates
      chatList.innerHTML = '';

      // Separate pinned and unpinned chats
      const pinned = folderChats.filter(chat => pinnedChats.includes(chat.url));
      const unpinned = folderChats.filter(chat => !pinnedChats.includes(chat.url));

      // Combine pinned and unpinned, with pinned first
      const combinedChats = [...pinned, ...unpinned];

      combinedChats.forEach((chat, index) => {
        const chatItem = document.createElement('div');
        chatItem.classList.add('chat-item');
        chatItem.setAttribute('data-index', index);

        const chatLink = document.createElement('a');
        chatLink.href = chat.url;
        chatLink.innerText = chat.title;
        chatLink.target = '_blank';
        chatLink.classList.add('chat-link');

        const renameBtn = document.createElement('span');
        renameBtn.innerHTML = '<i class="fas fa-edit"></i>'; // Font Awesome icon
        renameBtn.classList.add('rename-btn');
        renameBtn.addEventListener('click', () => {
          renameChat(index, chat.url);
        });

        const deleteBtn = document.createElement('span');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Font Awesome icon
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
          if (confirm('Are you sure you want to delete this starred chat?')) {
            removeChat(index, chat.url);
          }
        });

        const pinBtn = document.createElement('span');
        pinBtn.innerHTML = pinnedChats.includes(chat.url) ? '<i class="fas fa-thumbtack" style="color: gold;"></i>' : '<i class="fas fa-thumbtack"></i>'; // Font Awesome icon
        pinBtn.classList.add('pin-btn');
        pinBtn.addEventListener('click', () => {
          pinChat(chat.url);
        });

        chatItem.appendChild(chatLink);
        chatItem.appendChild(renameBtn);
        chatItem.appendChild(deleteBtn);
        chatItem.appendChild(pinBtn);
        chatList.appendChild(chatItem);
      });

      // Make the chat list sortable
      new Sortable(chatList, {
        animation: 150,
        onEnd: function (evt) {
          const oldIndex = evt.oldIndex;
          const newIndex = evt.newIndex;

          if (oldIndex !== newIndex) {
            moveChat(oldIndex, newIndex, folderName);
          }
        },
      });
    });
  }

  function addFolder() {
    const folderName = prompt('Enter the name for the new folder:');
    if (folderName) {
      chrome.storage.sync.get('folders', (data) => {
        const folders = data.folders || [];
        folders.push({ name: folderName });
        chrome.storage.sync.set({ folders }, loadFolders);
      });
    }
  }

  function renameFolder(index) {
    const newName = prompt('Enter the new name for the folder:');
    if (newName) {
      chrome.storage.sync.get('folders', (data) => {
        const folders = data.folders || [];
        folders[index].name = newName;
        chrome.storage.sync.set({ folders }, loadFolders);
      });
    }
  }

  function removeFolder(index) {
    chrome.storage.sync.get('folders', (data) => {
      const folders = data.folders || [];
      const folderName = folders[index].name;

      folders.splice(index, 1);
      chrome.storage.sync.set({ folders }, () => {
        // Remove chats associated with this folder
        chrome.storage.sync.get('starredChats', (data) => {
          const starredChats = data.starredChats || [];
          const newStarredChats = starredChats.filter(chat => chat.folder !== folderName);
          chrome.storage.sync.set({ starredChats: newStarredChats }, () => {
            loadFolders();
            loadChats(null); // Clear chat list
          });
        });
      });
    });
  }

  function renameChat(index, url) {
    const newName = prompt('Enter the new name for the chat:');
    if (newName) {
      chrome.storage.sync.get('starredChats', (data) => {
        const starredChats = data.starredChats || [];
        const chat = starredChats.find(chat => chat.url === url);
        chat.title = newName;
        chrome.storage.sync.set({ starredChats }, () => {
          loadChats(chat.folder);
          showNotification('Chat renamed successfully!', 'green');
        });
      });
    }
  }

  function removeChat(index, url) {
    chrome.storage.sync.get(['starredChats', 'pinnedChats'], (data) => {
      const starredChats = data.starredChats || [];
      const pinnedChats = data.pinnedChats || [];
      const chat = starredChats.find(chat => chat.url === url);

      starredChats.splice(index, 1);
      const newPinnedChats = pinnedChats.filter(pinnedUrl => pinnedUrl !== url);

      chrome.storage.sync.set({ starredChats, pinnedChats: newPinnedChats }, () => {
        loadChats(chat.folder);
        showNotification('Chat deleted successfully!', 'red');
      });
    });
  }

  function pinChat(url) {
    chrome.storage.sync.get(['pinnedChats'], (data) => {
      const pinnedChats = data.pinnedChats || [];

      if (pinnedChats.includes(url)) {
        const newPinnedChats = pinnedChats.filter(pinnedUrl => pinnedUrl !== url);
        chrome.storage.sync.set({ pinnedChats: newPinnedChats }, loadChats);
      } else {
        if (pinnedChats.length < 5) {
          pinnedChats.push(url);
          chrome.storage.sync.set({ pinnedChats }, loadChats);
        } else {
          alert('You can only pin up to 5 chats.');
        }
      }
    });
  }

  function deleteAllChats() {
    if (confirm('Are you sure you want to delete all starred chats? This action cannot be undone.')) {
      chrome.storage.sync.set({ starredChats: [], pinnedChats: [] }, () => {
        loadChats(null); // Clear chat list
        showNotification('All chats deleted successfully!', 'red');
      });
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

  function moveChat(oldIndex, newIndex, folderName) {
    chrome.storage.sync.get('starredChats', (data) => {
      const starredChats = data.starredChats || [];
      const folderChats = starredChats.filter(chat => chat.folder === folderName);
      const [movedChat] = folderChats.splice(oldIndex, 1);
      folderChats.splice(newIndex, 0, movedChat);

      // Update the original starredChats array
      const newStarredChats = starredChats.filter(chat => chat.folder !== folderName).concat(folderChats);
      chrome.storage.sync.set({ starredChats: newStarredChats }, loadChats);
    });
  }

  function showNotification(message, color) {
    const notification = document.createElement('div');
    notification.innerText = message;
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.backgroundColor = color;
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

  addFolderBtn.addEventListener('click', addFolder);
  themeToggleBtn.addEventListener('click', toggleTheme);
  deleteAllBtn.addEventListener('click', deleteAllChats);

  loadFolders(); // Initial load
});
