class UiSettings {
  constructor() {
    this.el = document.getElementById('ui-settings')
    this.reset = this.el.querySelector('#reset')
  }
  init() {
    this.reset.addEventListener('click', () => {
      this.el.dispatchEvent(
        new CustomEvent('reset-settings', {
          bubbles: true,
          cancelable: true,
          composed: true
        })
      )
    })
  }
}

export default UiSettings
