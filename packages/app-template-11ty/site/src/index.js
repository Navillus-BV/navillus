import 'alpinejs'

window.mobileMenu = function () {
  return {
    show: false,
    open() {
      this.show = true
    },
    close() {
      this.show = false
    },
    toggle() {
      this.show = !this.show
    },
    isOpen() {
      return this.show
    },
  }
}
