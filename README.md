# Starred Chats Chrome Extension

## Overview

Starred Chats is a Chrome extension that allows users to star their favorite ChatGPT chats and easily access them later. The extension adds an option to the context menu, allowing users to star the current chat page. The starred chats are stored and can be accessed via the extension's popup interface.

## Features

- **Star Chats**: Right-click on a chat page and select "Star this Chat" to save the chat URL and title.
- **Access Starred Chats**: Click on the extension icon in the Chrome toolbar to view a list of all starred chats.
- **Persistent Storage**: Starred chats are saved using Chrome's sync storage, ensuring they are available even after closing and reopening Chrome.

## Installation

1. **Clone or Download the Repository**:
   ```bash
   git clone https://github.com/ModMaamari/starChat.git
   ```
   Or download the ZIP file and extract it to a directory.

2. **Open Chrome Extensions Page**:
   Open Chrome and go to `chrome://extensions/`.

3. **Enable Developer Mode**:
   Toggle the "Developer mode" switch in the top right corner.

4. **Load Unpacked Extension**:
   Click on "Load unpacked" and select the directory where you cloned or extracted the repository.

## Usage

1. **Navigate to a Chat Page**:
   Open a chat page in ChatGPT.

2. **Star the Chat**:
   Right-click on the page and select "Star this Chat" from the context menu.

3. **View Starred Chats**:
   Click the extension icon in the Chrome toolbar to open the popup and view your list of starred chats.

## File Structure

- `manifest.json`: Configuration file that describes the extension and its permissions.
- `background.js`: Background script that handles the context menu and storage.
- `popup.html`: HTML file for the popup interface.
- `popup.js`: JavaScript file that handles the display of starred chats in the popup.
- `images/`: Directory containing the extension icons.

## Icons

Ensure you have the necessary icons in the `images` directory:

- `images/icon16.png`
- `images/icon48.png`
- `images/icon128.png`

You can use any icons you prefer or create simple placeholder icons for testing.

## Contributing

Feel free to fork this repository and submit pull requests. Any improvements or bug fixes are welcome.

## License

This project is licensed under the Apache 2.0 License. See the [LICENSE](LICENSE) file for details.
