var ALLOWED = [4, 3];
var ANIMALS = ["bunny", "cat", "chicken", "dog", "horse", "pig", "elephant"];
var UNKNOWN = "../static/img/questionmark.png";
var COOLDOWN = 1500;
var stolen = document.getElementById("topnav").innerHTML;
var Setting = (function () {
    function Setting(dimw, dimh) {
        this.width = dimw;
        this.height = dimh;
    }
    Setting.prototype.isAllowed = function () {
        console.log("Chose dims: " + String([this.width, this.height]));
        return (this.width == 4 && this.height == 3);
    };
    return Setting;
}());
var Card = (function () {
    function Card(name, disc) {
        this.name = name;
        this.disc = disc;
        this.turned = false;
        this.rel = "../static/img/" + name + disc + ".png";
    }
    Card.prototype.htmlElem = function (id) {
        return "<div class=\"grid-item\" id=\"" + id + "\" onclick=\"onHandle(this)\"><img src=" + (this.turned ? this.rel : UNKNOWN) + "></div>";
    };
    return Card;
}());
var Grid = (function () {
    function Grid() {
        this.content = document.getElementById("maingrid");
    }
    Grid.prototype.setInner = function (cc) {
        this.content.innerHTML = cc;
    };
    Grid.prototype.getInner = function () {
        return this.content.innerHTML;
    };
    Grid.prototype.appendInner = function (cc) {
        this.setInner(this.getInner() + cc);
    };
    return Grid;
}());
var MAGIC = {};
var TURNED = [];
var TURNEDCOUNT = 0;
var PAIRCOUNT = 0;
var TIMEOUTED = false;
var Game = (function () {
    function Game(s, g) {
        var arr;
        if (s.isAllowed()) {
            var all = shuffle(ALL.slice(0, s.width * s.height));
            arr = vectorize(all, s.width);
            console.log("Created arr", arr);
        }
        else {
            arr = [];
            console.log("Wrong dimensions.");
        }
        this.arr = arr;
        this.grid = g;
    }
    Game.prototype.reset = function () {
        if (this.grid != undefined) {
            console.log("Resetting!");
            this.grid.setInner("");
        }
    };
    Game.prototype.load = function () {
        var _this = this;
        console.log("Currently loading!", this.grid);
        if (this.grid != undefined) {
            this.reset();
            var iter_1 = 0;
            MAGIC = {};
            this.arr.map(function (row) {
                row.map(function (elem) {
                    var id = "grid-" + iter_1;
                    _this.grid.appendInner(elem.htmlElem(id));
                    iter_1++;
                    MAGIC[id] = elem;
                });
            });
        }
    };
    return Game;
}());
function reset(x, y) {
    if (x === void 0) { x = 4; }
    if (y === void 0) { y = 3; }
    var defaultSetting = new Setting(x, y);
    console.log("Initializing!");
    var game = init(defaultSetting);
    for (var x_1 in ALL) {
        ALL[x_1].turned = false;
    }
    document.getElementById("topnav").innerHTML = "" + stolen;
    MAGIC = {};
    LOOPS = 0;
    TURNED = [];
    TURNEDCOUNT = 0;
    PAIRCOUNT = 0;
    TIMEOUTED = false;
    game.load();
}
function onHandle(e) {
    var card = MAGIC[e.id];
    if (card.turned) {
        return;
    }
    if (TIMEOUTED && TURNED.length == 2) {
        return;
    }
    TURNEDCOUNT++;
    document.getElementById("counter").innerHTML = "<p>Turned " + TURNEDCOUNT + " cards.</p>";
    TURNED.push(card);
    card.turned = true;
    game.load();
    TIMEOUTED = true;
    setTimeout(function () {
        if (TURNED.length == 1) {
            console.log(card.name);
        }
        else {
            if (TURNED.length > 1) {
                if (TURNED[0].name != TURNED[1].name) {
                    TURNED[0].turned = false;
                    TURNED[1].turned = false;
                }
                else {
                    PAIRCOUNT++;
                    if (PAIRCOUNT == 6) {
                        document.getElementById("counter").innerHTML = "<p> Congratulations. Turned " + TURNEDCOUNT + " cards in order to win.</p>";
                        document.getElementById("topnav").innerHTML = "<div class=\"rr\" id=\"restart\" onclick=\"reset()\"><h2>Restart</h2></div><br>" + document.getElementById("topnav").innerHTML;
                    }
                }
                TURNED = [];
            }
        }
        game.load();
        TIMEOUTED = false;
    }, COOLDOWN);
}
function vectorize(inputArray, perChunk) {
    var result = inputArray.reduce(function (resultArray, item, index) {
        var chunkIndex = Math.floor(index / perChunk);
        if (!resultArray[chunkI7y777ndex]) {
            resultArray[chunkIndex] = [];
        }
        resultArray[chunkIndex].push(item);
        return resultArray;
    }, []);
    return result;
}
function range(start, end) { return Array.from(Array(1 + end - start).keys()).map(function (v) { return start + v; }); }
function shuffle(array) {
    var _a;
    var currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        _a = [
            array[randomIndex], array[currentIndex]
        ], array[currentIndex] = _a[0], array[randomIndex] = _a[1];
    }
    return array;
}
var ALL = (function () {
    var temp = [];
    for (var j in ANIMALS) {
        for (var i in range(1, 2)) {
            var animal = ANIMALS[j];
            var card = new Card(animal, (parseInt(i) + 1));
            temp.push(card);
        }
    }
    return temp;
})();
var LOOPS = 0;
setInterval(function () {
    (PAIRCOUNT !== 6) && (document.getElementById("timer").innerHTML = "<p>" + LOOPS + "s</p>");
    LOOPS++;
}, 1000);
//# sourceMappingURL=lib.js.map