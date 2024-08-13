class DockerfileChooser extends HTMLElement {
  constructor() {
    super()
    this.template = document.querySelector('#dockerfile-chooser-template')
    this.contents = this.template.content.cloneNode(true)
    this.cancelButton = this.contents.querySelector('#cancel')
    this.continueButton = this.contents.querySelector('#continue')
    this.dockerFileChooser = this.contents.querySelector('#dockerfile-chooser')
  }

  connectedCallback() {
    this.dockerFileChooser.style.display = 'none'
    this.dockerFileChooser.addEventListener('change', (event) => {
      this.dockerfileSelected(event.target.value)
    })
    this.cancelButton.style.display = 'none'
    this.cancelButton.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('cancel', {
          composed: true,
          bubbles: true
        })
      )
    })
    this.continueButton.style.display = 'none'
    this.continueButton.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('continue', {
          detail: '',
          composed: true,
          bubbles: true
        })
      )
    })
    this.appendChild(this.contents)
  }

  dockerfileSelected(dockerfile) {
    // this.cancelButton.style.display = 'none'
    this.continueButton.style.display = 'block'
    this.dispatchEvent(
      new CustomEvent('dockerfile', {
        detail: dockerfile,
        composed: true,
        bubbles: true
      })
    )
  }

  populateDockerfiles(files) {
    if (files.length > 1) {
      const option = document.createElement('option')
      option.value = ''
      option.text = 'Select a Dockerfile'
      this.dockerFileChooser.appendChild(option)
    }
    files.forEach((file) => {
      const option = document.createElement('option')
      option.value = file.path
      option.text = file.path
      this.dockerFileChooser.appendChild(option)
    })
    this.dockerFileChooser.style.display = 'block'
    this.cancelButton.style.display = 'block'
    if (files.length === 1) {
      this.dockerfileSelected(files[0].path)
    }
  }

  reset() {
    this.dockerFileChooser.style.display = 'none'
    this.cancelButton.style.display = 'none'
    this.dockerFileChooser.innerHTML = ''
    this.continueButton.style.display = 'none'
  }
}

export default DockerfileChooser
