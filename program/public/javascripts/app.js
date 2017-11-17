document.addEventListener('DOMContentLoaded', () => {

  const wH = document.documentElement.clientHeight
  const dev = location.search.indexOf('dev=1') !== -1

  // pool addEventListener
  {
    let isMouseDown = false
    pool.addEventListener('mousedown', event => {
      event.preventDefault()
      isMouseDown = true
    })

    window.addEventListener('mouseup', () => {
      event.preventDefault()
      isMouseDown = false
    })

    window.addEventListener('mousemove', event => {
      event.preventDefault()
      if (!isMouseDown) return
      let newH = wH - 55 - event.clientY;
      if (newH < 3) newH = 0
      if (newH > 500) newH = 500
      water.style.height = newH  + 'px'

      //dev
      if (dev) water.innerHTML = newH
    })
  }

})
