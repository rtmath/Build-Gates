$(function() {

  InitializeBoard();

  $(".gate").draggable( {
    containment: $("#square-container"),
    revert: function(droppedObj) {
      if (!droppedObj) {
        droppable = $("#" + $(this).attr('value'));
        droppable.addClass("disabled");
        droppable.droppable("option", "disabled", true);
        return true;
      }
    },
    revertDuration: 200,
    start: function() {
      //If gate starts being moved from where it was dropped, remove that square's diabled class and 'disabled' attribute
      var droppable = $("#" + $(this).attr('value'));
      droppable.removeClass("disabled");
      droppable.droppable( "option", "disabled", false );
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
})

//Regex for getElemCoords()
var onlyNumbers = /\d+/g;

function getElemCoords (idString) {
  return idString.match(onlyNumbers);
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
  draggable = $("#" + ui.draggable.attr('id'));
  var droppableId = $(this).attr('id');
  draggable.attr('value', droppableId);

  if ($(this).attr('id') != "gate-container") {
    ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
    $(this).droppable( "option", "disabled", true );
    $(this).addClass("disabled");
  }
}
