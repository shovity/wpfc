// MAKE ENVIRONMENT LOOK GOOD
// get search params
const getSearchParams = () => {
  const search = window.location.search.slice(1)
  const arr = search.split(';')
  const params = {}
  arr.forEach(e => {
    const [key, value] = e.split('=')
    if (key && key !== '') params[key] = value
  })
  return params
}

// set search params
const setSearchParams = params => {
  let result = ''
  if (params.length !== 0) {
    result = '?'

    Object.keys(params).forEach(k => {
      if (k && k !== '') result += `${k}=${params[k]};`
    })
    result = result.slice(0, -1)
  }
  window.location.search = result
  return result
}

// initial serach params
let params = getSearchParams()
if (params.init !== '1') {
  params = {
    requestDelay: 100,
    showGame: '1',
    delayMutateWheather: 3000,
    requestAutoDelay: 1000,
    init: '1'
  }
  setSearchParams(params)
}

// DOM CONTENT LOADED
document.addEventListener('DOMContentLoaded', () => {

  const MAX_LOG_LINE  = 1000   // line

  const foods = [
    '🧀','🥚','🥐','🥖','🥞','🍠','🍔','🍕','🍝','🍟','🍤','🌭','🌮','🌯','🍛','🥙','🥘','🥗','🥓','🍖',
    '🍗','🍚','🍜','🍘','🍙','🍣','🍥','🍱','🍲','🍇','🍈','🍉','🍊','🍋','🍌','🍍','🍎','🍏','🍐','🍑',
    '🍒','🍓','🥝','🍄','🍅','🍆','🍹','🥑','🥔','🥕','🥒','🥜','🍰','🎂','🍨','🍦','🍩','🍪','🍿','🍮',
  ]

  const wH  = document.documentElement.clientHeight
  const wW  = document.documentElement.clientWidth

  // remove console log
  // const console.log = () => {}

  let logLine         = 0
  let isPause         = false
  let gamePoint       = 0
  let autoUpWater     = true
  let requestReady    = true
  let wheatherMutable = true

  let valveX     = 0
  let outputPool = {x: 700, nLow: 0, nMed: 1, nHei: 0}
  let outputTher = {x: 30, nLow: 0, nMed: 1, nHei: 0}

  // x = [0 1000]
  const setWater = x => {
    if (x < 0) x    = 0
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

    // Hidden game box
    if (x < 100) {
      isPause = true
      gameBox.style.display = 'none'
    } else {
      isPause = false
      gameBox.style.display = 'block'
    }
  }

  // Set Thermometer
  const setTher = x => {
    // Fix ther box
    xTher.innerHTML = x
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

    // set global varible
    valveX = value

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
    }, +params.requestDelay)
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
      data.valve = Math.floor(data.valve)
      log(`responsed data = <span class='success'>${JSON.stringify(data)}</span>`)
      setValve(data.valve)
      window.reloadUpWaterInterval()
    })
  }

  // pool handle, eventListener
  {
    // consts
    const poolRect             = pool.getBoundingClientRect()
    const delayStepAuto        = 2000 // ms
    const delayRedirectionAuto = 1000 // ms
    const delayRedirection     = 100  // ms
    const delayGenerateFood    = 3000 // ms
    const maxFood              = 5
    const rateEat              = 0.5

    const fs = []

    let isMouseDown = false
    let auto        = true
    let ready       = true
    let oX          = 0

    // define function
    const drawFood = (food, x, y) => {
      foodBox.innerHTML += `<span class='food' style='left:${x}px; top:${y}px;'>${food}</span>`
    }

    const removeFood = (fiOrX, y) => {
      const fi = y === undefined? fiOrX : fs.findIndex(f => f.x === fiOrX && f.y === y)
      if (fi === -1) return
      fs.splice(fi, 1)
      foodBox.innerHTML = ''
      fs.forEach(f => {
        drawFood(f.food, f.x, f.y)
      })
    }

    const moveFish = (x, y) => {
      // fix direction
      if (oX - x > 2) {
        fish.className = ''
      } else if (x - oX > 2) {
        fish.className = 'right'
      }
      oX = x;
      // move
      fish.style.left = x + 'px'
      fish.style.top = y - 12 + 'px'
    }

    const upPoint = () => {
      gamePoint++
      gamePointLabel.innerHTML = gamePoint + ' food'
    }


    const handleMouseMove = event => {
      // event.preventDefault()
      if (!isMouseDown) return
      let newH = wH - 55 - event.clientY;
      setWater(newH * 2 - 50)
      // send request to server
      requestFuzzy()

      // remove food when fix water
      fs.forEach((f, fi) => {
        if (f.y < event.clientY - poolRect.top + 50) removeFood(fi)
      })
    }

    const handleMouseMoveOverPool = event => {
      if (auto) return

      const [x, y] = [event.clientX - poolRect.left - 25, event.clientY - poolRect.top - 12]

      // move the fish
      moveFish(x, y)

      // fix positon
      const cx       = x + 15
      const cy       = y
      const rangeEat = 20

      // handle eating
      fs.forEach((f, fi) => {
        if (Math.abs(f.x + 10 - cx) < rangeEat && Math.abs(f.y + 10 - cy) < rangeEat) {
          upPoint()
          removeFood(fi)
        }
      })
    }

    const autoMoveStep = () => {
      if (!auto || isPause) return
      // set transition
      fish.style.transition = `all ${delayStepAuto/1000}s ease-in-out, transform ${delayRedirectionAuto/1000}s ease-in-out`


      // random eating a food
      if (Math.random() < rateEat && fs.length > 0) {
        // pick random a food
        const foodI = Math.floor(Math.random() * fs.length)
        const food = fs[foodI]

        // move the fish to food
        moveFish(food.x + 10, food.y + 10)

        // remove food
        setTimeout(() => {
          removeFood(food.x, food.y)
          upPoint()
        }, delayStepAuto)

        // break function
        return
      }

      // x = [0:205]
      const x = Math.floor(Math.random() * 206)
      // y = [505 - outputPool.x/2 : 470]
      const y = Math.floor(Math.random() * (470 - (505 - outputPool.x/2)) + (505 - outputPool.x/2))

      moveFish(x, y)
    }

    // define timeout, interval
    const addFoodInterval = setInterval(() => {
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
    }, delayGenerateFood)

    // addEventListener
    pool.addEventListener('mousedown', event => {
      event.preventDefault()
      isMouseDown = true
      handleMouseMove(event)
    })

    window.addEventListener('mouseup', () => {
      isMouseDown = false
    })

    window.addEventListener('mousemove', handleMouseMove)

    water.addEventListener('mouseleave', () => {
      auto = true
      autoMoveStep()
    })

    water.addEventListener('mouseover', () => {
      auto = false
      fish.style.transition = `all 0s ease-in-out, transform ${delayRedirection / 1000}s ease-in-out`
    })

    pool.addEventListener('mousemove', handleMouseMoveOverPool)
    
    setWater(700)
    setTher(25)
    requestFuzzy()
    setInterval(autoMoveStep, delayStepAuto)
    autoMoveStep()
    console.log('auto move the fish started')

    //-- end of pool scope
  }

  // toggle up water
  {
    let upWaterInterval = null
    let requestFuzzyInterval = null

    const handleUpWater = () => {
      if (!autoUpWater) {
        clearInterval(upWaterInterval)
        clearInterval(requestFuzzyInterval)
        requestFuzzyInterval = null
      }
      
      if (valveX === 0) {
        clearInterval(upWaterInterval)
      } else {
        setWater(outputPool.x+1)
      }
    }

    const reloadUpWaterInterval = () => {
      if (requestFuzzyInterval === null) {
        requestFuzzyInterval = setInterval(requestFuzzy, +params.requestAutoDelay)
      }
      // [0 100] -> [550 50]
      const delay = 550 - valveX*5
      clearInterval(upWaterInterval)
      upWaterInterval = setInterval(handleUpWater, delay)
      const speedUp = valveX === 0? 0 : Math.floor(1000/delay*10)/10
      log(`water increment with speed  <span class='success'>${speedUp}</span> (lít/s)`)
    }

    log(`auto request is <span class="info">ON</span> (delay = <span class="primary">${params.requestAutoDelay}</span> ms)`)
    toggle.addEventListener('click', () => {
      autoUpWater = !autoUpWater

      if (autoUpWater) {
        log(`auto request is <span class="info">ON</span> (delay = <span class="primary">${params.requestAutoDelay}</span> ms)`)
        reloadUpWaterInterval()
        pipe.style.right = 250 + 'px'
        tG.style.transform =  'rotate(0deg)'
      } else {
        log('auto request is <span class="danger">OFF</span>')
        clearInterval(upWaterInterval)
        clearInterval(requestFuzzyInterval)
        requestFuzzyInterval = null
        tG.style.transform =  'rotate(180deg)'
        pipe.style.right = 350 + 'px'
      }
    })

    window.reloadUpWaterInterval = reloadUpWaterInterval
  }

  // Thermometer eventListener
  {
    const fixTher = () => {

      const x = Math.floor(Math.random()*5 - 2)
      const newTherX = +outputTher.x + x
      if (
        newTherX < outputTher.x && outputTher.x > 9 ||
        newTherX > outputTher.x && outputTher.x < 31
      ) {
        setTher(newTherX)
        range.value = newTherX
      }
    }

    log(`auto mutate wheather is <span class="info">ON</span> (delay = <span class="primary">${params.delayMutateWheather}</span> ms)`)
    let fixTherInterval = setInterval(fixTher, +params.delayMutateWheather)

    cloud.addEventListener('click', () => {
      wheatherMutable = !wheatherMutable
      if (wheatherMutable) {
        log(`auto mutate wheather is <span class="info">ON</span> (delay = <span class="primary">${params.delayMutateWheather}</span> ms)`)
        sun.className = 'spin'
        if (fixTherInterval === null) fixTherInterval = setInterval(fixTher, +params.delayMutateWheather)
      } else {
        sun.className = ''
        log('auto mutate wheather is <span class="danger">OFF</span>')
        clearInterval(fixTherInterval)
        fixTherInterval = null
      }
    })

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
    console.log('particles.js config loaded')
  })

  if (!params.showGame || params.showGame !== '1') {
    gameBox.style.opacity = '0'
    water.style.cursor = 'pointer'
  }

  //-- End of DOMContentLoaded
})