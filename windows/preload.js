// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

// const { ipcRenderer } = require('electron')

// const defaultWindowOpen = window.open

// window.open = function customWindowOpen (url, ...args) {
//   ipcRenderer.send('report-window-open', location.origin, url, args)
//   return defaultWindowOpen(url + '?from_electron=1', ...args)
// }
