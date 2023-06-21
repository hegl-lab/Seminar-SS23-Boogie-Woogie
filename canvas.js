//Copyright (C) <2013> <Loe Feijs and TU/e

//some notes regarding conversion: this was converted to this / casting to instanceof / this.cells Array had a trickier conversion(might be faulty)
class Canvas extends Cell {
  //CONCEPTION

  constructor(x, y) {
    super();
    const verbose = false;
    const MAXX = int(1270.0 / Math.sqrt(2)); //one pixel = 2mm real VBW, real VBW is 127 x 127cm, vertical 179cm
    const MAXY = int(1270.0 / Math.sqrt(2)); //displayWidth x displayHeight @ TU/e HG3.53 = 1920 x 1080, 1600 x 900 @ TU/e laptop
    this.type = "Canvas";
    this.xMin = x - MAXX / 2;
    this.xMax = x + MAXX / 2;
    this.yMin = y - MAXY / 2;
    this.yMax = y + MAXY / 2;
    this.parent = null;
    this.age = 0;
    this.midlifetrigger = 110;
  }

  minX(y) {
    if (y < this.yCtr()) return int(this.xMin + (this.yCtr() - y));
    else return int(this.xMin + (y - this.yCtr()));
  }
  maxX(y) {
    if (y < this.yCtr()) return int(this.xMax - (this.yCtr() - y));
    else return int(this.xMax - (y - this.yCtr()));
  }
  minY(x) {
    if (x < this.xCtr()) return int(this.yMin + (this.xCtr() - x));
    else return int(this.yMin + (x - this.xCtr()));
  }
  maxY(x) {
    if (x < this.xCtr()) return int(this.yMax - (this.xCtr() - x));
    else return int(this.xMax - (x - this.xCtr()));
  }

  //COMPOSITION
  setup() {
    //make a Victory Boogie Woogie tribute composition
    let clr = new Color(RED);
    console.log(clr.label);

    const NRQUADS = 2; //do not change this
    const NRHLINES = 15; //many get purge'd anyhow
    const NRVLINES = 30; //idem
    const NRMINIS = 75; //idem
    const NRMICROS = 20; //idem

    this.cells = new Array(4 * NRQUADS + NRHLINES + 2 * NRVLINES + NRMINIS + NRMICROS); //converted from this.cells = new Cell[4*NRQUADS + NRHLINES + 2*NRVLINES + NRMINIS + NRMICROS];
    /*let totalCells = 4 * NRQUADS + NRHLINES + 2 * NRVLINES + NRMINIS + NRMICROS;
    for (let i = 0; i < totalCells; i++) {
      this.cells.push(new Cell());
    }*/

    this.midlifetrigger = 500;

    //add an upmost quadruple configuration
    var qy = int(random(this.yMin + 50, this.yMin + 125));
    var qx = int(random(this.minX(qy) + 10, this.maxX(qy) - 10));
    var q = new Quad(this);
    q.setxy(qx, qy);
    q.setup(false);
    this.insert(q);

    //and a downmost yellow/gris configuration
    q = new Quad(this);
    q.setxy(this.xCtr(), this.yMax - this.RAND2(50, 100));
    q.setup(true);
    this.insert(q);

    //now compose a grid, a bit Broadway
    for (let i = 0; i < NRHLINES; i++) {
      //first create the empty HLines, which is important:
      //these HLines help some (most) of the VLines to stop,
      //for example the twins (otherwise they re-unite again).
      var h = new HLine(this);
      this.insert(h);
    }
    for (let i = 0; i < NRVLINES; i++) {
      //then the VLines and their twins,
      //the Hlines must be there already
      var v = new VLine(this);
      this.insert(v);
      v.prep();
      if (v.stoppi) {
        var twin = new VLine(this);
        v.copy(twin);
        var y =
          v.yCtr() < this.yMax / 2
            ? int((6 * this.yMax) / 7)
            : int(this.yMax / 3); //near opposite side
        twin.yMin = y;
        twin.yMax = y;
        twin.prep();
        this.insert(twin);
      }
    } //end for
    this.purge1();
    //then fill in the remaining details of the HLines
    //which will include varersection atoms
    for (let i = 0; i < this.cells.length; i++) {
      if  (this.cells[i] != null && this.cells[i].type == "HLine") {
        if  (this.cells[i] instanceof HLine) {
          //converted from ((HLine)cells[i]).setup();
          this.cells[i].setup();
        }
      }
    } //end for
    //then fill in the remaining details of the VLines

    for (let i = 0; i < this.cells.length; i++) {
      if  (this.cells[i] != null && this.cells[i].type == "VLine") {
        if  (this.cells[i] instanceof VLine) {
          //converted from ((HLine)cells[i]).setup();
          this.cells[i].setup();
        }
      }
    } //end for
    for (let i = 0; i < NRMINIS; i++) {
      var m = new Mini(this);
      this.insert(m);
      //setup postponed
    } //end for
    for (let i = 0; i < NRMICROS; i++) {
      var m = new Micro(this);
      this.insert(m);
      //setup postponed
    } //end for

    //and some more cleanup
    this.purge2();
    this.purge3();
  }

  //APOPTOSIS
  purge1() {
    //meant for the collection of Hlines and VLines typically:
    //eliminate some of the this.cells being either too close anyhow,
    //or HLines vertizontally too close, or VLines horizontally too close,
    //(being too close depends on the width for a VLine and height for an HLine)
    //but avoid removing twins. PS RUN THIS ONLY BEFORE GROWTH, NOT AT MIDLIFETRIGGERS
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells.length; j++) {
        var cj = this.cells[j];
        var ci = this.cells[i];
        if (i != j && ci != null && cj != null && !ci.twin(cj)) {
          if (
            (ci.type == "Micro" &&
              cj.type == "Micro" &&
              abs(ci.xCtr() - cj.xCtr()) < 30 &&
              abs(ci.yCtr() - cj.yCtr()) < 30) ||
            (ci.type == "Mini" &&
              cj.type == "Mini" &&
              ((abs(ci.xCtr() - cj.xCtr()) < 30 &&
                abs(ci.yCtr() - cj.yCtr()) < 30) ||
                ci.bumped(cj, 0))) ||
            (ci.type == "HLine" &&
              cj.type == "HLine" &&
              abs(ci.yCtr() - cj.yCtr()) <=
                3 + (ci.yMax - ci.yMin) / 2 + (cj.yMax - cj.yMin) / 2) ||
            (ci.type == "VLine" &&
              cj.type == "VLine" &&
              abs(ci.xCtr() - cj.xCtr()) <=
                3 + (ci.xMax - ci.xMin) / 2 + (cj.xMax - cj.xMin) / 2)
          )
            this.cells[i] = null;
        }
      }
    }
    if (verbose) {
      print("Canvas purge1 @");
      print(age);
    }
  } //end purge1

  purge2() {
    //remove this.cells with x,y outside lozenge
    if (this.cells != null)
      for (let i = 0; i < this.cells.length; i++)
        if (this.cells[i] != null) {
          this.cells[i].exitIfOutLier(this);
        }
    if (verbose) {
      print("Canvas purge2 @");
      print(age);
    }
  } //end purge2

  purge3() {
    //also get rid of HLines with unfortunate positions
    for (let i = 0; i < this.cells.length; i++)
      if (this.cells[i] != null)
        if (this.cells[i].type == "HLine")
          if (
            this.cells[i].yCtr() < this.yMin + 50 ||
            this.cells[i].yCtr() > this.yMax - 50
          )
            this.cells[i] = null;
    //also get rid of VLines with unfortunate positions
    for (let i = 0; i < this.cells.length; i++)
      if (this.cells[i] != null)
        if (this.cells[i].type == "VLine")
          if (
            this.cells[i].xCtr() < this.xMin + 75 ||
            this.cells[i].xCtr() > this.xMax - 75
          )
            this.cells[i] = null;
    //also get rid of Minis with unfortunate positions
    for (let i = 0; i < this.cells.length; i++)
      if (this.cells[i] != null)
        if (this.cells[i].type == "Mini")
          if (
            this.cells[i].xCtr() < this.xMin + 100 ||
            this.cells[i].xCtr() > this.xMin + 800 ||
            this.cells[i].yCtr() < this.yMin + 100
          )
            this.cells[i] = null;
    if (verbose) {
      print("Canvas purge3 @");
      print(age);
    }
  } //end purge3

  //TRIGGERED ACTION
  trigger() {
    this.compress();
  }

  //PRESENTATION
  grid() {
    stroke(0, 180, 0);
    for (let x = 0; x < this.xMax; x += 10) {
      if (x % 100 == 0) strokeWeight(1);
      else strokeWeight(0);
      line(x, 0, x, yMax);
    }
    strokeWeight(0);
    for (let y = 0; y < this.yMax; y += 10) {
      if (y % 100 == 0) strokeWeight(1);
      else strokeWeight(0);
      line(0, y, this.yMax, y);
    }
    strokeWeight(1); //default
  }
  /*
  rontgen() {
  grid();
  this.rontgen(4);
}*/

  count() {
    var n = this.count();
    print("cell count = ");
    print(n);
    return n;
  }

  lozenge(printing) {
    noStroke();
    if (rontgen) fill(145, 165, 145, 200); //transparent
    else if (printing)
      //no ink waste
      fill(255, 255, 255, 255); //white
    else fill(0, 0, 0, 255); //black

    var xMin = (width - MAXX) / 2;
    var xMax = (width + MAXX) / 2 + 1;
    var xCtr = width / 2;
    var yMin = (height - MAXY) / 2;
    var yMax = (height + MAXY) / 2 + 1;
    var yCtr = height / 2;
    triangle(xMin, yMin, xCtr, yMin, xMin, yCtr);
    triangle(xCtr, yMin, xMax, yMin, xMax, yCtr);
    triangle(xMax, yCtr, xMax, yMax, xCtr, yMax);
    triangle(xCtr, yMax, xMin, yMax, xMin, yCtr);
    stroke(180, 180, 180);
    line(xCtr, yMin, xMin, yCtr);
    line(xCtr, yMin, xMax, yCtr);
    line(xMax, yCtr, xCtr, yMax);
    line(xCtr, yMax, xMin, yCtr);
  } //end lozenge

  drawCanvas(printing) {
    //White background is better for printing
    //other wise, black is better for screen.
    log("drawCanvas");
    this.draw();
    this.lozenge(printing);
    if (verbose)
      if (age % 500 == 0) {
        print("Canvas @");
        print(age);
      }
  }
} //end class Canvas
