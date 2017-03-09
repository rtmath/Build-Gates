
//-----------Document Ready-----------

$(function () {
    const NUMBER_OF_LEVELS = 5;
    var levelId = $('#LevelId').val();
    if (levelId > 0 && levelId <= NUMBER_OF_LEVELS) {
        InitializeBoard();
        gatesArray = [];
        debugMode = false;

        $('#reset').click(function () {
            window.location.reload();
        })

        $('#debug').click(function () {
            debugMode = (debugMode) ? false : true;
            if (debugMode) {
                displayGateDebugInfo();
            } else {
                $('#debug-panel').html("");
            }
        })

        $('#start').click(function () {
            $('#start').hide();
            var level = levelSelector(levelId);
            createGates(level);
            randomizeGates();
            loadGates();
            $(".gate").draggable(gateDraggableSettings);
            $(".grid").droppable(gridDroppableSettings);
            $("#gate-container").droppable(gridDroppableSettings);
            positionIO(level.inputLocations, level.outputLocations);
            checkState();
            checkVictory();
            if (debugMode) {
                displayGateDebugInfo();
            }

            $('.Input').click(function () {
                var gate = gatesArray[findArrayId($(this).attr('id'))];
                gate.state = (gate.state) ? 0 : 1;
                checkState();
                checkVictory();
                if (debugMode) {
                    displayGateDebugInfo();
                }
            })
        })

        //--------jQuery UI drag-drop settings----------

        var gateDraggableSettings = {
            containment: $("#square-container"),
            revert: function (droppedObj) {
                if (!droppedObj) {
                    droppable = $("#" + $(this).attr('value'));
                    droppable.droppable("option", "disabled", true);
                    updateCoordinates($(this));
                    updateRelationships($(this));
                    checkState();
                    checkVictory();
                    if (debugMode) {
                        displayGateDebugInfo();
                    }
                    return true;
                }
            },
            revertDuration: 200,
            start: function () {
                //If gate starts being moved from where it was dropped, remove that square's disabled class and 'disabled' attribute
                $(this).removeClass("on");
                var droppable = $("#" + $(this).attr('value'));
                droppable.droppable("option", "disabled", false);
                severConnections($(this));
                checkState();
                checkVictory();
                if (debugMode) {
                    displayGateDebugInfo();
                }
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
                ui.draggable.position({ of: $(this), my: 'left top', at: 'left top' });
                $(this).droppable("option", "disabled", true);
            }
            updateCoordinates(ui.draggable);
            updateRelationships(ui.draggable);
            checkState();
            checkVictory();
            if (debugMode) {
                displayGateDebugInfo();
            }
        }

        //---------Board Initialization------------------

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
                addGate(new Gate("Wire", "wire" + (i + 1)))
            }

            for (var i = 0; i < levelObject.uWires; i++) {
                addGate(new Gate("uWire", "uWire" + (i + 1)))
            }

            for (var i = 0; i < levelObject.dWires; i++) {
                addGate(new Gate("dWire", "dWire" + (i + 1)))
            }

            for (var i = 0; i < levelObject.ands; i++) {
                addGate(new Gate("AND", "and" + (i + 1)))
            }

            for (var i = 0; i < levelObject.nots; i++) {
                addGate(new Gate("NOT", "not" + (i + 1)))
            }

            for (var i = 0; i < levelObject.ors; i++) {
                addGate(new Gate("OR", "or" + (i + 1)))
            }

            for (var i = 0; i < levelObject.xors; i++) {
                addGate(new Gate("XOR", "xor" + (i + 1)))
            }

            for (var i = 0; i < levelObject.inputs; i++) {
                addGate(new Gate("Input", "input" + (i + 1)))
            }

            for (var i = 0; i < levelObject.outputs; i++) {
                addGate(new Gate("Output", "output" + (i + 1)))
            }
        }

        function loadGates() {
            var gatesToLoad = "";
            gatesArray.forEach(function (elem) {
                gatesToLoad +=
                  "<div id='" + elem.id + "' class='gate " + elem.type + "'></div>";
            })
            $('#gate-container').html(gatesToLoad);
        }

        function positionIO(inputLocations, outputLocations) {
            var inputCounter = 0;
            var outputCounter = 0;
            $('#gate-container').children().each(function (index) {
                if ($(this).hasClass("Input")) {
                    var dropTarget = $('#' + inputLocations[inputCounter]);
                    dropTarget.droppable("option", "disabled", true);
                    $(this).position({ of: dropTarget, my: 'left top', at: 'left top' });
                    $(this).attr("value", inputLocations[inputCounter]);
                    gatesArray[findArrayId($(this).attr('id'))].coordinates = inputLocations[inputCounter];
                    $(this).draggable("disable");
                    inputCounter++;
                }
                if ($(this).hasClass("Output")) {
                    var dropTarget = $('#' + outputLocations[outputCounter]);
                    dropTarget.droppable("option", "disabled", true);
                    $(this).position({ of: dropTarget, my: 'left top', at: 'left top' });
                    $(this).attr("value", outputLocations[outputCounter]);
                    gatesArray[findArrayId($(this).attr('id'))].coordinates = outputLocations[outputCounter];
                    $(this).draggable("disable");
                    outputCounter++;
                }
            });
        }

        function levelSelector(levelId) {
            //Level constructor:
            //(wires, upWires, downWires, ANDs, NOTs, ORs, XORs, Inputs, Outputs, InputLocationCoordinates[], OutputLocationCoordinates[]
            switch (levelId) {
                case "1":
                    return new Level(4, 0, 0, 0, 0, 0, 0, 1, 1, ["4-2"], ["4-7"]);
                case "2":
                    return new Level(2, 1, 1, 0, 0, 1, 0, 2, 1, ["3-2", "5-2"], ["4-6"]);
                case "3":
                    return new Level(3, 1, 1, 1, 0, 0, 0, 2, 1, ["3-2", "5-2"], ["4-6"]);
                case "4":
                    return new Level(0, 1, 1, 0, 0, 0, 1, 2, 1, ["1-1", "3-1"], ["2-3"]);
                case "5":
                    return new Level(0, 1, 1, 1, 2, 0, 0, 2, 1, ["1-1", "3-1"], ["2-5"]);
            }
        }

        function randomizeGates() {
            var m = gatesArray.length, t, i;
            while (m) {
                i = Math.floor(Math.random() * m--);
                t = gatesArray[m];
                gatesArray[m] = gatesArray[i];
                gatesArray[i] = t;
            }
        }

        //--------------Helper Functions-------------------------

        //Regex for getElemCoords()
        var onlyNumbers = /\d+/g;

        function getElemCoords(idString) {
            if (typeof idString != "undefined" && idString != "gate-container") {
                arrayCoords = idString.match(onlyNumbers);
                return parseInt(arrayCoords[0] + arrayCoords[1]);
            }
        }

        function updateRelationships(htmlElem) {
            if (typeof htmlElem != "undefined") {
                var hElemValue = getElemCoords(htmlElem.attr('value'));
                var above = hElemValue - 10;
                var below = hElemValue + 10;
                var toLeft = hElemValue - 1;
                var toRight = hElemValue + 1;
                $('#gate-container').children().each(function () {
                    var childCoords = getElemCoords($(this).attr('value'));
                    var htmlIndex = findArrayId(htmlElem.attr('id'));
                    var childIndex = findArrayId($(this).attr('id'));
                    var placedGate = gatesArray[htmlIndex];
                    var adjacentGate = gatesArray[childIndex];

                    switch (childCoords) {
                        case toLeft:
                            if (adjacentGate.right && placedGate.left) {
                                adjacentGate.output = placedGate;
                                placedGate[assignInputLocation(placedGate)] = adjacentGate;
                            }
                            break;
                        case toRight:
                            if (adjacentGate.left && placedGate.right) {
                                adjacentGate[assignInputLocation(adjacentGate)] = placedGate;
                                placedGate.output = adjacentGate;
                            }
                            break;
                        case above:
                            if (placedGate.up && adjacentGate.down) {
                                if (adjacentGate.type === "dWire" && placedGate.type != "uWire") {
                                    adjacentGate.output = placedGate;
                                    placedGate[assignInputLocation(placedGate)] = adjacentGate;
                                } else {
                                    placedGate.output = adjacentGate;
                                    adjacentGate[assignInputLocation(adjacentGate)] = placedGate;
                                }
                            }
                            break;
                        case below:
                            if (placedGate.down && adjacentGate.up) {
                                if (adjacentGate.type === "uWire" && placedGate.type != "dWire") {
                                    adjacentGate.output = placedGate;
                                    placedGate[assignInputLocation(placedGate)] = adjacentGate;
                                } else {
                                    placedGate.output = adjacentGate;
                                    adjacentGate[assignInputLocation(adjacentGate)] = placedGate;
                                }
                            }
                            break;
                    }
                })
            }
        }

        function assignInputLocation(gate) {
            return (gate.InputLocation1 != null) ? "InputLocation2" : "InputLocation1";
        }

        function severConnections(htmlElem) {
            var currentGate = gatesArray[findArrayId(htmlElem.attr('id'))];
            if (currentGate.output) {
                if (currentGate.output.InputLocation1 === currentGate) {
                    currentGate.output.InputLocation1 = null;
                }
                if (currentGate.output.InputLocation2 === currentGate) {
                    currentGate.output.InputLocation2 = null;
                }
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

        function checkState() {
            $('#gate-container').children().each(function () {
                var gate = gatesArray[findArrayId($(this).attr('id'))];
                gate.GetInput();
                if (gate.state) {
                    $(this).addClass(gate.type + "On");
                } else {
                    $(this).removeClass(gate.type + "On");
                }
            })
        }

        function checkVictory() {
            var output;
            gatesArray.forEach(function (elem) {
                if (elem.type === "Output") {
                    output = elem;
                }
            })
            if (output.state) {
                $('#success').show();
                $('#nextLevel').show();
                $('#success-modal').css("display", "block");
            }
        }

        //------------Debug----------------

        function displayGateDebugInfo() {
            var toDisplay = "";
            for (var i = 0; i < gatesArray.length; i++) {
                var currentGate = gatesArray[i];
                toDisplay +=
                  "<div class='panel-container'>" +
                    "<strong>" + currentGate.id.toUpperCase() + "</strong><br>" +
                    "Coords: " + ((currentGate.coordinates === 'gate-container') ? "" : currentGate.coordinates) + "<br>" +
                    "Input1 From: " + ((currentGate.InputLocation1) ? "<strong style='color: red'>" + currentGate.InputLocation1.id + "</strong>" : "null") + "<br>" +
                    "Input2 From: " + ((currentGate.InputLocation2) ? "<strong style='color: red'>" + currentGate.InputLocation2.id + "</strong>" : "null") + "<br>" +
                    "Output To: " + ((currentGate.output) ? "<strong style='color: red'>" + currentGate.output.id + "</strong>" : "null") + "<br>" +
                    "State: " + currentGate.state + "<br>" +
                    // "Left: " + currentGate.left + "<br>" +
                    // "Right: " + currentGate.right + "<br>" +
                    // "Up: " + currentGate.up + "<br>" +
                    // "Down: " + currentGate.down + "<br>" +
                  "</div>";
            }
            $('#debug-panel').html(toDisplay);
        }
    } else {
        alert("Invalid level id");
    }
})
