import fs from 'fs'
import path from 'path'

class ChooseFiles {
  constructor(element) {
    this.el = element
    this.articles = this.el.querySelectorAll('article')
    this.files = []
  }

  init() {
    this.articles.forEach((el) => {
      el.style.opacity = 0.2
      el.querySelector('select').setAttribute('disabled', 'true')
      el.querySelector('select').innerHTML = ''
    })
  }

  extractDockerInfo(value) {
    console.log('extracting docker info', value)
  }

  extractPyprojectTomlInfo(value) {
    console.log('extracting pyproject.toml info', value)
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
      select.addEventListener('change', (event) => {
        this.extractDockerInfo(event.target.options[event.target.selectedIndex].value)
      })
      this.extractDockerInfo(select.options[select.selectedIndex].value)
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
      select.addEventListener('change', (event) => {
        this.extractPyprojectTomlInfo(event.target.options[event.target.selectedIndex].value)
      })
      this.extractPyprojectTomlInfo(select.options[select.selectedIndex].value)
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

  reset() {
    this.articles.forEach((el) => {
      el.style.opacity = 0.2
      el.querySelector('select').setAttribute('disabled', 'true')
      el.querySelector('select').innerHTML = ''
    })
  }
}

export default ChooseFiles
