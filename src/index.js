// _ is just a letter in the alphabet in coding same with the $ character
import _ from 'lodash'
import './style.css'
import Icon from './icon.png'
import Data from './data.xml'
import Notes from './data.csv'
import toml from './data.toml'
import yaml from './data.yaml'
import json from './data.json5'

console.log(toml.title, toml.owner.name)
console.log(yaml.title, yaml.owner.name)
console.log(json.title, json.owner.name)

function component() {
  const element = document.createElement('div')

  // Lodash, now imported by script
  element.innerHTML = _.join(['Hello', 'webpack'], ' ')
  element.classList.add('hello')

  // Add the image to our existing div
  const myIcon = new Image()
  myIcon.src = Icon

  element.appendChild(myIcon)

  // Access data files
  console.log(Data)
  console.log(Notes)

  return element
}

document.body.appendChild(component())
