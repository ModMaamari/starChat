function addStarOption() {
    const observer = new MutationObserver(() => {
      const optionsMenu = document.querySelector('.chat-actions .options-dropdown');
      if (optionsMenu && !optionsMenu.querySelector('.star-option')) {
        const starOption = document.createElement('div');
        starOption.innerText = 'Star';
        starOption.className = 'star-option';
        starOption.style.cursor = 'pointer';
        starOption.onclick = function () {
          const chatElement = document.querySelector('.chat-item:hover');
          if (chatElement) {
            const chatUrl = chatElement.querySelector('a').href;
            chrome.runtime.sendMessage({ action: 'starChat', url: chatUrl });
          }
        };
        optionsMenu.appendChild(starOption);
      }
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  document.addEventListener('DOMContentLoaded', addStarOption);
  