import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  openDialogDirectory: () => ipcRenderer.invoke('open-dialog-directoy'),
  openDialogFile: () => ipcRenderer.invoke('open-dialog-file'),
  findFile: (path) => ipcRenderer.invoke('find-file', path),
  fileList: (path) => ipcRenderer.invoke('file-list', path),
  getFileContent: (path) => ipcRenderer.invoke('get-file-content', path)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('darkmode', { // Expose darkMode API
      toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
      system: () => ipcRenderer.invoke('dark-mode:system')
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
