class ChooseFolder {
  constructor(element) {
    this.el = element
    this.button = this.el.querySelector('button')
    this.input = this.el.querySelector('input')
  }

  init() {
    this.button.addEventListener('click', () => {
      this.input.value = ''
      this.el.dispatchEvent(
        new CustomEvent('folder-selecting', {
          bubbles: true,
          cancelable: true,
          composed: true
        })
      )
      window.api.openDialogDirectory().then((result) => {
        if (result.canceled) {
          this.input.value = ''
          console.log('No folder selected')
          return
        }

        this.input.value = result.filePaths[0]
        this.fileList = window.api
          .fileList(result.filePaths[0])
          .then((result) => {
            return result
          })
          .then((result) => {
            this.result = result
            this.el.dispatchEvent(
              new CustomEvent('folder-selected', {
                detail: this.result,
                bubbles: true,
                cancelable: true,
                composed: true
              })
            )
          })
      })
    })
  }

  reset() {
    this.input.value = ''
  }
}

export default ChooseFolder
