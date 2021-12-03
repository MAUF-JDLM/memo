function init(sett) {
    var grid = new Grid();
    console.log("Created grid!", grid);
    var game = new Game(sett, grid);
    console.log("Created game!", game, game.grid, game.arr);
    game.load();
    return game;
}
var defaultSetting = new Setting(4, 3);
console.log("Initializing!");
var game = init(defaultSetting);
//# sourceMappingURL=mem.js.map