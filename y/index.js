let grid = [];

let gridValue = 4;
let score = 0;

function initGrid() {
  let init = [];
  for (let i = 0; i < gridValue; i++) {
    let tempArr = [];
    for (let j = 0; j < gridValue; j++) {
      tempArr.push(0);
    }
    init.push(tempArr);
  }
  return init;
}

function random(){
  let a = Math.floor(Math.random()* (grid.length));
  let b = Math.floor(Math.random()* (grid.length));
  return {x: a, y: b}
}

function randomNumber() {
  let options = [];
  let spot = [];
  for (let i = 0; i < gridValue; i++) {
    for (let j = 0; j < gridValue; j++) {
      if (grid[i][j] === 0) {
        options.push({
          x: i,
          y: j
        });
      }
    }
  }
  if (options.length > 0){
    let executed = false;
    while(!executed){
      spot = random();
      if(grid[spot.x][spot.y] === 0){
        grid[spot.x][spot.y] = Math.floor(Math.random() * 2) * 2 + 2;
        executed = true;
      }
    }
  }
}

function checkGameOver() {
  for(let i=0; i<gridValue; i++){
    for(let j=0; j<gridValue; j++){
      if(grid[i][j] == 0){
        return false;
      }
      if(i !== 3 && grid[i][j] === grid[i+1][j]){
        return false;
      }
      if(j !== 3 && grid[i][j] === grid[i][j+1]){
        return false;
      }
    }
  }
  return true;
}

function displayGrid() {
  var tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = ""
  grid.forEach(function(rowData) {
    var row = document.createElement('tr');
    rowData.forEach(function(cellData) {
      var cell = document.createElement('td');
      cell.appendChild(document.createTextNode(cellData===0 ? '': cellData));
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });
  document.getElementById('score').innerHTML = score;
  if(checkGameOver()){
    document.getElementById('gameOver').innerHTML = "GAME OVER";
  }
}

function start() {
  grid = initGrid();
  score = 0;
  randomNumber();
  randomNumber();
  displayGrid();
}

function slide(row) {
  let arr = row.filter(a => a);
  let missing = gridValue - arr.length;
  let zeros = Array(missing).fill(0);
  arr = zeros.concat(arr);
  return arr;
}

function combine(row) {
  for (let i = (gridValue-1); i >= 1; i--){
    let a = row[i];
    let b = row[i-1];
    if(a==b && a!==2048 && b!==2048){
      row[i] = a + b;
      score += row[i];
      row[i-1] = 0;
    }
  }
  return row;
}

function operate(row){
  row = slide(row);
  row = combine(row);
  row = slide(row);
  return row;
}

function compare(oldObj, newObj) {
  for(let i=0; i< gridValue; i++){
    for(let j=0; j< gridValue; j++){
      if(oldObj[i][j] !== newObj[i][j]){
        return true;
      }
    }
  }
  return false;
}

function flipGrid(grid){
  for(let i=0; i< gridValue; i++){
    grid[i].reverse();
  }
  return grid;
}

function rotateGrid(grid){
  let newGrid = [];
  for(let i=0; i< gridValue; i++){
    let temp = [];
    for(let j=0; j< gridValue; j++){
      temp.push(grid[j][i]);
    }
    newGrid.push(temp);
  }
  return newGrid
}

function move(e){
  var event = window.event ? window.event : e;
  let a = event.key;
  let flipped = false;
  let rotated = false;
  let played = false;
  if(a === "ArrowLeft") {
    flipGrid(grid);
    flipped = true;
    played = true;
  }else if (a === "ArrowRight"){
    played = true;
  }else if (a === "ArrowUp"){
    grid = rotateGrid(grid);
    grid = flipGrid(grid);
    rotated = true;
    flipped = true;
    played = true;
  }else if (a === "ArrowDown"){
    grid = rotateGrid(grid);
    rotated = true;
    played = true;
  }
  if(played){
    let past = {...grid};
    for(let i=0; i< gridValue; i++){
      grid[i] = operate(grid[i]);
    }
    if(flipped){
      flipGrid(grid);
    }
    if(rotated){
      grid = rotateGrid(grid);
      grid = rotateGrid(grid);
      grid = rotateGrid(grid);
    }
    if(compare(past, grid)){
      randomNumber();
    }
  }
  displayGrid();
}

start();