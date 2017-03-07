function Gate(type, id) {
  this.id = id;
  this.type = type;
  this.wireType = null;
  this.coordinates = "";
  this.InputLocation1 = null;
  this.InputLocation2 = null;
  this.output = null;
  this.state = 0;

  if (this.type === "Wire") {
    this.wireType === "straight";
  } else if (this.type === "uWire") {
    this.wireType === "up";
  } else if (this.type === "dWire") {
    this.wireType === "down";
  }
}

Gate.prototype.GetInput = function() {
  if (this.type === "AND") {

  } else if (this.type === "OR") {

  } else if (this.type === "XOR") {

  } else if (this.type === "NOT") {

  } else {
    alert("Invalid gate type: cannot retrieve input");
  }
}


function Level() {
  this.wires = 1;
  this.uWires = 1;
  this.dWires= 1;
  this.ands = 1;
  this.nots = 0;
  this.ors = 1;
  this.xors = 0;
  this.inputs = 2;
  this.outputs = 1;
  this.inputLocations = ["3-3", "5-3"];
  this.outputLocations = ["4-6"];
}
