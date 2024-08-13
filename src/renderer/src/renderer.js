function init() {
  window.addEventListener('DOMContentLoaded', () => {
    doAThing()
  })
}

function doAThing() {
  const versions = window.electron.process.versions
  replaceText('.electron-version', `Electron v${versions.electron}`)
  replaceText('.chrome-version', `Chromium v${versions.chrome}`)
  replaceText('.node-version', `Node v${versions.node}`)

  const ipcHandlerBtn = document.getElementById('ipcHandler')
  ipcHandlerBtn?.addEventListener('click', () => {
    window.electron.ipcRenderer.send('ping')
  })

  const darkModeToggle = document.getElementById('toggle-dark-mode')
  darkModeToggle.addEventListener('click', async () => {
    const isDarkMode = await window.darkmode.toggle()
    document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
  })

  const darkModeSystem = document.getElementById('reset-to-system')
  darkModeSystem.addEventListener('click', async () => {
    await window.darkmode.system()
    document.getElementById('theme-source').innerHTML = 'System'
  })
}

function replaceText(selector, text) {
  const element = document.querySelector(selector)
  if (element) {
    element.innerText = text
  }
}

init()
