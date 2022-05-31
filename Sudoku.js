var sudokuGrid;
var grid, printarElemento, mostraSolucao;

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
	let texto = await arquivo.text();
	
	limparGrid();

	texto = texto.split(/;|\n+/g);
	let k = 0;
	for (i = 0; i < 9; i++) {
		for (j = 0; j < 9; j++) {
			sudokuGrid[i][j] = texto[k];
			k++;
		}
	}
	printarGrid();
}

function printarGrid() {
	habilitarBotoes();
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

function printarGridSolucaoCompleta() {
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

function naoTemConflito(indexX,indexY,candidato) {
	var linha, coluna, subGridLinhaSuperiorEsquerda, subGridColunaSuperiorEsquerda;
	
	// check row conflict
	for (coluna = 0; coluna < 9; coluna++) {
		if (sudokuGrid[indexX][coluna] == candidato) return false;
	}
	
	// check column conflict
	for (linha = 0; linha < 9; linha++) {
		if (sudokuGrid[linha][indexY] == candidato) return false;
	}
	
	// check sub-grid (3x3) conflict
	subGridLinhaSuperiorEsquerda = indexX - indexX % 3;
	subGridColunaSuperiorEsquerda = indexY - indexY % 3;
	 for (linha = 0; linha < 3; linha++)
        for (coluna = 0; coluna < 3; coluna++)
			if (sudokuGrid[subGridLinhaSuperiorEsquerda + linha][subGridColunaSuperiorEsquerda + coluna] == candidato) return false;
	
	return true;
}

async function resolverSudoku() {
	desabilitarBotoes();
	await sleep(100);
	
	grid = [];
	
	if (resolverComForcaBruta()) {
		printarPausadamente();
		mostrarBotaoResolverImediatamente(1);
	}
	else {
		habilitarBotaoUpload();
		desabilitarBotaoResolver();
	}
}

function mostrarSolucaoAgora() {
	mostraSolucao = 1;
	printarGridSolucaoCompleta();
	mostrarBotaoResolverImediatamente(0);
	desabilitarBotaoResolver();
}

function resolverComForcaBruta() {
	var posicaoDoEspacoVazio, posicaoDoCandidato, candidato, linha, coluna;
	
	posicaoDoEspacoVazio = buscarEspacoVazio();
	if (posicaoDoEspacoVazio == "") return true;
	
	linha = posicaoDoEspacoVazio.charAt(0);
	coluna = posicaoDoEspacoVazio.charAt(1);
	posicaoDoCandidato = posicaoDoEspacoVazio;
	
	for (candidato = 1; candidato <= 9; candidato++) {
		if (naoTemConflito(linha,coluna,candidato)) {
			sudokuGrid[linha][coluna] = candidato;
			
			printarElemento = [posicaoDoCandidato, candidato];
			grid.push(printarElemento);
			
			if (resolverComForcaBruta())
				return true;
			sudokuGrid[linha][coluna] = 0;
			
			printarElemento = [posicaoDoCandidato,"0"];
			grid.push(printarElemento);
		}
	}
	return false;
}

async function printarPausadamente() {
	var i, j, posicao, candidato;
	console.log(grid.length); // the bigger this is, the more time it will take to draw the solution
	
	mostraSolucao = 0;
	for (i = 0; i < grid.length; i++) {
			if (mostraSolucao) 
				break;
			printarElemento = grid[i];
			posicao = printarElemento[0];
			candidato = printarElemento[1];
			if (candidato == "0") 
				document.getElementById(candidato).innerHTML = ""; // remove candidate from grid
			else
				document.getElementById(posicao).innerHTML = candidato; // draw the candidate
			await sleep(800);
	}
	habilitarBotaoUpload();
	desabilitarBotaoResolver();
	mostrarBotaoResolverImediatamente(0);
}

function buscarEspacoVazio() {
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

function mostrarBotaoResolverImediatamente(mostrar) {
	if (mostrar) document.getElementsByClassName("solveButtonWithImidiateDrawing")[0].hidden = false;
	else document.getElementsByClassName("solveButtonWithImidiateDrawing")[0].hidden = true;
}

function desabilitarBotoes() {
	desabilitarBotaoResolver();
	desabilitarBotaoUpload();
}

function desabilitarBotaoUpload() {
	document.getElementsByClassName("generateButton")[0].disabled = true;
}

function desabilitarBotaoResolver() {
	document.getElementsByClassName("solveButton")[0].disabled = true;
}

function habilitarBotoes() {
	habilitarBotaoResolver();
	habilitarBotaoUpload();
}

function habilitarBotaoUpload() {
	document.getElementsByClassName("generateButton")[0].disabled = false;
}

function habilitarBotaoResolver() {
	document.getElementsByClassName("solveButton")[0].disabled = false;
}
