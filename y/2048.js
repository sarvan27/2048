let grid = [];
let isStarted = false;

let gridValue = 4;

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
      let r = Math.random(1);
      if(grid[spot.x][spot.y] === 0){
        grid[spot.x][spot.y] = r > 0.5 ? 2 : 4;
        executed = true;
      }
    }
  }
}

function displayGrid() {
  console.log("*---------------*");
  for (let i = 0; i < gridValue; i++) {
    console.log('|',grid[i].toString().replace(/,/g, " | "),'|')
    console.log("*---------------*");
  }
}

function start() {
  if(!isStarted){
    grid = initGrid();
    randomNumber();
    randomNumber();
    displayGrid();
    isStarted = true;
  }else{
    console.log("already started.....");
  }
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

function move(a){
  let flipped = false;
  let rotated = false;
  let played = false;
  if(a === 1) {
    flipGrid(grid);
    flipped = true;
    played = true;
  }else if (a === 2){
    played = true;
  }else if (a === 3){
    grid = rotateGrid(grid);
    grid = flipGrid(grid);
    rotated = true;
    flipped = true;
    played = true;
  }else if (a === 4){
    grid = rotateGrid(grid);
    rotated = true;
    played = true;
  }
  if(played){
    let past = {...grid};
    for(let i=0; i< gridValue; i++){
      grid[i] = operate(grid[i]);
    }
    let changed = compare(past, grid);
    if(flipped){
      flipGrid(grid);
    }
    if (rotated){
      grid = rotateGrid(grid);
      grid = rotateGrid(grid);
      grid = rotateGrid(grid);
    }
    if(changed){
      randomNumber();
    }
  }
  displayGrid();
}

start();