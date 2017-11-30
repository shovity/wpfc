document.addEventListener('DOMContentLoaded', () => {

  const MAX_LOG_LINE = 1000

  const wH = document.documentElement.clientHeight
  const dev = location.search.indexOf('dev=1') !== -1

  let logLine = 0

  // {x, nLow, nMed, nHei: 0}
  let outputPool = {x: 500, nLow: 0, nMed: 1, nHei: 0}
  let outputTher = {x: 30, nLow: 0, nMed: 1, nHei: 0}

  // pSpeed = [0 3]
  let pSpeed = 50

  // x = [0 1000]
  const setWater = x => {
    if (x < 0) x = 0
    if (x > 1000) x = 1000
    // Fix pool
    let xPixel = Math.floor(x / 2)
    if (xPixel < 3) xPixel = 0
    water.style.height = xPixel  + 'px'
    // Fix Dia
    // [0 - 1000] => [43 230]
    let yPosition = (230 - 43) * x / 1000 + 43
    if (yPosition < 43) yPosition = 43
    if (yPosition > 230) yPosition = 230
    pp.style.left = yPosition + 'px'
    xP.innerHTML = x

    // computing Nlow
    let nLow = 1
    if (x > 500) {
      nLow = 0
      //
    } else if (x > 300) {
      nLow = (500 - x) / (500 - 300)
    }

    // computing nMed
    let nMed = 0
    if (x > 800) {
      //
    } else if (x > 700) {
      nMed = (800 - x) / (800 - 700)
    } else if (x > 500) {
      nMed = 1
    } else if (x > 300) {
      nMed = (x - 300) / (500 - 300)
    }

    // computing nHei
    let nHei = 0;
    if (x > 800) {
      nHei = 1;
    } else if (x > 700) {
      nHei = (x - 700) / (800 - 700)
    }

    outputPool = {x, nLow, nMed, nHei}
    yP.innerHTML = `(${nLow}, ${nMed}, ${nHei})`

    // Fix water lable
    wl.innerHTML = `${xPixel * 2} lít`
  }

  // Set Thermometer
  const setTher = x => {
    // Fix ther box
    xTher.innerHTML = range.value
    // Fix dia
    // [0 50] => [351 538]
    let yPosition = (538 - 351) / 50 * x + 351
    pt.style.left = yPosition + 'px'
    xT.innerHTML = x

    // computing Nlow
    let nLow = 1
    if (x > 20) {
      nLow = 0
      //
    } else if (x > 10) {
      nLow = (20 - x) / (20 - 10)
    }

    // computing nMed
    let nMed = 0
    if (x > 30) {
      //
    } else if (x > 25) {
      nMed = (30 - x) / (30 - 25)
    } else if (x > 20) {
      nMed = 1
    } else if (x > 10) {
      nMed = (x - 10) / (20 - 10)
    }

    // computing nHei
    let nHei = 0;
    if (x > 30) {
      nHei = 1;
    } else if (x > 25) {
      nHei = (x - 25) / (30 - 25)
    }

    outputTher = {x, nLow, nMed, nHei}
    yT.innerHTML = `(${nLow}, ${nMed}, ${nHei})`
  }

  // set valve
  const setValve = value => {
    // set value label
    vl.innerHTML = value + '%'

    // set gear's speed
    let speed = 9e9
    if (value !== 0) {
      speed = Math.floor((100 - value) / 10)
    }
    gear.style.animationDuration = speed + 's'

    // set bloob
    if (value > 89) {
      valve.className = 'o3'
    } else if (value > 59) {
      valve.className = 'o2'
    } else if (value > 0) {
      valve.className = 'o1'
    } else {
      valve.className = 'o0'
    }
  }

  // Log
  const log = meg => {
    // clear log when limit
    if (++logLine > MAX_LOG_LINE) {
      lcontent.innerHTML = ''
      logLine = 0
    }
    const time = new Date().toLocaleTimeString()
    lcontent.innerHTML += `<span class='prompt'>${time}:</span> - ${meg} <br>`
    lcontent.scrollTop = lcontent.scrollHeight
  }

  // Request fuzzy
  const requestFuzzy = () => {
    let body = {w: outputPool.x, t: outputTher.x}
    log(`requesting data <span class='primary'>[${outputPool.x} ${outputTher.x}]</span>`)

    fetch(
      '/fuzzy',
      {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(body)
      }
    ).then(res => res.json()).then(data => {
      log(`responsed data = <span class='success'>${JSON.stringify(data)}</span>`)
      setValve(Math.floor(data.valve))
    })
  }

  // pool addEventListener
  {
    let isMouseDown = false
    pool.addEventListener('mousedown', event => {
      event.preventDefault()
      isMouseDown = true
      let newH = wH - 55 - event.clientY;
      setWater(newH * 2)
    })

    window.addEventListener('mouseup', () => {
      // event.preventDefault()
      isMouseDown = false
    })

    window.addEventListener('mousemove', event => {
      // event.preventDefault()
      if (!isMouseDown) return
      let newH = wH - 55 - event.clientY;
      setWater(newH * 2)
      requestFuzzy()
    })
  }


  // Upwater
  // let uw = setInterval(() => {
  //   setWater(outputPool.x + 1)
  // }, pSpeed)

  // Slider addEventListener
  {
    range.addEventListener('input', () => {
      setTher(range.value)
      requestFuzzy()
    })
  }


  /**
   * Particles
   */
  particlesJS.load('particles', '/particles-config', () => {
    console.log('callback - particles.js config loaded')
  })
  

  //-- End of DOMContentLoaded
})
