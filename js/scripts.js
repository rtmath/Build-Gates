//-----------Document Ready-----------

$(function() {

  InitializeBoard();
  gatesArray = [];

  $('#reset').click(function() {
    window.location.reload();
  })

  $('#createGates').click(function() {
    var level = new Level();
    createGates(level);
    loadGates();
    $(".gate").draggable( gateDraggableSettings );
    $(".grid").droppable( gridDroppableSettings );
    $("#gate-container").droppable( gridDroppableSettings );

    console.log("Gates Array: ");
    console.log(gatesArray);
    displayGateDebugInfo();
  })
})

//--------jQuery UI drag-drop settings----------

var gateDraggableSettings = {
    containment: $("#square-container"),
    revert: function(droppedObj) {
      if (!droppedObj) {
        droppable = $("#" + $(this).attr('value'));
        droppable.addClass("disabled");
        droppable.droppable("option", "disabled", true);
        updateCoordinates($(this));
        updateRelationships($(this));
        displayGateDebugInfo();
        return true;
      }
    },
    revertDuration: 200,
    start: function() {
      //If gate starts being moved from where it was dropped, remove that square's disabled class and 'disabled' attribute
      var droppable = $("#" + $(this).attr('value'));
      droppable.removeClass("disabled");
      droppable.droppable( "option", "disabled", false );
      severConnections($(this));
      displayGateDebugInfo();
    }
}

var gridDroppableSettings = {
  accept: '.ui-draggable',
  drop: dropGatePiece
}

function dropGatePiece(event, ui) {
  var draggable = $("#" + ui.draggable.attr('id'));
  var droppableId = $(this).attr('id');
  draggable.attr('value', droppableId);

  if ($(this).attr('id') != "gate-container") {
    ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
    $(this).droppable( "option", "disabled", true );
    $(this).addClass("disabled");
  }
  updateCoordinates(ui.draggable);
  updateRelationships(ui.draggable);
  displayGateDebugInfo();
}

//--------------Helper Functions-------------------------

//Regex for getElemCoords()
var onlyNumbers = /\d+/g;

function getElemCoords (idString) {
  if (typeof idString != "undefined" && idString != "gate-container") {
    arrayCoords = idString.match(onlyNumbers);
    return parseInt(arrayCoords[0] + arrayCoords[1]);
  }
}

function InitializeBoard() {
  for (var i = 0; i < 10; i++) {
    $('#square-container').append("<div id='row" + i + "' class='row'>");
    for (var j = 0; j < 10; j++) {
      $('#row' + i).append("<div id='" + i + "-" + j + "' class='grid'></div>")
    }
    $('#square-container').append("</div>");
  }
}



function addGate(gateObject) {
  gatesArray.push(gateObject);
}

function createGates(levelObject) {
  gatesArray = [];
  var initializeLevelString = "";

  for (var i = 0; i < levelObject.wires; i++) {
    addGate(new Gate("Wire", "wire" + (i+1)))
  }

  for (var i = 0; i < levelObject.ands; i++) {
    addGate(new Gate("AND", "and" + (i+1)))
  }

  for (var i = 0; i < levelObject.nots; i++) {
    addGate(new Gate("NOT", "not" + (i+1)))
  }

  for (var i = 0; i < levelObject.ors; i++) {
    addGate(new Gate("OR", "or" + (i+1)))
  }

  for (var i = 0; i < levelObject.xors; i++) {
    addGate(new Gate("XOR", "xor" + (i+1)))
  }

  for (var i = 0; i < levelObject.inputs; i++) {
    addGate(new Gate("Input", "input" + (i+1)))
  }

  for (var i = 0; i < levelObject.outputs; i++) {
    addGate(new Gate("Output", "output" + (i+1)))
  }
}

function loadGates() {
  var gatesToLoad = "";
  gatesArray.forEach(function(elem) {
    gatesToLoad +=
      "<div id='" + elem.id + "' class='gate'>" + elem.id + "</div>";
  })
  $('#gate-container').html(gatesToLoad);
}

function updateRelationships(htmlElem) {
  if (typeof htmlElem != "undefined") {
    var hElemValue = getElemCoords(htmlElem.attr('value'));
    var above = hElemValue - 10;
    var below = hElemValue + 10;
    var toLeft = hElemValue - 1;
    var toRight = hElemValue + 1;
    $('#gate-container').children().each(function(index) {
      var childValue = getElemCoords($(this).attr('value'));
      switch(childValue) {

        case above:
          var oIndex = findArrayId(htmlElem.attr('id'));
          var aIndex = findArrayId($(this).attr('id'));
          gatesArray[oIndex].InputLocation1 = gatesArray[aIndex];
          gatesArray[aIndex].output = gatesArray[oIndex];
          break;

        case below:
          var oIndex = findArrayId(htmlElem.attr('id'));
          var aIndex = findArrayId($(this).attr('id'));
          gatesArray[oIndex].InputLocation1 = gatesArray[aIndex];
          gatesArray[aIndex].output = gatesArray[oIndex];
          break;

        case toLeft:
          var oIndex = findArrayId(htmlElem.attr('id'));
          var aIndex = findArrayId($(this).attr('id'));
          gatesArray[oIndex].InputLocation1 = gatesArray[aIndex];
          gatesArray[aIndex].output = gatesArray[oIndex];
          break;

        case toRight:
          var oIndex = findArrayId(htmlElem.attr('id'));
          var aIndex = findArrayId($(this).attr('id'));
          gatesArray[aIndex].InputLocation1 = gatesArray[oIndex];
          gatesArray[oIndex].output = gatesArray[aIndex];
          break;
      }
    })
  }
}

function severConnections(htmlElem) {
  var currentGate = gatesArray[findArrayId(htmlElem.attr('id'))];
  if (currentGate.output) {
    currentGate.output.InputLocation1 = null;
    currentGate.output = null;
  }
  if (currentGate.InputLocation1) {
    currentGate.InputLocation1.output = null;
    currentGate.InputLocation1 = null;
  }
  if (currentGate.InputLocation2) {
    currentGate.InputLocation2.output = null;
    currentGate.InputLocation2 = null;
  }
}

function findArrayId(domId) {
  return gatesArray.findIndex((e => e.id === domId));
}

function updateCoordinates(htmlElem) {
  aIndex = findArrayId(htmlElem.attr('id'));
  gatesArray[aIndex].coordinates = htmlElem.attr('value');
}


//------------Debug----------------

function displayGateDebugInfo() {
  var toDisplay = "";
  for (var i = 0; i < gatesArray.length; i++) {
    var currentGate = gatesArray[i];
    toDisplay +=
      "<div class='panel-container'>" +
        "Name: <strong>" + currentGate.id + "</strong><br>" +
        "Coords: " + currentGate.coordinates + "<br>" +
        "Input1 From: " + ((currentGate.InputLocation1) ? "<strong style='color: red'>" + currentGate.InputLocation1.id + "</strong>" : "null") + "<br>" +
        "Input2 From: " + currentGate.InputLocation2 + "<br>" +
        "Output To: " + ((currentGate.output) ? "<strong style='color: red'>" + currentGate.output.id + "</strong>" : "null") + "<br>" +
        "State: " + ((currentGate.state) ? "On" : "Off") + "<br>" +
      "</div>";
  }
  $('#debug-panel').html(toDisplay);
}
