//-----------Document Ready-----------

$(function() {

  InitializeBoard();
  gatesArray = [];

  $('#reset').click(function() {
    window.location.reload();
  })

  $('#createGates').click(function() {
    createGates();
    loadGates();
    $(".gate").draggable( {
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
    });
    $(".grid").droppable( {
      accept: '.ui-draggable',
      drop: dropGatePiece
    });
    $("#gate-container").droppable( {
      accept: '.ui-draggable',
      drop: dropGatePiece
    });

    console.log("Gates Array: ");
    console.log(gatesArray);
    displayGateDebugInfo();
  })
})




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

function addGate(gateObject) {
  gatesArray.push(gateObject);
}

function createGates() {
  gatesArray = [];
  addGate(new Gate("Wire", "wire1"));
  addGate(new Gate("Wire", "wire2"));
  addGate(new Gate("Wire", "wire3"));
  addGate(new Gate("AND", "and1"));
  addGate(new Gate("OR", "or1"));
  addGate(new Gate("Input", "input1"));
  addGate(new Gate("Input", "input2"));
  addGate(new Gate("Output", "output1"));
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
    toDisplay +=
      "<div class='panel-container'>" +
        "Name: <strong>" + gatesArray[i].id + "</strong><br>" +
        "Coords: " + gatesArray[i].coordinates + "<br>" +
        "Input1 From: " + ((gatesArray[i].InputLocation1) ? "<strong style='color: red'>" + gatesArray[i].InputLocation1.id + "</strong>" : "null") + "<br>" +
        "Input2 From: " + gatesArray[i].InputLocation2 + "<br>" +
        "Output To: " + ((gatesArray[i].output) ? "<strong style='color: red'>" + gatesArray[i].output.id + "</strong>" : "null") + "<br>" +
        "State: " + ((gatesArray[i].state) ? "On" : "Off") + "<br>" +
      "</div>";
  }
  $('#debug-panel').html(toDisplay);
}
