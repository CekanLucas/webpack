// _ is just a letter in the alphabet in coding same with the $ character
import _ from 'lodash'
// import Print from './print'

function component() {
  const element = document.createElement('div')

  // Lodash, now imported by script
  element.innerHTML = _.join(['Hello', 'webpack'], ' ')
  // element.onclick = Print.bind(null, 'Hello webpack!')

  return element
}

document.body.appendChild(component())

