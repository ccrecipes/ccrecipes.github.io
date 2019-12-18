function abbreviate(number, maxPlaces, forcePlaces, forceLetter) {
  number = Number(number)
  forceLetter = forceLetter || false
  if(forceLetter !== false) {
    return annotate(number, maxPlaces, forcePlaces, forceLetter)
  }
  var abbr
  if(number >= 1e21) {
    abbr = 'ac'
  }
  else if(number >= 1e18) {
    abbr = 'ab'
  }
  else if(number >= 1e15) {
    abbr = 'aa'
  }
  else if(number >= 1e12) {
    abbr = 'T'
  }
  else if(number >= 1e9) {
    abbr = 'B'
  }
  else if(number >= 1e6) {
    abbr = 'M'
  }
  else {
    abbr = ''
  }
  return annotate(number, maxPlaces, forcePlaces, abbr)
}

function annotate(number, maxPlaces, forcePlaces, abbr) {
  // set places to false to not round
  var rounded = 0
  switch(abbr) {
    case 'ac':
      rounded = number / 1e21
      break
    case 'ab':
      rounded = number / 1e18
      break
    case 'aa':
      rounded = number / 1e15
      break
    case 'T':
      rounded = number / 1e12
      break
    case 'B':
      rounded = number / 1e9
      break
    case 'M':
      rounded = number / 1e6
      break
    case '':
      rounded = number
      break
  }
  if(maxPlaces !== false) {
    var test = new RegExp('\\.\\d{' + (maxPlaces + 1) + ',}$')
    if(test.test(('' + rounded))) {
      rounded = rounded.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0]
    }
  }
  if(forcePlaces !== false && number >= 1e3) {
    rounded = rounded.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0]
  }
  return rounded + abbr
};