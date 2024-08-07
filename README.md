# Self Music Bot

CLI application for downloading YouTube playlists.

This app runs in Linux operating systems. For Windows, available using WSL or WSL 2.

# Prerequisites

If on Windows:

- [WSL 2](https://learn.microsoft.com/en-us/windows/wsl/install) (Windows Subsystem for Linux).
- Some Linux distribution (e.g. Ubuntu). Available on the Microsoft Store.

Other requisites such as Node.js, pnpm, etc. are detailed in the Usage section.

# Usage (Example with Debian-based distributions)

1. Open a terminal in your Linux operating system (Ubuntu in this example).

  <img src="https://github.com/user-attachments/assets/48c624da-bbca-419e-afc5-469c0eb54f11">

2. Check for updates.

       sudo apt update

3. Install the `ffmpeg` library

       sudo apt install ffmpeg

4. Install [Node.js](https://nodejs.org/en/download/package-manager/current). Example with [NVM](https://github.com/nvm-sh/nvm) (Node Version Manager).
  
  ```bash
  # From https://nodejs.org/en/download/package-manager/current, 2024-08-07.
  
  # installs nvm (Node Version Manager)
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  
  # download and install Node.js (you may need to restart the terminal)
  nvm install 22 # or any other version
  
  # verifies the right Node.js version is in the environment
  node -v # should print `v22.6.0`
  
  # verifies the right npm version is in the environment
  npm -v # should print `10.8.2`
  ```

5. Enable `pnpm`.

       corepack enable pnpm

6. Clone the repository.

       git clone https://github.com/LeoLizc/self-music-bot.git

7. Install dependencies.

       pnpm install

8. Run.

       pnpm pldl
