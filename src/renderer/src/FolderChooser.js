class FolderChooser extends HTMLElement {
  constructor() {
    super()
    this.template = document.querySelector('#folder-chooser-template')
    this.contents = this.template.content.cloneNode(true)
    this.filesInput = this.contents.querySelector('#files')
    this.chooseButton = this.contents.querySelector('#choose')
    this.dockerFiles = []
  }

  connectedCallback() {
    // initial visibility
    this.filesInput.style.display = 'none'

    // event listeners
    this.chooseButton.addEventListener('click', this.chooseButtonClicked.bind(this))
    this.filesInput.addEventListener('cancel', this.filesInputCanceled.bind(this))
    this.filesInput.addEventListener('change', this.filesInputChanged.bind(this))

    // append the template
    this.appendChild(this.contents)
  }

  filesInputCanceled() {
    this.chooseButton.removeAttribute('aria-busy')
    this.chooseButton.removeAttribute('aria-label')
    this.chooseButton.removeAttribute('disabled')
  }

  filesInputChanged(event) {
    this.Dockerfiles = this.matchDockerFiles(event.target.files)
    if (this.Dockerfiles.length === 0) {
      this.noDockerfilesFound()
      this.filesInput.value = ''
      return
    }

    this.chooseButtonLoading()

    this.dispatchEvent(
      new CustomEvent('dockerfiles', {
        detail: this.Dockerfiles,
        composed: true,
        bubbles: true
      })
    )
    // need to detect other files we are interested in
  }

  noDockerfilesFound() {
    alert('No Dockerfiles found in this folder')
    this.chooseButton.removeAttribute('aria-busy')
    this.chooseButton.removeAttribute('aria-label')
    this.chooseButton.removeAttribute('disabled')
    this.dockerFiles = []
  }

  chooseButtonClicked() {
    this.chooseButton.setAttribute('aria-busy', 'true')
    this.chooseButton.setAttribute('aria-label', 'Loading Dockerfiles')
    this.chooseButton.setAttribute('disabled', 'true')
    this.filesInput.click()
  }

  chooseButtonLoading() {
    this.chooseButton.style.display = 'none'
    this.chooseButton.removeAttribute('aria-busy')
  }

  matchDockerFiles(files) {
    const matchedDockerFiles = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      // a regex to match these file names Dockerfile, dockerfile, Dockerfile.dev, Dockerfile.prod
      const match = new RegExp(/Dockerfile(\.*)?/)
      if (match.test(file.name)) {
        matchedDockerFiles.push(file)
      }
    }
    return matchedDockerFiles
  }

  reset() {
    this.chooseButton.style.display = 'block'
    this.chooseButton.removeAttribute('disabled')
    this.dockerFiles = []
  }
}

export default FolderChooser
