function Gate(type, id) {
  this.id = id;
  this.type = type;
  this.coordinates = "";
  this.InputLocation1 = null;
  this.InputLocation2 = null;
  this.output = null;
  this.state = null;
  this.left = false;
  this.right = false;
  this.up = false;
  this.down = false;

  switch(this.type) {
    case "Wire":
    case "NOT":
      this.left = true;
      this.right = true;
      break;
    case "Input":
      this.right = true;
      this.state = 1;
      break;
    case "Output":
      this.left = true;
      break;
    case "AND":
    case "OR":
    case "XOR":
      this.right = true;
      this.up = true;
      this.down = true;
      break;
    case "uWire":
      this.left = true;
      this.up = true;
      break;
    case "dWire":
      this.left = true;
      this.down = true;
      break;
  }
}

Gate.prototype.GetInput = function() {
  switch (this.type) {
    case "Wire":
    case "dWire":
    case "uWire":
      if (this.InputLocation1 != null) {
        var input = this.InputLocation1.GetInput();
        this.state = ((input === 1) ? 1 : 0);
      } else {
        this.state = null;
      }
      return this.state;

    case "Input":
      return this.state;

    case "AND":
      if (this.InputLocation1 != null && this.InputLocation2 != null) {
        var inputState1 = this.InputLocation1.GetInput();
        var inputState2 = this.InputLocation2.GetInput();
        this.state = (inputState1 && inputState2);
      } else {
        this.state = null;
      }
      return this.state;

    case "OR":
      if (this.InputLocation1 != null || this.InputLocation2 != null) {
        var inputState1 = (this.InputLocation1 != null) ? this.InputLocation1.GetInput() : 0;
        var inputState2 = (this.InputLocation2 != null) ? this.InputLocation2.GetInput() : 0;
        this.state = (inputState1 || inputState2);
      } else {
        this.state = null;
      }
      return this.state;

    case "XOR":
      if (this.InputLocation1 != null || this.InputLocation2 != null) {
        var inputState1 = (this.InputLocation1 != null) ? this.InputLocation1.GetInput() : 0;
        var inputState2 = (this.InputLocation2 != null) ? this.InputLocation2.GetInput() : 0;
        this.state = ((inputState1) ? !inputState2 : inputState2);
      } else {
        this.state = null;
      }
      return this.state;

    case "NOT":
      if (this.InputLocation1 != null) {
        var inputState1 = this.InputLocation1.GetInput();
        if (inputState1 != null) {
          this.state = (!inputState1);
        }
      } else {
        this.state = null;
      }
      return this.state;
    case "Output":
      if (this.InputLocation1 != null) {
        this.state =  this.InputLocation1.GetInput()
      } else {
        this.state = null;
      }
      return this.state;
  }
  // if (this.type === "Wire" || this.type === "dWire" || this.type === "uWire") {
  //   if (this.InputLocation1 != null) {
  //     var input = this.InputLocation1.GetInput();
  //     this.state = ((input === 1) ? 1 : 0);
  //   } else {
  //     this.state = null;
  //   }
  //   return this.state;

  // } else if (this.type === "Input") {
  //   return this.state;
  //
  // } else if (this.type === "AND") {
  //   if (this.InputLocation1 != null && this.InputLocation2 != null) {
  //     var inputState1 = this.InputLocation1.GetInput();
  //     var inputState2 = this.InputLocation2.GetInput();
  //     this.state = (inputState1 && inputState2);
  //   } else {
  //     this.state = null;
  //   }
  //   return this.state;

  // } else if (this.type === "OR") {
  //   if (this.InputLocation1 != null || this.InputLocation2 != null) {
  //     var inputState1 = (this.InputLocation1 != null) ? this.InputLocation1.GetInput() : 0;
  //     var inputState2 = (this.InputLocation2 != null) ? this.InputLocation2.GetInput() : 0;
  //     this.state = (inputState1 || inputState2);
  //   } else {
  //     this.state = null;
  //   }
  //   return this.state;

  // } else if (this.type === "XOR") {
  //   if (this.InputLocation1 != null || this.InputLocation2 != null) {
  //     var inputState1 = (this.InputLocation1 != null) ? this.InputLocation1.GetInput() : 0;
  //     var inputState2 = (this.InputLocation2 != null) ? this.InputLocation2.GetInput() : 0;
  //     this.state = ((inputState1) ? !inputState2 : inputState2);
  //   } else {
  //     this.state = null;
  //   }
  //   return this.state;

  // } else if (this.type === "NOT") {
  //   if (this.InputLocation1 != null) {
  //     var inputState1 = this.InputLocation1.GetInput();
  //     if (inputState1 != null) {
  //       this.state = (!inputState1);
  //     }
  //   } else {
  //     this.state = null;
  //   }
  //   return this.state;

  // } else if (this.type === "Output") {
  //   if (this.InputLocation1 != null) {
  //     this.state =  this.InputLocation1.GetInput()
  //   } else {
  //     this.state = null;
  //   }
  //   return this.state;
  // 
  // } else {
  //   alert("Invalid gate type: cannot retrieve input");
  // }
}


function Level() {
  this.wires = 1;
  this.uWires = 1;
  this.dWires= 1;
  this.ands = 1;
  this.nots = 1;
  this.ors = 1;
  this.xors = 0;
  this.inputs = 2;
  this.outputs = 1;
  this.inputLocations = ["3-3", "5-3"];
  this.outputLocations = ["4-6"];
}
