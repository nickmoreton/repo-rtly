import ChooseFiles from './ChooseFiles'
import ChooseFolder from './ChooseFolder'

function init() {
  window.addEventListener('DOMContentLoaded', () => {
    electron()
    app()
  })
}

function replaceText(selector, text) {
  const element = document.querySelector(selector)
  if (element) {
    element.innerText = text
  }
}

function electron() {
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
    // const isDarkMode = await window.darkmode.toggle()
    await window.darkmode.toggle()
    // document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
  })

  // const darkModeSystem = document.getElementById('reset-to-system')
  // darkModeSystem.addEventListener('click', async () => {
  //   await window.darkmode.system()
  //   document.getElementById('theme-source').innerHTML = 'System'
  // })
}

function app() {
  const chooseFolder = new ChooseFolder(document.getElementById('choose-folder'))
  chooseFolder.init()

  const chooseFiles = new ChooseFiles(document.getElementById('choose-files'))
  chooseFiles.init()

  window.addEventListener('folder-selected', (result) => {
    // listeners for the folder-selected event
    chooseFiles.folderSelected(result)
  })

  window.addEventListener('folder-selecting', () => {
    // listeners for the folder-selecting event
    chooseFiles.folderSelecting()
  })
}


init()
