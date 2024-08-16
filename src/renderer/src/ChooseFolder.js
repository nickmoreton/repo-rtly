class ChooseFolder {
  constructor(element) {
    this.el = element
    this.button = this.el.querySelector('button')
    this.input = this.el.querySelector('input')
  }

  init() {
    this.button.addEventListener('click', (event) => {
      this.input.value = ''
      this.el.dispatchEvent(
        new CustomEvent('folder-selecting', {
          bubbles: true,
          cancelable: true,
          composed: true
        })
      )
      window.api.openDialogDirectory().then((result) => {
        this.button.setAttribute('aria-busy', 'true')
        if (result.canceled) {
          this.input.value = ''
          event.target.removeAttribute('aria-busy')
          console.log('No folder selected')
          return
        }

        this.input.value = result.filePaths[0]
        this.fileList = window.api.fileList(result.filePaths[0]).then((result) => {
          this.result = result
          this.el.dispatchEvent(
            new CustomEvent('folder-selected', {
              detail: this.result,
              bubbles: true,
              cancelable: true,
              composed: true
            })
          )
          this.button.removeAttribute('aria-busy')
        })
      })
    })
  }

  reset() {
    this.input.value = ''
  }
}

export default ChooseFolder
