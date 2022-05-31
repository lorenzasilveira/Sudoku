var sudokuGrid;
var numberOfGivens = 20;
var grid, printarElemento, mostraSolucao, takesTooLongToExecute;

function gerarSudokuOnLoad() {
	sudokuGrid = [	[5,3,0,0,7,0,0,0,0],
					[6,0,0,1,9,5,0,0,0],
					[0,9,8,0,0,0,0,6,0],
					[8,0,0,0,6,0,0,0,3],
					[4,0,0,8,0,3,0,0,1],
					[7,0,0,0,2,0,0,0,6],
					[0,6,0,0,0,0,2,8,0],
					[0,0,0,4,1,9,0,0,5],
					[0,0,0,0,8,0,0,7,9]	];
	
	printarGrid();
}

async function SubirDados(arquivo){
	let text = await arquivo.text();
	
	limparGrid();

	text = text.split(/;|\n+/g);
	let k = 0;
	for (i = 0; i < 9; i++) {
		for (j = 0; j < 9; j++) {
			sudokuGrid[i][j] = text[k];
			k++;
		}
	}
	printarGrid();
}

function gerarSudoku() {
	var i, j, candidate, indexX, indexY, position;
	
	disableButtons();
	emptyMessages();
	
	// New "empty" grid
	limparGrid();
	
	// Put random candidates and check if they conflict one another
	for (i = 0; i < numberOfGivens; i++) {
		do {
			candidate = Math.floor((Math.random() * 9) + 1); // 1 - 9
			do {
				indexX = Math.floor((Math.random() * 9) + 0); // 0 - 8
				indexY = Math.floor((Math.random() * 9) + 0); 
			} while (!sudokuGrid[indexX][indexY] == 0); // find an empty cell
		} while (!createsNoConflicts(indexX,indexY,candidate));
		sudokuGrid[indexX][indexY] = candidate;
	}
	
	printarGrid();
	enableButtons();
}

function printarGrid() {
	var i, j, indexId;
	for (i = 0; i < 9; i++) {
		for (j = 0; j < 9; j++) {
			indexId = i + "" + j; 
			if (sudokuGrid[i][j] != 0) {
				document.getElementById(indexId).innerHTML = sudokuGrid[i][j];
				document.getElementById(indexId).setAttribute("class", "givenNumber");
			} else {
				document.getElementById(indexId).setAttribute("class", "solvingNumber");
			}
		}
	}
}

function drawFullGridSolution() {
	var i, j, indexId;
	for (i = 0; i < 9; i++) {
		for (j = 0; j < 9; j++) {
			indexId = i + "" + j;
			document.getElementById(indexId).innerHTML = sudokuGrid[i][j];
		}
	}
}

function limparGrid() {
	var i, j, indexId;
	for (i = 0; i < 9; i++) {
		for (j = 0; j < 9; j++) {
			indexId = i + "" + j; 
			document.getElementById(indexId).innerHTML = "";
			sudokuGrid[i][j] = 0;
		}
	}
}

function createsNoConflicts(indexX,indexY,candidate) {
	var row, column, subGridLeftUpperRow, subGridLeftUpperColumn;
	
	// check row conflict
	for (column = 0; column < 9; column++) {
		if (sudokuGrid[indexX][column] == candidate) return false;
	}
	
	// check column conflict
	for (row = 0; row < 9; row++) {
		if (sudokuGrid[row][indexY] == candidate) return false;
	}
	
	// check sub-grid (3x3) conflict
	subGridLeftUpperRow = indexX - indexX % 3;
	subGridLeftUpperColumn = indexY - indexY % 3;
	 for (row = 0; row < 3; row++)
        for (column = 0; column < 3; column++)
			if (sudokuGrid[subGridLeftUpperRow + row][subGridLeftUpperColumn + column] == candidate) return false;
	
	return true;
}

async function resolverSudoku() {
	disableButtons();
	await sleep(100);
	
	grid = [];
	takesTooLongToExecute = 0;
	
	if (solveUsingBacktrack()) {
		drawWithPauses();
		showImidiateSolutionButton(1);
	}
	else {
		createNewGenerationMessage();
		enableGenerateButton();
		disableSolveButton();
	}
}

function mostrarSolucaoAgora() {
	mostraSolucao = 1;
	drawFullGridSolution();
	showImidiateSolutionButton(0);
	disableSolveButton();
}

function solveUsingBacktrack() {
	var positionOfEmptyGrid, positionOfCandidate, candidate, row, column;
	
	positionOfEmptyGrid = findEmptyGrid();
	if (positionOfEmptyGrid == "") return true;
	
	row = positionOfEmptyGrid.charAt(0);
	column = positionOfEmptyGrid.charAt(1);
	positionOfCandidate = positionOfEmptyGrid;
	
	for (candidate = 1; candidate <= 9; candidate++) {
		if (createsNoConflicts(row,column,candidate)) {
			sudokuGrid[row][column] = candidate;
			
			//drawCandidate(row, column);
			printarElemento = [positionOfCandidate, candidate];
			grid.push(printarElemento);
			
			if (solveUsingBacktrack())
				return true;
			sudokuGrid[row][column] = 0;
			
			// stop execution if grid gets too large
			// This means that it takes too much time to find 
			// an actual solution using this backtrack algorithm
			if (grid.length > 3000000) {
				takesTooLongToExecute = 1;
				return false;
			}
			
			//removeCandidateFromGrid(positionOfCandidate);
			printarElemento = [positionOfCandidate,"0"];
			grid.push(printarElemento);
		}
	}
	return false;
}

async function drawWithPauses() {
	var i, j, position, candidate, row, column;
	console.log(grid.length); // the bigger this is, the more time it will take to draw the solution
	
	mostraSolucao = 0;
	for (i = 0; i < grid.length; i++) {
			if (mostraSolucao) 
				break;
			printarElemento = grid[i];
			position = printarElemento[0];
			candidate = printarElemento[1];
			if (candidate == "0") 
				document.getElementById(position).innerHTML = ""; // remove candidate from grid
			else
				document.getElementById(position).innerHTML = candidate; // draw the candidate
			await sleep(800);
	}
	enableGenerateButton();
	disableSolveButton();
	showImidiateSolutionButton(0);
	emptyMessages();
}

function findEmptyGrid() {
	var i, j, position = "";
	for (i = 0; i < 9; i++)
		for (j = 0; j < 9; j++)
			if (sudokuGrid[i][j] == 0) {
				position = i + "" + j;
				return position;
			}
	return position;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createNewGenerationMessage() {
	if (takesTooLongToExecute) {
		console.log(grid.length);
		document.getElementById("messages").innerHTML = "Using a backtracking algorithm takes too long to find a solution - if there is one!" +
		" Try generating a new puzzle...";
	} else document.getElementById("messages").innerHTML = "This puzzle does not have a solution - try generating a new one!";
}

function showImidiateSolutionButton(show) {
	if (show) document.getElementsByClassName("solveButtonWithImidiateDrawing")[0].hidden = false;
	else document.getElementsByClassName("solveButtonWithImidiateDrawing")[0].hidden = true;
}

function emptyMessages() {
	document.getElementById("messages").innerHTML = "";
}

function disableButtons() {
	disableGenerateButton();
	disableSolveButton();
}

function disableGenerateButton() {
	document.getElementsByClassName("generateButton")[0].disabled = true;
}

function disableSolveButton() {
	document.getElementsByClassName("solveButton")[0].disabled = true;
}

function enableButtons() {
	enableGenerateButton();
	enableSolveButton();
}

function enableGenerateButton() {
	document.getElementsByClassName("generateButton")[0].disabled = false;
}

function enableSolveButton() {
	document.getElementsByClassName("solveButton")[0].disabled = false;
}

function drawCandidate(row, column) {
	var position = row + "" + column;
	document.getElementById(position).innerHTML = sudokuGrid[row][column];
}

function removeCandidateFromGrid(position) {
	document.getElementById(position).innerHTML = "";
}