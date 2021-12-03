
// list of all allowed dims
const ALLOWED: [number, number] = [4, 3]
const ANIMALS: string[] = ["bunny", "cat", "chicken", "dog", "horse", "pig", "elephant"]
const UNKNOWN = "../static/img/questionmark.png"
const COOLDOWN = 1500
var stolen = document.getElementById("topnav").innerHTML

// Settings object to be passed to a Grid constructor
class Setting {
  height: number
  width: number

  constructor(dimw: number, dimh: number) {
    this.width = dimw
    this.height = dimh
  }

  isAllowed() {
    console.log("Chose dims: " + String([this.width, this.height]))
    return (this.width == 4 && this.height == 3)
  }
}

// Static card objects to represent each of the cards on the grid
class Card {
  name: string
  disc: any
  rel: string
  turned: boolean

  constructor(name: string, disc: number) {
    this.name = name
    this.disc = disc
    this.turned = false
    this.rel = "../static/img/"+name+disc+".png"
  }

  htmlElem(id) {
    return `<div class="grid-item" id="${id}" onclick="onHandle(this)"><img src=${this.turned ? this.rel : UNKNOWN}></div>`
  }
}

// Grid object to represent the HTML grid
class Grid {
  content: HTMLElement

  constructor() {
    this.content = document.getElementById("maingrid")
  }

  setInner(cc: string) {
    this.content.innerHTML = cc
  }
  getInner(): string {
    return this.content.innerHTML
  }
  appendInner(cc: string) {
    this.setInner(this.getInner() + cc)
  }
}

let MAGIC = {}
let TURNED: Card[] = []
let TURNEDCOUNT = 0
let PAIRCOUNT = 0
let TIMEOUTED = false


// Singleton Game object to track game state
class Game {
  arr: Array<Array<Card>>
  grid: Grid

  constructor(s: Setting, g: Grid) {
    let arr;
    if (s.isAllowed()) {
      let all = shuffle(ALL.slice(0, s.width*s.height))
      arr = vectorize(all, s.width)
      console.log("Created arr", arr)
    } else {
      arr = []
      console.log("Wrong dimensions.")
    }
    this.arr = arr
    this.grid = g
  }
  reset() {
    if (this.grid != undefined) {
      console.log("Resetting!")
      this.grid.setInner("")
    }
  }
  load() {
    console.log("Currently loading!", this.grid)
    if (this.grid != undefined) {
      // reset before appending
      this.reset()
      // add each card to the html
      let iter = 0
      MAGIC = {}
      // Add each element to the grid with an numerical id
      // prefixed with `grid-`
      this.arr.map(row => {
        row.map(elem => {
          let id = `grid-${iter}`
          this.grid.appendInner(elem.htmlElem(id))
          iter++
          MAGIC[id] = elem
        })
      })
    }
  }
}

function reset(x = 4, y = 3) {
  let defaultSetting = new Setting(x, y)
  console.log("Initializing!")
  let game = init(defaultSetting)
  for (let x in ALL) {
    ALL[x].turned = false
  }
  document.getElementById("topnav").innerHTML = `${stolen}`
  MAGIC = {}
  LOOPS = 0
  TURNED = []
  TURNEDCOUNT = 0
  PAIRCOUNT = 0
  TIMEOUTED = false
  game.load()
}

function onHandle(e) {
  let card = MAGIC[e.id]
  if (card.turned) {return}
  if (TIMEOUTED && TURNED.length == 2) {return}
  TURNEDCOUNT++
  document.getElementById("counter").innerHTML = `<p>Turned ${TURNEDCOUNT} cards.</p>`
  TURNED.push(card)
  card.turned = true
  game.load()
  TIMEOUTED = true
  setTimeout(() => {
    if (TURNED.length == 1) {
      console.log(card.name)
    } else {
      if (TURNED.length > 1) {
        if (TURNED[0].name != TURNED[1].name) {
          TURNED[0].turned = false
          TURNED[1].turned = false
        } else {
          PAIRCOUNT++
          if (PAIRCOUNT == 6) {
            // The game is finished
            document.getElementById("counter").innerHTML = `<p> Congratulations. Turned ${TURNEDCOUNT} cards in order to win.</p>`
            document.getElementById("topnav").innerHTML = `<div class="rr" id="restart" onclick="reset()"><h2>Restart</h2></div><br>${document.getElementById("topnav").innerHTML}`
          }
        }
        TURNED = []
      }
    }
    game.load()
    TIMEOUTED = false
  }, COOLDOWN);
}

function vectorize(inputArray, perChunk) {
  var result = inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index/perChunk)

    if(!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])
  return result
}

function range(start, end): number[]  {return Array.from(Array(1+end-start).keys()).map(v => start+v) }

function shuffle(array: Array<any>) {
  let currentIndex = array.length,  randomIndex;

  while (currentIndex != 0) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

// list of all card objects
const ALL: Card[] = (function() {
  var temp = []
  for (let j in ANIMALS) {
    for (let i in range(1, 2)) {
      let animal = ANIMALS[j]
      let card = new Card(animal, (parseInt(i)+1))
      temp.push(card)
    }
  }
  return temp
})()

let LOOPS = 0

setInterval(function(){

  (PAIRCOUNT !== 6) && (document.getElementById("timer").innerHTML = `<p>${LOOPS}s</p>`)
  LOOPS++
}, 1000)
