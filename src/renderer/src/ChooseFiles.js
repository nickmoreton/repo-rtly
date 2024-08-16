class ChooseFiles {
  constructor(element) {
    this.el = element
    this.article = this.el.querySelector('#choose-dockerfile')
    this.dockerfiles = this.el.querySelector('#choose-dockerfile #dockerfiles')
    this.buildButton = this.el.querySelector('#choose-dockerfile #build-button')
    this.showButton = this.el.querySelector('#choose-dockerfile #show-button')
    this.files = []
  }

  init() {
    this.article.style.opacity = 0.2
    this.buildButton.addEventListener('click', () => {
      const selectedDockerfile = this.dockerfiles.querySelector('input:checked')
      if (selectedDockerfile) {
        console.log(selectedDockerfile.value)
      }
    })
    this.buildButton.setAttribute('disabled', 'true')
    this.showButton.addEventListener('click', () => {
      const selectedDockerfile = this.dockerfiles.querySelector('input:checked')
      if (selectedDockerfile) {
        window.api.openFile(selectedDockerfile.value)
      }
    })
    this.showButton.setAttribute('disabled', 'true')
    // this.articles.forEach((el) => {
    //   el.style.opacity = 0.2
    // el.querySelector('select').setAttribute('disabled', 'true')
    // el.querySelector('select').innerHTML = ''
    // })
  }

  // extractDockerInfo(value) {
  //   window.api.getFileContent(value).then((result) => {
  //     console.log(result)
  //     const lines = result.split('\n')
  //     const dockerInfo = {
  //       pythonVersion: '',
  //       nodeVersion: '',
  //       poetryVersion: ''
  //     }
  //     lines.forEach((line) => {
  //       if (line.includes('FROM python')) {
  //         dockerInfo.pythonVersion = line.split(' ')[1].split(':')[1]
  //       }
  //       if (line.includes('FROM node')) {
  //         dockerInfo.nodeVersion = line.split(' ')[1].split(':')[1]
  //       }
  //       if (line.includes('ARG POETRY_VERSION')) {
  //         dockerInfo.poetryVersion = line.split(' ')[1].split('=')[1]
  //       }
  //     })
  //     console.log('extracting docker info', dockerInfo)
  //   })
  // }

  // extractPyprojectTomlInfo(value) {
  //   window.api.getFileContent(value).then((result) => {
  //     console.log(result)
  //   })
  // }

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

  // getPyprojectTomlFiles(files) {
  //   return new Promise((resolve) => {
  //     const matchedPyprojectTomlFiles = []
  //     for (let i = 0; i < files.length; i++) {
  //       const file = files[i]
  //       // a regex to match these file names pyproject.toml, pyproject.toml.dev, pyproject.toml.prod
  //       const match = new RegExp(/pyproject.toml(\.*)?/)
  //       if (match.test(file)) {
  //         matchedPyprojectTomlFiles.push(file)
  //       }
  //     }
  //     resolve(matchedPyprojectTomlFiles)
  //   })
  // }

  folderSelected(event) {
    // console.log(event)
    // const dockerfiles = this.getDockerFiles(event.detail)
    // const pyprojectTomlFiles = this.getPyprojectTomlFiles(event.detail)

    // populate dockerfiles radio inputs
    
    // const container = this.el.querySelector('#choose-dockerfile')
    // ul.classList.add('list-group')
    this.getDockerFiles(event.detail).then((result) => {
      // const select = this.articles[0].querySelector('select')

      result.forEach((el) => {
        const item = document.createElement('p')
        const input = document.createElement('input')
        input.type = 'radio'
        input.name = 'dockerfile'
        input.value = el
        input.id = el
        input.addEventListener('change', (event) => {
          this.buildButton.removeAttribute('disabled')
          this.showButton.removeAttribute('disabled')
        })
        const label = document.createElement('label')
        label.htmlFor = el
        label.innerText = el
        item.appendChild(input)
        item.appendChild(label)
        this.dockerfiles.appendChild(item)
      })

    // this.dockerfiles.appendChild(ul)

      // select.addEventListener('change', (event) => {
      //   this.extractDockerInfo(event.target.options[event.target.selectedIndex].value)
      // })
      // this.extractDockerInfo(select.options[select.selectedIndex].value)
    })

    // populate pyproject.toml select
    // pyprojectTomlFiles.then((result) => {
    //   const select = this.articles[1].querySelector('select')
    //   result.forEach((el) => {
    //     const option = document.createElement('option')
    //     option.value = el
    //     option.text = el
    //     select.appendChild(option)
    //   })
    //   select.addEventListener('change', (event) => {
    //     this.extractPyprojectTomlInfo(event.target.options[event.target.selectedIndex].value)
    //   })
    //   this.extractPyprojectTomlInfo(select.options[select.selectedIndex].value)
    // })

    this.article.style.opacity = 1
    // this.articles.forEach((el) => {
    //   el.style.opacity = 1
    //   // el.querySelector('select').removeAttribute('disabled')
    // })
  }

  folderSelecting() {
    this.article.style.opacity = 0.2
    this.dockerfiles.innerHTML = ''
    // this.articles.forEach((el) => {
    //   el.style.opacity = 0.2
    //   if (this.el.querySelector('#choose-dockerfile #dockerfiles')) {
    //     this.el.querySelector('#choose-dockerfile #dockerfiles').remove()
    //   }

    //   // el.querySelector('select').setAttribute('disabled', 'true')
    //   // el.querySelector('select').innerHTML = ''
    // })
  }

  reset() {
    this.article.style.opacity = 0.2
    this.dockerfiles.innerHTML = ''
    // this.dockerfiles.remove()
    // this.articles.forEach((el) => {
    //   el.style.opacity = 0.2
    //   if (this.el.querySelector('#choose-dockerfile #dockerfiles')) {
    //     this.el.querySelector('#choose-dockerfile #dockerfiles').remove()
    //   }
    //   // el.querySelector('select').setAttribute('disabled', 'true')
    //   // el.querySelector('select').innerHTML = ''
    // })
  }
}

export default ChooseFiles
