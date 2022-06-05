let sudokuGrid, grid, printarElemento, mostraSolucao, contadorErros = 0;

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

async function subirDados(arquivo){
	let texto = await arquivo.text();
	
	limparMensagem() 
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
	let i, j, indexId;
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
	let i, j, indexId;
	for (i = 0; i < 9; i++) {
		for (j = 0; j < 9; j++) {
			indexId = i + "" + j;
			document.getElementById(indexId).innerHTML = sudokuGrid[i][j];
		}
	}
}

function limparGrid() {
	let i, j, indexId;
	for (i = 0; i < 9; i++) {
		for (j = 0; j < 9; j++) {
			indexId = i + "" + j; 
			document.getElementById(indexId).innerHTML = "";
			sudokuGrid[i][j] = 0;
		}
	}
}

function naoTemConflito(indexX,indexY,candidato) {
	let linha, coluna, inicioQuadranteLinha, inicioQuadranteColuna;
	
	for (coluna = 0; coluna < 9; coluna++) {
		if (sudokuGrid[indexX][coluna] == candidato) return false;
	}
	
	for (linha = 0; linha < 9; linha++) {
		if (sudokuGrid[linha][indexY] == candidato) return false;
	}
	
	inicioQuadranteLinha = indexX - indexX % 3;
	inicioQuadranteColuna = indexY - indexY % 3;
	 for (linha = 0; linha < 3; linha++)
        for (coluna = 0; coluna < 3; coluna++)
			if (sudokuGrid[inicioQuadranteLinha + linha][inicioQuadranteColuna + coluna] == candidato) return false;
	
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
	let posicaoDoEspacoVazio, posicaoDoCandidato, candidato, linha, coluna;
	
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
	contadorErros++;
	return false;
}

async function printarPausadamente() {
	let i, j, posicao, candidato;
	
	mostraSolucao = 0;
	for (i = 0; i < grid.length; i++) {
			if (mostraSolucao) 
				break;
			printarElemento = grid[i];
			posicao = printarElemento[0];
			candidato = printarElemento[1];
			if (candidato == "0") 
				document.getElementById(posicao).innerHTML = "";
			else
				document.getElementById(posicao).innerHTML = candidato;
			await sleep(800);
	}
	printarMensagem();
	habilitarBotaoUpload();
	desabilitarBotaoResolver();
	mostrarBotaoResolverImediatamente(0);
}

function buscarEspacoVazio() {
	let i, j, position = "";
	for (i = 0; i < 9; i++)
		for (j = 0; j < 9; j++)
			if (sudokuGrid[i][j] == 0) {
				position = i + "" + j;
				return position;
			}
	return position;
}

function printarMensagem() {
	document.getElementById("mensagens").innerHTML = "Quantidade de erros: " + contadorErros;
}

function limparMensagem() {
	contadorErros = 0;
	document.getElementById("mensagens").innerHTML = "";
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function mostrarBotaoResolverImediatamente(mostrar) {
	if (mostrar) document.getElementsByClassName("botaoResolverRapido")[0].disabled = false;
	else document.getElementsByClassName("botaoResolverRapido")[0].disabled = true;
}

function desabilitarBotoes() {
	desabilitarBotaoResolver();
	desabilitarBotaoUpload();
}

function limparInputFile() {
	document.getElementById("uploadArquivo").value = "";
}

function desabilitarBotaoUpload() {
	document.getElementsByClassName("botaoUpload")[0].disabled = true;
	limparInputFile();
}

function desabilitarBotaoResolver() {
	document.getElementsByClassName("botaoResolver")[0].disabled = true;
}

function habilitarBotoes() {
	habilitarBotaoResolver();
	habilitarBotaoUpload();
}

function habilitarBotaoUpload() {
	document.getElementsByClassName("botaoUpload")[0].disabled = false;
}

function habilitarBotaoResolver() {
	document.getElementsByClassName("botaoResolver")[0].disabled = false;
}
