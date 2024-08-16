import { app, shell, BrowserWindow, ipcMain, nativeTheme, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import path from 'path'
import Docker from './docker-run'

// Function to get all files recursively in a specific directory
function getFilesRecursive(dir) {
  let results = []
  const list = fs.readdirSync(dir)

  list.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat && stat.isDirectory()) {
      // Recurse into a subdirectory
      results = results.concat(getFilesRecursive(filePath))
    } else {
      // Is a file
      results.push(filePath)
    }
  })

  return results
}

function getFileContent(path) {
  return fs.readFileSync(path, 'utf8')
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Dark mode toggle
  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  // Dark mode system
  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })

  // Open dialog directory
  ipcMain.handle('open-dialog-directoy', () => {
    return dialog.showOpenDialog({ properties: ['openDirectory'] })
  })

  // Given a path, recursivley return the list of files
  ipcMain.handle('file-list', (event, path) => {
    return getFilesRecursive(path)
  })

  // Given a path, return the content of the file
  ipcMain.handle('get-file-content', (event, path) => {
    return getFileContent(path)
  })

  ipcMain.handle('run-docker-image', (event, python, poetry, folder) => {
    const docker = new Docker(python, poetry, folder)
    docker.run()
    // build a docker image using a child process
    // const docker = spawn('docker', ['run', '-it', 'python:3.8.5-slim-buster', 'bash'])
    // const out = []
    // const { spawn } = require('node:child_process')
    // // const ls = spawn('ls', ['-lh', '/usr'])
    // const ls = spawn('docker', [
    //   'run',
    //   '-v',
    //   '/Users/nickmoreton/Sites/afc-wagtail:/app',
    //   '-w',
    //   '/app',
    //   `python:${python}`,
    //   'bash',
    //   '-c',
    //   `pip install poetry==${poetry} && poetry export --without-hashes`
    // ])

    // ls.stdout.on('data', (data) => {
    //   console.log(`stdout: ${data}`)
    //   out.push(data)
    // })

    // ls.stderr.on('data', (data) => {
    //   console.error(`stderr: ${data}`)
    //   out.push(data)
    // })

    // ls.on('close', (code) => {
    //   console.log(`child process exited with code ${code}`)
    //   console.log(out.join(''))
    // })
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
