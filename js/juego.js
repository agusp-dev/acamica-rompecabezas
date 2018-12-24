
/**
 * Estados del juego.
 * 
 * 0 --> Cargado. Estado en el cual las variables son reestablecidas a sus valores iniciales,
 *                para que el juego comience a iniciar nuevamente (al presionar sobre el boton 'iniciar').
 * 
 * 1 --> Iniciado. Estado al que se pasa luego de presionar sobre el boton 'Iniciar'. En este estado
 *                 el juego se esta llevando a cabo.
 * 
 * 2 --> Detenido. Estado al que se llega luego de haber ganado o perdido.
 */
var states = {
  LOADED: 0,
  STARTED: 1,
  ENDED: 2
}

/**
 * Razones de haber perdido el juego.
 * 
 * 0 --> Limite maximo de movimientos alcanzado.
 * 1 --> Tiempo limite alcanzado.
 */
var loseReason = {
  MOVEMENTS_LIMIT: 0,
  TIME_END: 1
}

//Cantidad maxima de movimientos.
var max_movements_acount = 20;
//Cantidad maxima de segundos.
var timer_count = 30;

/* codigosDireccion es un objeto que te permite reemplazar
el uso de números confusos en tu código. Para referirte a la dir
izquierda, en vez de usar el número 37, ahora podés usar:
codigosDireccion.IZQUIERDA. Esto facilita mucho la lectura del código. 
*/
var directionCodes = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
}

//Limite de movimientos.
var MAX_MOVEMENTS = 20;
var MAX_TIME = 120;

//Arreglo que contiene las intrucciones del juego 
var instructions = [
  "Utilizá las flechas de tu teclado para mover las piezas y formar la imagen objetivo.", 
  "Tenés un límite de " + MAX_MOVEMENTS + " movimientos y " + MAX_TIME + " segundos para resolver el rompecabezas.",
  "Presioná el botón 'Iniciar' para comenzar a jugar y 'Reiniciar' para volver a comenzar."];

// Arreglo para ir guardando los movimientos que se vayan realizando
var movements = [];

//Matriz ganadora utilizada para comparar si el usuario gano.
var winnerGrid = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

/**
 * Representación de la grilla. Cada número representa a una pieza.
 * El 9 es la posición vacía.
 */
var originalGrid = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

/**
 * Estas dos variables son para guardar la posición de la pieza vacía. 
 * Esta posición comienza siendo la [2, 2]
*/
var emptyRow = 2;
var emptyColumn = 2;

//Id de timer (setInterval). Se utiliza para poder detener el timer.
var timerId;

//Estado actual del juego.
var puzzleCurrentState;

//Cantidad de movimientos restantes.
var remainingMovements;
//Tiempo restante.
var remainingTime;


//Carga variables utilizadas en el tablero (panel derecho).
function loadInitialBoardData() {
  remainingMovements = MAX_MOVEMENTS;
  remainingTime = MAX_TIME;
}

//Inicializa el array de movimientos.
function initMovementsArray() {
  movements = [];
}

/* Esta función deberá recorrer el arreglo de instrucciones pasado por parámetro. 
Cada elemento de este arreglo deberá ser mostrado en la lista con id 'lista-instrucciones'. 
Para eso deberás usar la función ya implementada mostrarInstruccionEnLista().
Podés ver su implementación en la ultima parte de este codigo. */
function showInstructions(instructions) {
    for (var i = 0; i < instructions.length; i++) {
      showInstructionsInList(instructions[i], "instructions-container");
    }
}

/* COMPLETAR: Crear función que agregue la última dirección al arreglo de movimientos
y utilice actualizarUltimoMovimiento para mostrarlo en pantalla */
function addMovement(movement) {
  movements.push(movement);
  updateLastMovement(movement);
}

//Elimina movimiento del array de movimientos y actualiza componente visual.
function removeMovement() {
  remainingMovements--;
  updateRemainingMovementsComponent();
}

//Inicia timer. Este timer permite llevar una cuenta regresiva. Si MAX_TIME llega a 0, el jugador pierde.
function startTimer() {
  timerId = setInterval(updateTimer, 1000);
}

//Detiene timer.
function stopTimer() {
  clearInterval(timerId);
}

/**
 * Esta funcion se ejecuta cada un segundo.
 * Verifica si el juego ha finalizado (puzzleCurrentState). En este caso, solo detiene el timer y retorna.
 * Verifica si el contador llego a 0. En este caso, indica que el juego a finalizado y el usuario ha perdido. Detiene el timer y retorna.
 * En el caso de que estas dos validaciones sean falsas, resta un segundo a remainingTime y actualiza el componente visual.
 */
function updateTimer() {

  if (puzzleCurrentState == states.ENDED) {
    stopTimer();
    return;
  }

  if (remainingTime <= 0) {
    userLost(loseReason.TIME_END);
    return;
  }

  remainingTime--;
  updateRemainingTimeComponent();
}

/**
 * Click en boton de inicio.
 * 
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

/* capturarTeclas: Esta función captura las teclas presionadas por el usuario. Javascript
permite detectar eventos, por ejemplo, cuando una tecla es presionada y en 
base a eso hacer algo. No es necesario que entiendas como funciona esto ahora, 
en el futuro ya lo vas a aprender. Por ahora, sólo hay que entender que cuando
se toca una tecla se hace algo en respuesta, en este caso, un movimiento 
*/
function shotKeys() {
  document.body.onkeydown = (function(event) {
    if (event.which === directionCodes.DOWN ||
      event.which === directionCodes.UP ||
      event.which === directionCodes.RIGHT ||
      event.which === directionCodes.LEFT) {

       moveInDirection(event.which, true);

        var won = checkIfWon();
        if (won) {
          setTimeout(function() {
              userWon();
              }, 500);
            }
            event.preventDefault();
        }
    })
}

//Detiene la escucha de teclas. Se utiliza cuando el usuario gano o perdio.
function stopShotKeys() {
  document.body.onkeydown = null;
}


/**
 * VALIDACIONES ------------------------------------------------------------------------------------------------------------
 */

/* Esta función va a chequear si el Rompecabezas esta en la posicion ganadora. 
Existen diferentes formas de hacer este chequeo a partir de la grilla.
*/
function checkIfWon() {
  for (var i = 0; i < originalGrid.length; i++) {
    for (var j = 0; j < originalGrid.length; j++) {
      if (originalGrid[i][j] !== winnerGrid[i][j]) {
        return false;
      }
    }
  }
  return true;
}

// Para chequear si la posicón está dentro de la grilla.
function correctPosition(row, column) {
  //Se presupone que la grilla es una matriz cuadrada
  if (row >= 0 && row < originalGrid.length && 
    column >= 0 && column < originalGrid[row].length) {
      return true;
  }
  return false;
}


/**
 * Funcion de partida.
 */
load();

/**
 * FUNCIONES DE ESTADO ------------------------------------------------------------------------------------------------------
 */

/**
 * Funcion que se ejecuta cuando se carga el juego.
 * 
 * Carga variables iniciales del tablero.
 * Actualiza UI de tablero.
 * Muestra instrucciones en UI.
 * Cambia estado actual de juego a LOADED.
 */
function load() {
  loadInitialBoardData();
  updateRemainingMovementsComponent();
  updateRemainingTimeComponent();
  showInstructions(instructions);
  changePuzzleCurrentState(states.LOADED);
}

/**
 * Funcion que se ejecuta para dar inicio al juego.
 * 
 * Mezcla piezas.
 * Inicia escucha de teclas.
 * Inicia timer.
 * Cambia estado actual de juego a STARTED.
 */
function start() {
  mixItems(3);
  shotKeys();
  startTimer();
  changePuzzleCurrentState(states.STARTED);
}

/**
 * Funcion que se ejecuta para reiniciar el juego. 
 * Esta funcion puede ser ejecutada en dos estados:
 * a) Cuando el juego se encuentra activo (state: STARTED).
 * b) Cuando el juego se encuentra finalizado (state: ENDED).
 * 
 * Detiene escucha de teclas.
 * Detiene timer.
 * Resetea variables iniciales de tablero.
 * Vuelve atras todos los movimientos que se hicieron (tanto en la mezcla inicial de piezas como los hechos por el usuario).
 * Resetea array de movimientos.
 * Actualiza UI de movimientos pendientes.
 * Actualiza UI de tiempo pendiente.
 * Resetea componente de ultimo movimiento.
 * Cambia estado actual del juego a LOADED.
 */
function reset() {
  stopShotKeys();
  stopTimer();
  loadInitialBoardData();
  resetMovements();
  initMovementsArray();
  updateRemainingMovementsComponent();
  updateRemainingTimeComponent();
  initLastMovement();
  changePuzzleCurrentState(states.LOADED);
}

/**
 * Funcion que modifica el estado actual de juego.
 * Tambien modifica el texto del boton de accion, dependiendo el estado actual de juego.
 */
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


/**
 * JUEGO FINALIZADO ---------------------------------------------------------------------------------------------------
 */

/**
 * Funcion ejecutada cuando el usuario pierde.
 * 
 * Detiene timer.
 * Detiene escuchas de teclas.
 * Cambia estado actual de juego a ENDED.
 * Muestra mensaje indicando razon de haber perdido.
 */
function userLost(reason) {

  stopTimer();
  stopShotKeys();
  changePuzzleCurrentState(states.ENDED);

  switch (reason) {
    case loseReason.MOVEMENTS_LIMIT:
    showMovementsLimitDialog();
      break;
    case loseReason.TIME_END:
      showTimeEndAlert();
      break;
  }
}

/**
 * Funcion ejecutada cuando el usuario gana.
 * 
 * Detiene timer.
 * Detiene escuchas de teclas.
 * Cambia estado actual de juego a ENDED.
 * Muestra mensaje de usuario ganador.
 */
function userWon() {
  stopTimer();
  stopShotKeys();
  changePuzzleCurrentState(states.ENDED);
  showWinnerAlert();
}


/**
 * Actualizacion de UI ----------------------------------------------------------------------------------------------------------
 */

 //Actualiza movimientos restantes en la UI. 
function updateRemainingMovementsComponent() {
  var remainingMovementsComponent = document.getElementById('remaining-movements');
  remainingMovementsComponent.textContent = remainingMovements;
}

//Actualiza tiempo restante en la UI.
function updateRemainingTimeComponent() {
  var remainingTimeComponent = document.getElementById('remaining-time');
  remainingTimeComponent.textContent = remainingTime;
}

/**
 * Actualiza texto de boton de accion.
 */
function updateButtonText(newText) {
  var button = document.getElementById('button-start');
  button.value = newText;
  button.textContent = newText;
}

function initLastMovement() {
  lastMov = document.getElementById('last-movement');
  lastMov.textContent = '-';
}

/* Actualiza la representación visual del último movimiento 
en la pantalla, representado con una flecha. 
*/
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
function showInstructionsInList(instruction, listId) {
  var ul = document.getElementById(listId);
  var li = document.createElement("li");
  li.textContent = instruction;
  ul.appendChild(li);
}


/**
 * Alertas - Dialogos -----------------------------------------------------------------------------------------------------------
 */

function showMovementsLimitDialog() {
  var message = "Alcanzaste el límite máximo de movimientos permitidos.";
  showLoseAlert(message);
}

function showTimeEndAlert() {
  var message = "Tu tiempo se agotó.";
  showLoseAlert(message);
}

function showLoseAlert(message) {
  var bColor = "rgba(238, 191, 191, 0.9)";
  var fColor = "#ef5350";
  var img = "images/lose.png";
  var title = "¡PERDISTE!";
  showCustomAlert(false, bColor, fColor, img, title, message);
}

function showWinnerAlert() {
  var bColor = "rgba(186, 230, 225, 0.9)";
  var fColor = "#009688";
  var img = "images/win.png";
  var title = "¡GANASTE!";
  showCustomAlert(true, bColor, fColor, img, title, null);
}

function showCustomAlert(won, backgroundColor, fontColor, image, title, message) {
  var domAlertContent = document.getElementById('puzzle-result-dialog');
  var domAlert = document.getElementById('alert-content');
  var domImg = document.getElementById('result-img');
  var domTitle = document.getElementById('result-title');
  var domMsg = document.getElementById('result-msg');
  var domClose = document.getElementById('button-close');
  domImg.src = image;
  domTitle.textContent = title;
  domTitle.style.color = fontColor;

  //Hover
  domClose.onmouseover = function() {
    domClose.style.color = fontColor;
  }
  domClose.onmouseout = function() {
    domClose.style.color = "#fff";
  }

  if (won) {
    domMsg.style.display = "none";
  } else {
    domMsg.textContent = message;
    domMsg.style.color = fontColor;
    domMsg.style.display = "block";
  }
  
  domAlert.style.backgroundColor = backgroundColor;
  domAlertContent.style.display = "block";

  //Se deshabilita el boton de inicio de juego.
  disableStartButton();
}

/**
 *  Se habilita boton de inicio de juego.
 */
function enableStartButton() {
  var button = document.getElementById('button-start');
  button.disabled = false;
}

 /**
  * Se deshabilita boton de inicio de juego.
  */
 function disableStartButton() {
  var button = document.getElementById('button-start');
  button.disabled = true;
 }

 /**
  * Close dialog button pressed.
  */
 function closeDialogButtonPressed() {
  var domAlertContent = document.getElementById('puzzle-result-dialog');
  domAlertContent.style.display = "none";

  //Se habilita nuevamente el boton de inicio de juego.
  enableStartButton();
}


/**
 * FUNCIONAMIENTO DEL JUEGO -----------------------------------------------------------------------------------------------------------
 */

/* Función que intercambia dos posiciones en la grilla.
Pensar como intercambiar dos posiciones en un arreglo de arreglos. 
Para que tengas en cuenta:
Si queremos intercambiar las posiciones [1,2] con la [0, 0], si hacemos: 
arreglo[1][2] = arreglo[0][0];
arreglo[0][0] = arreglo[1][2];

En vez de intercambiar esos valores vamos a terminar teniendo en ambas posiciones el mismo valor.
Se te ocurre cómo solucionar esto con una variable temporal?
*/
function changePositionsGrid(rowPos1, columnPos1, rowPos2, columnPos2, item1, item2) {
  originalGrid[rowPos2][columnPos2] = item1;
  originalGrid[rowPos1][columnPos1] = item2;
}

//Actualiza la posición de la pieza vacía
function updateEmptyPosition(newRow, newColumn) {
    emptyRow = newRow;
    emptyColumn = newColumn;
}



/* Movimiento de fichas, en este caso la que se mueve es la blanca intercambiando su posición con otro elemento.
Las direcciones están dadas por números que representa: arriba (38), abajo (40), izquierda (37), derecha (39) 
*/
function moveInDirection(direction, isUserMovement) {
  
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
  las funciones posicionValida, intercambiarPosicionesGrilla y actualizarPosicionVacia 
  */
    if (correctPosition(newEmptyRowItem, newEmptyColumnItem)) {

        //Se verifica que el maximo de movimientos no se haya alcanzado
        if (remainingMovements > 0) {

          changePositions(emptyRow, emptyColumn, newEmptyRowItem, newEmptyColumnItem);
          updateEmptyPosition(newEmptyRowItem, newEmptyColumnItem);
          addMovement(direction);

          if (isUserMovement) {
            removeMovement();  
          }

        } else {
          userLost(loseReason.MOVEMENTS_LIMIT);
        }
    }
}

/* Funcion que realiza el intercambio logico (en la grilla) y ademas actualiza
el intercambio en la pantalla (DOM). Para que funcione debera estar implementada
la funcion intercambiarPosicionesGrilla() */
function changePositions(row1, column1, row2, column2) {
  var item1 = originalGrid[row1][column1];
  var item2 = originalGrid[row2][column2];

  changePositionsGrid(row1, column1, row2, column2, item1, item2);
  changePositionsDOM('item' + item1, 'item' + item2);
}

/* Intercambio de posiciones de los elementos del DOM que representan
las fichas en la pantalla 
*/
function changePositionsDOM(itemId1, itemId2) {

  // Intercambio posiciones en el DOM
  var item1 = document.getElementById(itemId1);
  var item2 = document.getElementById(itemId2);

  var parent = item1.parentNode;

  var itemClon1 = item1.cloneNode(true);
  var itemClon2 = item2.cloneNode(true);

  parent.replaceChild(itemClon1, item2);
  parent.replaceChild(itemClon2, item1);
}

/* Función que mezcla las piezas del tablero una cantidad de veces dada.
Se calcula una posición aleatoria y se mueve en esa dirección. De esta forma
se mezclará todo el tablero. 
*/
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
