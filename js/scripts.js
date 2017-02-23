$(function() {

  InitializeBoard();

  $(".gate").draggable( {snap: true, containment: $("#square-container"), revert: "invalid", revertDuration: 200 });
  $(".grid").droppable( {
    accept: '.ui-draggable',
    drop: dropGatePiece
});

  function dropGatePiece(event, ui) {
    $(this).addClass("ui-state-highlight");
    ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
  }
})

function InitializeBoard() {
  for (var i = 0; i < 5; i++) {
    $('#square-container').append("<div class='.row'>");
    for (var j = 0; j < 10; j++) {
      $('#square-container').append("<div class='.grid'></div>")
    }
    $('#square-container').append("</div>");
  }
}
