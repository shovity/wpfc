var express = require('express');
var router = express.Router();

const fuzzySolving = require('../fuzzySolving')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Fuzzy Control' });
});

router.post('/fuzzy', (req, res, next) => {
  const data = { valve: fuzzySolving(req.body.w, req.body.t) }
  res.json(data)
})

router.get('/particles-config', (req, res, next) => {
  res.json({
    "particles": {
      "number": {
        "value": 150,
        "density": {
          "enable": true,
          "value_area": 200
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 1,
        "random": false,
        "anim": {
          "enable": true,
          "speed": 1,
          "opacity_min": 0.6,
          "sync": false
        }
      },
      "size": {
        "value": 2,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 7,
          "size_min": 0.5,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 50,
        "color": "#ffffff",
        "opacity":0.7,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 3,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "bounce",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "repulse"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 100,
          "line_linked": {
            "opacity": 1
          }
        },
        "repulse": {
          "distance": 150,
          "duration": 0.6
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  })
})

module.exports = router;
