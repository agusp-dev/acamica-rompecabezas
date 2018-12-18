// Arreglo que contiene las intrucciones del juego 
//instrucciones
var instructions = [
  "Utilizá las flechas de tu teclado para mover las piezas y formar la imagen objetivo", 
  "Tenés un límite de 20 movimientos y 5 minutos para resolver el rompecabezas.",
  "Presioná el botón 'Iniciar' para comenzar a jugar y 'Resetear' para volver a comenzar"];
// Arreglo para ir guardando los movimientos que se vayan realizando
//movimientos
var movements = [];

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
  //actualizarUltimoMovimiento
  updateLastMovement(movement);
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
function moveInDirection(direction) {
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
        //changePositionsGrid
        changePositions(emptyRow, emptyColumn, newEmptyRowItem, newEmptyColumnItem);
        updateEmptyPosition(newEmptyRowItem, newEmptyColumnItem);

      //COMPLETAR: Agregar la dirección del movimiento al arreglo de movimientos
      addMovement(direction);
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

  console.log("mixItems");
  console.log("count: " + count);

  if (count <= 0) {
    return;
  }
  
  var directions = [directionCodes.DOWN, directionCodes.UP,
      directionCodes.RIGHT, directionCodes.LEFT
    ];

  console.log("directions: " + directions);

  var direction = directions[Math.floor(Math.random() * directions.length)];

  console.log("direction: " + direction);

  moveInDirection(direction);

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

      moveInDirection(event.which);

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

/* Se inicia el rompecabezas mezclando las piezas 60 veces 
y ejecutando la función para que se capturen las teclas que 
presiona el usuario */
function start() {
    showInstructions(instructions);
    mixItems(30);
    shotKeys();
}

// Ejecutamos la función iniciar
start();