import fs from 'fs'
import path from 'path'

class ChooseFiles {
  constructor(element) {
    this.el = element
    this.articles = this.el.querySelectorAll('article')
    // this.input = this.el.querySelector('input')
    // this.button = this.el.querySelector('button')
    this.files = []
  }

  init() {
    this.articles.forEach((el) => {
      el.style.opacity = 0.2
      el.querySelector('select').setAttribute('disabled', 'true')
      // el.style.display = 'none'
      // el.querySelector('button').setAttribute('disabled', 'true')
      // el.querySelector('select').setAttribute('disabled', 'true')
    })
    // this.button.addEventListener('click', () => {
    //   window.api.openDialogFile().then((result) => {
    //     if (result.canceled) {
    //       console.log('No files selected')
    //       return
    //     }
    //     this.files = result.filePaths
    //     this.el.dispatchEvent(
    //       new CustomEvent('files-selected', {
    //         detail: result.filePaths,
    //         bubbles: true,
    //         cancelable: true,
    //         composed: true
    //       })
    //     )
    //   })
    // })
  }

  getDockerFiles(files) {
    return new Promise((resolve) => {
      const matchedDockerFiles = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        // a regex to match these file names Dockerfile, dockerfile, Dockerfile.dev, Dockerfile.prod
        const match = new RegExp(/Dockerfile(\.*)?/)
        if (match.test(file)) {
          matchedDockerFiles.push(file)
        }
      }
      resolve(matchedDockerFiles)
    })
  }

  getPyprojectTomlFiles(files) {
    return new Promise((resolve) => {
      const matchedPyprojectTomlFiles = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        // a regex to match these file names pyproject.toml, pyproject.toml.dev, pyproject.toml.prod
        const match = new RegExp(/pyproject.toml(\.*)?/)
        if (match.test(file)) {
          matchedPyprojectTomlFiles.push(file)
        }
      }
      resolve(matchedPyprojectTomlFiles)
    })
  }

  folderSelected(event) {
    // console.log(event)
    const dockerfiles = this.getDockerFiles(event.detail)
    const pyprojectTomlFiles = this.getPyprojectTomlFiles(event.detail)

    // populate dockerfiles select
    dockerfiles.then((result) => {
      const select = this.articles[0].querySelector('select')
      result.forEach((el) => {
        const option = document.createElement('option')
        option.value = el
        option.text = el
        select.appendChild(option)
      })
    })

    // populate pyproject.toml select
    pyprojectTomlFiles.then((result) => {
      const select = this.articles[1].querySelector('select')
      result.forEach((el) => {
        const option = document.createElement('option')
        option.value = el
        option.text = el
        select.appendChild(option)
      })
    })

    this.articles.forEach((el) => {
      el.style.opacity = 1
      el.querySelector('select').removeAttribute('disabled')
    })
  }

  folderSelecting() {
    this.articles.forEach((el) => {
      el.style.opacity = 0.2
      el.querySelector('select').setAttribute('disabled', 'true')
      el.querySelector('select').innerHTML = ''
    })
  }
}

export default ChooseFiles
