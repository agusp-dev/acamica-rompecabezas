// Arreglo que contiene las intrucciones del juego 
//instrucciones
var instructions = [
  "Utilizá las flechas de tu teclado para mover las piezas y formar la imagen objetivo", 
  "Tenés un límite de 20 movimientos y 5 minutos para resolver el rompecabezas.",
  "Presioná el botón 'Iniciar' para comenzar a jugar y 'Resetear' para volver a comenzar"];
// Arreglo para ir guardando los movimientos que se vayan realizando
//movimientos
var movements = [];

var timerId;

/**
 * Variable que determina estado del juego para que pueda ser iniciado y reiniciado a traves del boton de accion.
 */
var puzzleCurrentState;
var states = {
  LOADED: 0,
  STARTED: 1,
  ENDED: 2
}

var loseReason = {
  MOVEMENTS_LIMIT: 0,
  TIME_END: 1
}

/**
 * Valores por defecto del tablero
 */
var remainingMovements;
var remainingTime;

//Grilla ganadora utilizada para comparar si el usuario gano.
//grillaGanadora
var winnerGrid = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

// Representación de la grilla. Cada número representa a una pieza.
// El 9 es la posición vacía
//grilla
var originalGrid = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

/* Estas dos variables son para guardar la posición de la pieza vacía. 
Esta posición comienza siendo la [2, 2]*/
//filaVacia
var emptyRow = 2;
//columnaVacia
var emptyColumn = 2;

function initBoardValues() {
  remainingMovements = 20;
  remainingTime = 15;
}

function initMovementsArray() {
  movements = [];
}

/* Esta función deberá recorrer el arreglo de instrucciones pasado por parámetro. 
Cada elemento de este arreglo deberá ser mostrado en la lista con id 'lista-instrucciones'. 
Para eso deberás usar la función ya implementada mostrarInstruccionEnLista().
Podés ver su implementación en la ultima parte de este codigo. */
//mostrarInstrucciones
function showInstructions(instrucciones) {
    for (var i = 0; i < instrucciones.length; i++) {
      //mostrarInstruccionEnLista
      showInstructionsInList(instructions[i], "instructions-container");
    }
}

/* COMPLETAR: Crear función que agregue la última dirección al arreglo de movimientos
y utilice actualizarUltimoMovimiento para mostrarlo en pantalla */
//agregarMovimiento
function addMovement(movement) {
  movements.push(movement);
  updateLastMovement(movement);
}

function subtractMovement() {
  remainingMovements--;
  updateRemainingMovementsComponent();
}

function decrementSecond() {
  if (remainingTime > 0) {
    remainingTime--;
    updateRemainingTimeComponent();
  } else {
    stopTimer();
    lose(loseReason.TIME_END);
  }
  console.log(remainingTime);
}

function startTimer() {
  timerId = setInterval(decrementSecond, 1000);
}

function stopTimer() {
  clearInterval(timerId);
}

/* Esta función va a chequear si el Rompecabezas esta en la posicion ganadora. 
Existen diferentes formas de hacer este chequeo a partir de la grilla. */
//checkearSiGano
function checkIfWon() {
  for (var i = 0; i < originalGrid.length; i++) {
    for (var j = 0; j < originalGrid.length; j++) {
      if (originalGrid[i][j] != winnerGrid[i][j]) {
        return false;
      }
    }
  }
  return true;
}

// Implementar alguna forma de mostrar un cartel que avise que ganaste el juego
//mostrarCartelGanador
function showWinnerAlert() {
    alert("Rompecabezas finalizado");
    //todo crear un cartel mejor.
}

/* Función que intercambia dos posiciones en la grilla.
Pensar como intercambiar dos posiciones en un arreglo de arreglos. 
Para que tengas en cuenta:
Si queremos intercambiar las posiciones [1,2] con la [0, 0], si hacemos: 
arreglo[1][2] = arreglo[0][0];
arreglo[0][0] = arreglo[1][2];

En vez de intercambiar esos valores vamos a terminar teniendo en ambas posiciones el mismo valor.
Se te ocurre cómo solucionar esto con una variable temporal?
*/
//intercambiarPosicionesGrilla(filaPos1, columnaPos1, filaPos2, columnaPos2, pieza1, pieza2)
function changePositionsGrid(rowPos1, columnPos1, rowPos2, columnPos2, item1, item2) {
  originalGrid[rowPos2][columnPos2] = item1;
  originalGrid[rowPos1][columnPos1] = item2;
}

// Actualiza la posición de la pieza vacía
//actualizarPosicionVacia
function updateEmptyPosition(newRow, newColumn) {
    emptyRow = newRow;
    emptyColumn = newColumn;
}


// Para chequear si la posicón está dentro de la grilla.
//posicionValida
function correctPosition(row, column) {
  //Se presupone que la grilla es una matriz cuadrada
  if (row >= 0 && row < originalGrid.length && 
    column >= 0 && column < originalGrid[row].length) {
      return true;
  }
  return false;
}

/* Movimiento de fichas, en este caso la que se mueve es la blanca intercambiando su posición con otro elemento.
Las direcciones están dadas por números que representa: arriba (38), abajo (40), izquierda (37), derecha (39) */
//moverEnDireccion
function moveInDirection(direction, isUserMovement) {
  /*
  var nuevaFilaPiezaVacia;
  var nuevaColumnaPiezaVacia;
  */
  var newEmptyRowItem;
  var newEmptyColumnItem;

  // Mueve pieza hacia la abajo, reemplazandola con la blanca
  if (direction === directionCodes.DOWN) {
    newEmptyRowItem = emptyRow - 1;
    newEmptyColumnItem = emptyColumn;
  }
    
  // Mueve pieza hacia arriba, reemplazandola con la blanca
  else if (direction === directionCodes.UP) {
    newEmptyRowItem = emptyRow + 1;
    newEmptyColumnItem = emptyColumn;
  }
    
  // Mueve pieza hacia la derecha, reemplazandola con la blanca
  else if (direction === directionCodes.RIGHT) {
    newEmptyColumnItem = emptyColumn - 1;
    newEmptyRowItem = emptyRow;
  }
    
  // Mueve pieza hacia la izquierda, reemplazandola con la blanca
  else if (direction === directionCodes.LEFT) {
    newEmptyColumnItem = emptyColumn + 1;
    newEmptyRowItem = emptyRow;
  }

  /* A continuación se chequea si la nueva posición es válida, si lo es, se intercambia. 
  Para que esta parte del código funcione correctamente deberás haber implementado 
  las funciones posicionValida, intercambiarPosicionesGrilla y actualizarPosicionVacia */

    if (correctPosition(newEmptyRowItem, newEmptyColumnItem)) {

        //Se verifica que el maximo de movimientos no se haya alcanzado
        if (remainingMovements > 0) {

          changePositions(emptyRow, emptyColumn, newEmptyRowItem, newEmptyColumnItem);
          updateEmptyPosition(newEmptyRowItem, newEmptyColumnItem);
          addMovement(direction);

          if (isUserMovement) {
            subtractMovement();  
          }

        } else {
          lose(loseReason.MOVEMENTS_LIMIT);
        }
    }
}

function showMovementsLimitAlert() {
  alert("Límite máximo de movimientos alcanzado");
}

function showTimeEndAlert() {
  alert("Tiempo finalizado");
}

/**
 * Click en boton.
 * Dependiendo el estado actual del juego (puzzleCurrentState),
 * el boton permite iniciar y reiniciar el juego.
 */
function startButtonPressed() {
  switch (puzzleCurrentState) {
    case states.LOADED:
      start();
      break;
    case states.STARTED:
      reset();
      break;
    case states.ENDED:
      reset();
      break;
  }
}


//////////////////////////////////////////////////////////
////////A CONTINUACIÓN FUNCIONES YA IMPLEMENTADAS.////////
/////////NO TOCAR A MENOS QUE SEPAS LO QUE HACES//////////
//////////////////////////////////////////////////////////

/* Las funciones y variables que se encuentran a continuación ya están implementadas.
No hace falta que entiendas exactamente que es lo que hacen, ya que contienen
temas aún no vistos. De todas formas, cada una de ellas tiene un comentario
para que sepas que se está haciendo a grandes rasgos. NO LAS MODIFIQUES a menos que
entiendas perfectamente lo que estás haciendo! */

/* codigosDireccion es un objeto que te permite reemplazar
el uso de números confusos en tu código. Para referirte a la dir
izquierda, en vez de usar el número 37, ahora podés usar:
codigosDireccion.IZQUIERDA. Esto facilita mucho la lectura del código. */
/*
var codigosDireccion = {
    IZQUIERDA: 37,
    ARRIBA: 38,
    DERECHA: 39,
    ABAJO: 40
}
*/
var directionCodes = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
}

/* Funcion que realiza el intercambio logico (en la grilla) y ademas actualiza
el intercambio en la pantalla (DOM). Para que funcione debera estar implementada
la funcion intercambiarPosicionesGrilla() */
//intercambiarPosiciones
function changePositions(row1, column1, row2, column2) {
  // Intercambio posiciones en la grilla
  var item1 = originalGrid[row1][column1];
  var item2 = originalGrid[row2][column2];

  changePositionsGrid(row1, column1, row2, column2, item1, item2);
  changePositionsDOM('item' + item1, 'item' + item2);
}

/* Intercambio de posiciones de los elementos del DOM que representan
las fichas en la pantalla */
//intercambiarPosicionesDOM
function changePositionsDOM(itemId1, itemId2) {
  // Intercambio posiciones en el DOM
  /*
  var elementoPieza1 = document.getElementById(idPieza1);
  var elementoPieza2 = document.getElementById(idPieza2);
  */
 var item1 = document.getElementById(itemId1);
 var item2 = document.getElementById(itemId2);

  //padre
  var parent = item1.parentNode;

  /*
  var clonElemento1 = elementoPieza1.cloneNode(true);
  var clonElemento2 = elementoPieza2.cloneNode(true);
  */
 var itemClon1 = item1.cloneNode(true);
 var itemClon2 = item2.cloneNode(true);

 /*
  padre.replaceChild(clonElemento1, elementoPieza2);
  padre.replaceChild(clonElemento2, elementoPieza1);
  */

 parent.replaceChild(itemClon1, item2);
 parent.replaceChild(itemClon2, item1);

}

/* Actualiza la representación visual del último movimiento 
en la pantalla, representado con una flecha. */
//actualizarUltimoMovimiento
function updateLastMovement(direction) {
  lastMov = document.getElementById('last-movement');
  switch (direction) {
    case directionCodes.UP:
      lastMov.textContent = '↑';
      break;
    case directionCodes.DOWN:
      lastMov.textContent = '↓';
      break;
    case directionCodes.RIGHT:
      lastMov.textContent = '→';
      break;
    case directionCodes.LEFT:
      lastMov.textContent = '←';
      break;
  }
}

/* Esta función permite agregar una instrucción a la lista
con idLista. Se crea un elemento li dinámicamente con el texto 
pasado con el parámetro "instrucción". */
//mostrarInstruccionEnLista
function showInstructionsInList(instruction, listId) {
  var ul = document.getElementById(listId);
  var li = document.createElement("li");
  li.textContent = instruction;
  ul.appendChild(li);
}

/* Función que mezcla las piezas del tablero una cantidad de veces dada.
Se calcula una posición aleatoria y se mueve en esa dirección. De esta forma
se mezclará todo el tablero. */
//mezclarPiezas
function mixItems(count) {

  if (count <= 0) {
    return;
  }
  
  var directions = [directionCodes.DOWN, directionCodes.UP,
      directionCodes.RIGHT, directionCodes.LEFT
    ];

  var direction = directions[Math.floor(Math.random() * directions.length)];

  moveInDirection(direction, false);

  setTimeout(function() {
      mixItems(count - 1);
    }, 100);
}

/* capturarTeclas: Esta función captura las teclas presionadas por el usuario. Javascript
permite detectar eventos, por ejemplo, cuando una tecla es presionada y en 
base a eso hacer algo. No es necesario que entiendas como funciona esto ahora, 
en el futuro ya lo vas a aprender. Por ahora, sólo hay que entender que cuando
se toca una tecla se hace algo en respuesta, en este caso, un movimiento */
//capturarTeclas
function shotKeys() {
  document.body.onkeydown = (function(event) {
    if (event.which === directionCodes.DOWN ||
      event.which === directionCodes.UP ||
      event.which === directionCodes.RIGHT ||
      event.which === directionCodes.LEFT) {

        if (puzzleCurrentState != states.ENDED) {
          moveInDirection(event.which, true);
        }

        var won = checkIfWon();
        if (won) {
          setTimeout(function() {
              showWinnerAlert();
              }, 500);
            }
            event.preventDefault();
        }
    })
}

function stopShotKeys() {
  document.body.onkeydown = null;
}















function load() {
  initBoardValues();
  updateRemainingMovementsComponent();
  updateRemainingTimeComponent();
  showInstructions(instructions);
  changePuzzleCurrentState(states.LOADED);
}

function start() {
  startTimer();
  mixItems(30);
  shotKeys();
  changePuzzleCurrentState(states.STARTED);
}

function reset() {
  stopShotKeys();
  stopTimer();
  initBoardValues();
  resetMovements();
  initMovementsArray();
  updateRemainingMovementsComponent();
  updateRemainingTimeComponent();
  changePuzzleCurrentState(states.LOADED);
}

/**
 * Funcion ejecutada cuando el usuario pierde.
 * 0 -> 
 */
function lose(reason) {
  switch (reason) {
    case loseReason.MOVEMENTS_LIMIT:
      showMovementsLimitAlert();
      break;
    case loseReason.TIME_END:
      showTimeEndAlert();
      break;
  }
  changePuzzleCurrentState(states.ENDED);
}

function win() {
  //todo
}









function updateRemainingMovementsComponent() {
  var remainingMovementsComponent = document.getElementById('remaining-movements');
  remainingMovementsComponent.innerHTML = remainingMovements;
}

function updateRemainingTimeComponent() {
  var remainingTimeComponent = document.getElementById('remaining-time');
  remainingTimeComponent.innerHTML = remainingTime;
}


function changePuzzleCurrentState(newState) {
  puzzleCurrentState = newState;
  switch (newState) {
    case states.LOADED:
      updateButtonText("Iniciar");
      break;
    case states.STARTED:
      updateButtonText("Reiniciar");
      break;
    case states.ENDED:
      updateButtonText("Volver a Jugar");
      break;
  }
}

function updateButtonText(newText) {
  var button = document.getElementById('button-start');
  button.value = newText;
  button.innerHTML = newText;
}


load();




/**
 * Se vuelven atras todos los movimientos.
 */
function resetMovements() {
  if (movements.length > 0) {
    for (var m = movements.length; m > 0; m--) {
      moveBack(movements[m-1]);
    }
  }
}

function moveBack(mov) {
    var mBack;
    switch (mov) {
      case directionCodes.UP:
        mBack = directionCodes.DOWN;
        break;
      case directionCodes.RIGHT:
        mBack = directionCodes.LEFT;
        break;
      case directionCodes.DOWN:
        mBack = directionCodes.UP;
        break;
      case directionCodes.LEFT:
        mBack = directionCodes.RIGHT;
        break;
      default:
        return;
    }

    moveInDirection(mBack, false);
}





/**
 * Codigo comentado q podria ser util
 */

 /*
function orderOriginalGrid() {
  //originalGrid = winnerGrid.slice;
  for (var i = 0; i < winnerGrid.length; i++) {
    for (var j = 0; j < winnerGrid[i].length; j++) {
      originalGrid[i][j] = winnerGrid[i][j];
    }
  }
}
*/