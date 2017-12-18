export function authControl(el, codeCompare = Array) {
  let btns = el.querySelectorAll('[data-code]')
  let [codeList, codeUsed] = [[], []]
  Array.from(btns).forEach(v => { codeList.push(v.getAttribute('data-code')) })
  for (let i = 0; i < codeCompare.length; i++) {
    codeUsed = filterItems(codeList, codeCompare[i])
    codeList = codeUsed
  }
  Array.from(btns).forEach(v => {
    for (let i = 0; i < codeUsed.length; i++) {
      if (v.getAttribute('data-code') === codeUsed[i]) {
        // console.log(codeUsed[i])
        v.style.display = 'none'
      }
    }
  })
}

function filterItems(codeList, codeCompare) {
  return codeList.filter(code => {
    return code !== codeCompare
  })
}
