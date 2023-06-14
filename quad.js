//Copyright (C) <2013> <Loe Feijs and TU/e
class Quad extends Cell {
  //CONCEPTION
  constructor(parent) {
    super();
    this.type = "Quad";
    this.parent = parent;
    this.clr = parent.clr;
    this.hori = true;
    this.verti = true;
    this.stoppi = true;
    this.ratio = 0.75;
    this.activation = 0;
    this.midlifetrigger = 100;
  }
  setxy(x, y, hsize, vsize) {
    super.xMin = x - hsize / 2;
    super.xMax = x + hsize / 2;
    super.yMin = y - vsize / 2;
    super.yMax = y + vsize / 2;
  }

  //COMPOSITION
  setup(faux) {
    //compose a quadruple white/gris configuration, two whites (diagonally), two gris's,
    //first the quadruple is a carrier containing four elements, launched and positioned
    //as a whole, later remove the 100x100 carrier. The case i = 1 yields a fixed white.
    this.setxy(super.xCtr(), super.yCtr(), 100, 100);
    var cells = new Array(4);
    for (var i = 0; i < 4; i++) {
      var x = super.xCtr();
      var y = super.yCtr();
      var c = new Quad(this);
      c.setxy(super.xCtr(), super.yCtr());
      c.clr = new Color(i == 1 ? WHITE : i == 2 ? WHITE : GRIS);
      c.hori = c.verti = i != 1;
      x += i > 1 ? 11 : 0;
      y += i % 2 == 1 ? 9 : 0;
      c.setxy(x, y, 10, 8);
      super.insert(c);
    }
    // if (faux) this.setupBIS();
  }

  // setupBIS() {
  //   //this a a faux quadruple, that is, slighly mis-aligned,
  //   //which works nice for a group of gris and yellow cells.
  //   var offset = super.RAND(50);
  //   super.cells[1].clr = new Color(YELLOW);
  //   super.cells[1].xMin -= offset;
  //   super.cells[1].xMax -= offset;
  //   super.cells[1].hori = true;
  //   super.cells[2].clr = new Color(YELLOW);
  // }

  //TRIGGERED ACTION
  shrapnel() {
    //insert payload, remove carrier
    if (super.cells != null)
      for (var i = 0; i < cells.length; i++) {
        super.cells[i].verti = super.cells[i].hori;
        super.cells[i].parent = parent;
        parent.insert(super.cells[i]);
      }
    if (super.cells != null) exit();
  }

  trigger() {
    shrapnel();
  }
} //end class
