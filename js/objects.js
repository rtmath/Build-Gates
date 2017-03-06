function Gate(type, id) {
  this.id = id;
  this.type = type;
  this.coordinates = "";
  this.InputLocation1 = null;
  this.InputLocation2 = null;
  this.output = null;
  this.state = 0;
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
