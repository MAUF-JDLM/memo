
function init(sett: Setting) {
  let grid = new Grid()
  console.log("Created grid!", grid)
  // Create a game object with the grid
  let game = new Game(sett, grid)
  console.log("Created game!", game, game.grid, game.arr)
  // Load the game
  game.load()
  return game
}

let defaultSetting = new Setting(4, 3)
console.log("Initializing!")
let game = init(defaultSetting)

