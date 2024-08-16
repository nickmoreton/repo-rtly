class ChooseFiles {
  constructor(element) {
    this.el = element
    this.article = this.el.querySelector('#choose-dockerfile')
    this.dockerfiles = this.el.querySelector('#choose-dockerfile #dockerfiles')
    this.buildButton = this.el.querySelector('#choose-dockerfile #build-button')
    this.files = []
  }

  init() {
    this.article.style.opacity = 0.2
    this.buildButton.setAttribute('disabled', 'true')
    this.buildButton.addEventListener('click', () => {
      const selectedDockerfile = this.dockerfiles.querySelector('input:checked')
      if (selectedDockerfile) {
        console.log(selectedDockerfile.value)
      }
    })
  }

  extractInfo(dockerfileContent) {
    const lines = dockerfileContent.split('\n')
    const dockerInfo = {
      pythonVersion: 'Not found',
      nodeVersion: 'Not found',
      poetryVersion: 'Not found'
    }
    lines.forEach((line) => {
      if (line.includes('FROM python')) {
        dockerInfo.pythonVersion = line.split(' ')[1].split(':')[1]
      }
      if (line.includes('FROM node')) {
        dockerInfo.nodeVersion = line.split(' ')[1].split(':')[1]
      }
      if (line.includes('ARG POETRY_VERSION')) {
        dockerInfo.poetryVersion = line.split(' ')[1].split('=')[1]
      }
    })
    return dockerInfo
  }

  showInfo(info, container) {
    // show the 3 versions in one line
    container.innerHTML = '<h3>Dockerfile</h3>'
    const p = document.createElement('p')
    p.innerHTML = `
      Python <strong>${info.pythonVersion}</strong> | 
      Node <strong>${info.nodeVersion}</strong> | 
      Poetry <strong>${info.poetryVersion}</strong>
      `
    container.appendChild(p)
  }

  buildDockefile(dockerfileContent) {
    // console.log(dockerfileContent)
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

  folderSelected(event) {
    this.getDockerFiles(event.detail).then((result) => {
      result.forEach((el) => {
        const item = document.createElement('p')
        const input = document.createElement('input')
        input.type = 'radio'
        input.name = 'dockerfile'
        input.value = el
        input.id = el
        input.addEventListener('change', (event) => {
          this.buildButton.removeAttribute('disabled')
          const selectedDockerfile = event.target
          if (selectedDockerfile) {
            window.api.getFileContent(selectedDockerfile.value).then((result) => {
              const info = this.extractInfo(result)
              this.showInfo(info, this.el.querySelector('header hgroup'))
            })
          }
        })
        const label = document.createElement('label')
        label.htmlFor = el
        label.innerText = el
        item.appendChild(input)
        item.appendChild(label)
        this.dockerfiles.appendChild(item)
      })
    })

    this.article.style.opacity = 1
  }

  folderSelecting() {
    this.article.style.opacity = 0.2
    this.dockerfiles.innerHTML = ''
    this.el.querySelector('header hgroup').innerHTML = '<h3>Dockerfile</h3>'
  }

  reset() {
    this.article.style.opacity = 0.2
    this.dockerfiles.innerHTML = ''
    this.el.querySelector('header hgroup').innerHTML = '<h3>Dockerfile</h3>'
  }
}

export default ChooseFiles
