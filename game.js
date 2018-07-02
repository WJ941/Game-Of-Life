class Cell {
    constructor(element, isAlive) {
        this.isAlive = isAlive;
        this.element = element;
        this.surroundings = {
            top : null,
            right : null,
            bottom : null,
            left : null,
            topLeft : null,
            topRight : null,
            bottomLeft : null,
            bottomRight : null,
        };
    }
    /*
    当前细胞为存活状态时，当周围低于2个（不包含2个）存活细胞时， 该细胞变成死亡状态。（模拟生命数量稀少）
    当前细胞为存活状态时，当周围有2个或3个存活细胞时， 该细胞保持原样。
    当前细胞为存活状态时，当周围有3个以上的存活细胞时，该细胞变成死亡状态。（模拟生命数量过多）
    当前细胞为死亡状态时，当周围有3个存活细胞时，该细胞变成存活状态。 （模拟繁殖）
    */
    nextState() {
        let aliveSurrondingCount = Object.values(this.surroundings).filter(cell => cell !== null && cell.isAlive === true).length;
        if (this.isAlive) {
            if (aliveSurrondingCount < 2 || aliveSurrondingCount > 3) {
                return false;
            }
            return true;
        } else {
            if (aliveSurrondingCount === 3) {
                return true;
            }
            return false;
        }
    }
    setState(state) {
        this.isAlive = state;
        if (this.isAlive) {
            this.element.classList.add("alive");
        } else {
            this.element.classList.remove("alive");
        }
    }
}
class Game {
    constructor() {
        this.speed = 10;
    }
    initCells() {
        this.elements = document.querySelectorAll(".cell");
        this.cells =  Array.from(this.elements).map( e => {
            const isAlive = e.classList.contains("alive");
            return new Cell(e, isAlive);
        });
        this.initRelations();
    }
    initRelations() {
        const n = Math.sqrt(this.cells.length);
        function generateIndexToPosition(n) {
            return function (num) {
                return [num % n, Math.floor(num / n)];
            }
        }
        function generatePostionToIndex(n) {
            return function ([x, y]) {
                return y * n + x;
            }
        }
        const indexToPosition = generateIndexToPosition(n);
        const positionToIndex = generatePostionToIndex(n);
        const minP = 0, maxP = n -1;
        this.cells.forEach( (cell, index) => {
            const [x, y] = indexToPosition(index);
            const top = y - 1 < minP ? null : [x, y - 1],
                bottom = y + 1 > maxP ? null : [x, y + 1],
                left = x - 1 < minP ? null : [x - 1, y],
                right = x + 1 > maxP ? null : [x + 1, y],
                topLeft = (x - 1 < minP || y - 1 < minP) ? null : [x - 1, y - 1],
                topRight = (x + 1 > maxP || y - 1 < minP) ? null : [x + 1, y - 1],
                bottomLeft = (x - 1 < minP || y + 1 > maxP) ? null : [x - 1, y + 1],
                bottomRight = (x + 1 > maxP || y + 1 > maxP) ? null : [x + 1, y + 1];

            bindSurrounding("top", top ? this.cells[positionToIndex(top)] : null);
            bindSurrounding("bottom", bottom ? this.cells[positionToIndex(bottom)] : null);
            bindSurrounding("left", left ? this.cells[positionToIndex(left)] : null);
            bindSurrounding("right", right ? this.cells[positionToIndex(right)] : null);
            bindSurrounding("topLeft", topLeft ? this.cells[positionToIndex(topLeft)] : null);
            bindSurrounding("topRight", topRight ? this.cells[positionToIndex(topRight)] : null);
            bindSurrounding("bottomLeft", bottomLeft ? this.cells[positionToIndex(bottomLeft)] : null);
            bindSurrounding("bottomRight", bottomRight ? this.cells[positionToIndex(bottomRight)] : null);

            function bindSurrounding(direction, anotherCell) {
                cell.surroundings[direction] = anotherCell;
            }
        });
    }
    update() {
        const nextStates = this.cells.map(cell => cell.nextState());
        nextStates.forEach( (state, index) => this.cells[index].setState(state));
    }
    start() {
        this.initCells();
        const that = this;
        (function loop() {
            that.update();
            console.log("running!");
            that.timer = setTimeout(() => {
                loop();
            }, 1000 / that.speed)
        })();
    }
    stop() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }
    setSpeed(speed) {
        this.speed = speed;
    }
}
window.game = new Game();