document.addEventListener('DOMContentLoaded', () => {

  const MAX_LOG_LINE  = 1000   // line
  const REQUEST_DELAY = 100   // ms

  const foods = [
    '🧀','🥚','🥐','🥖','🥞','🍠','🍔','🍕','🍝','🍟','🍤','🌭','🌮','🌯','🍛','🥙','🥘','🥗','🥓','🍖',
    '🍗','🍚','🍜','🍘','🍙','🍣','🍥','🍱','🍲','🍇','🍈','🍉','🍊','🍋','🍌','🍍','🍎','🍏','🍐','🍑',
    '🍒','🍓','🥝','🍄','🍅','🍆','🍹','🥑','🥔','🥕','🥒','🥜','🍰','🎂','🍨','🍦','🍩','🍪','🍿','🍮',
  ]

  const wH  = document.documentElement.clientHeight
  const dev = location.search.indexOf('dev=1') !== -1

  let logLine      = 0
  let requestReady = true
  let gamePoint = 0
  let isPause = false

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
    if (!requestReady) return
    requestReady = false
    setTimeout(() => {
      requestReady = true
    }, REQUEST_DELAY)
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
    const poolRect = pool.getBoundingClientRect()

    let isMouseDown = false

    const handleMouseMove = event => {
      // event.preventDefault()
      if (!isMouseDown) return
      let newH = wH - 55 - event.clientY;
      setWater(newH * 2)
      requestFuzzy()

      // Hidden game box
      if (newH < 50) {
        isPause = true
        gameBox.style.display = 'none'
      } else {
        isPause = false
        gameBox.style.display = 'block'
      }

      fs.forEach((f, fi) => {
        if (f.y < event.clientY - poolRect.top) {
          fs.splice(fi, 1)
          foodBox.innerHTML = ''
          fs.forEach(f => {
            drawFood(f.food, f.x, f.y)
          })
        }
      })
    }

    pool.addEventListener('mousedown', event => {
      event.preventDefault()
      isMouseDown = true
      handleMouseMove(event)
    })

    window.addEventListener('mouseup', () => {
      // event.preventDefault()
      isMouseDown = false
    })

    window.addEventListener('mousemove', handleMouseMove)

    // if you love a fish <--------- 🐠 🐠 🐠 🐠 🐠 🐠
    const delayStepAuto        = 3000 // ms
    const delayRedirectionAuto = 1000 // ms
    const delayRedirection     = 100  // ms
    const delayGenerateFood    = 2000 // ms
    const maxFood              = 5

    const fs                = []

    let auto  = true
    let ready = true
    let oX    = 0

    const drawFood = (food, x, y) => {
      foodBox.innerHTML += `<span class='food' style='left:${x}px; top:${y}px;'>${food}</span>`
    }


    const autoMove = () => {
      if (!auto || isPause) return
      // x = [0:205]
      const x = Math.floor(Math.random() * 206)
      // y = [505 - outputPool.x/2 : 470]
      const y = Math.floor(Math.random() * (470 - (505 - outputPool.x/2)) + (505 - outputPool.x/2))
      fish.style.transition = `all ${delayStepAuto/1000}s ease-in-out, transform ${delayRedirectionAuto/1000}s ease-in-out`
      fish.style.left = x + 'px'
      fish.style.top = y + 'px'

      // fix direction
      if (oX - x > 2) {
        fish.className = ''
      } else if (x - oX > 2) {
        fish.className = 'right'
      }
      oX = x;
    }

    setInterval(autoMove, delayStepAuto)

    water.addEventListener('mouseleave', () => {
      auto = true
      autoMove()
    })

    water.addEventListener('mouseover', () => {
      auto = false
      fish.style.transition = `all 0s ease-in-out, transform ${delayRedirection / 1000}s ease-in-out`
    })

    pool.addEventListener('mousemove', event => {
      if (auto) return

      const [x, y] = [event.clientX - poolRect.left - 25, event.clientY - poolRect.top - 12]

      // fix direction
      if (oX - x > 2) {
        fish.className = ''
      } else if (x - oX > 2) {
        fish.className = 'right'
      }
      oX = x;

      fish.style.left = x + 'px'
      fish.style.top = y + 'px'

      // handle eating
      fs.forEach((f, fi) => {
        if (Math.abs(f.x - x) < 10 && Math.abs(f.y - y) < 10) {
          gamePoint++
          gamePointLabel.innerHTML = gamePoint
          fs.splice(fi, 1)
          foodBox.innerHTML = ''
          fs.forEach(f => {
            drawFood(f.food, f.x, f.y)
          })
          
        }
      })
    })

    // foods
    setInterval(() => {
      if (fs.length >= maxFood || isPause) return
      // randomx, x = [0:200]
      const x = Math.floor(Math.random() * 200)
      // random y, y = [505 - outputPool.x/2 : 470]
      const y = Math.floor(Math.random() * (470 - (505 - outputPool.x/2)) + (505 - outputPool.x/2))
      // random food
      const food = foods[Math.floor(Math.random() * foods.length)]
      fs.push({
        food,
        x,
        y
      })

      drawFood(food, x, y)
      if (dev) log('add new food ' + food)
    }, delayGenerateFood)
    

    autoMove()

    //-- end of pool event
  }


  // Upwater
  // let uw = setInterval(() => {
  //   setWater(outputPool.x + 1)
  // }, pSpeed)

  // Slider addEventListener
  {
    range.addEventListener('click', () => {
      setTher(range.value)
    })

    range.addEventListener('input', () => {
      requestFuzzy()
      setTher(range.value)
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