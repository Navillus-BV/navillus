module.exports = function(config) {
  return function({ dom, elem, css }) {
    const styleElem = dom.window.document.createElement('style')
    styleElem.innerHTML = css
    elem.parentNode.replaceChild(styleElem, elem)
  }
}