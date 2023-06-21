//Copyright (C) <2013> <Loe Feijs and TU/e

const verbose = false;
const NRINTERSECTS = 25; //safe upperbound
const NRRHYTHMPLANES = 200; //many are purged
const NRATOMS = NRINTERSECTS + NRRHYTHMPLANES;
class VLine extends Cell {
  //CONCEPTION
  constructor(parent) {
    super();
    this.type = "VLine";
    this.parent = parent;
    this.x = int(random(parent.xMin + 5, parent.xMax - 5));
    this.y;
    if (parent.type == "Canvas") {
      this.y = int(random(parent.minY(this.x) + 5, parent.maxY(this.x) - 5));
    } else {
      this.y = int(random(parent.yMin + 5, parent.yMax - 5));
    }
    this.xMin = this.x - 5 - int(random(5));
    this.xMax = this.x + 4 + int(random(6));
    //5% probability for a very wide vertical
    if (this.PROB(0.05)) {
      this.xMin -= int(random(8, 15));
      this.xMax += int(random(8, 15));
    }
    this.yMin = this.y - 1;
    this.yMax = this.y + 1;
    this.clr = new Color(YELLOW);
    this.hori = false;
    this.verti = true;
    this.stoppi = this.PROB(0.8);
    this.epsilon = 0;
    this.age = 0;
    this.activation = 300; //HLines must be setup first
    this.midlifetrigger = this.activation + 1000;
  }

  setxy(x, y) {
    this.xMin = x - 8 - int(random(4));
    this.xMax = x + 7 + int(random(4));
    this.yMin = y - 1;
    this.Max = y + 1;
  }

  //COMPOSITION
  prep() {
    //Kind of first version of the setpup
    //so it can be run separately already

    this.cells = new Array(NRATOMS);
  }
  setup() {
    //setup: creates the internal content for this VLine,
    //the intersection squares are done already by HLine,
    //(so take care there are already some atoms present,
    //fill in details of hline: the famous rhythm planes.
    //Precondition: prep() done already
    for (var i = 0; i < NRRHYTHMPLANES; i++) {
      var a = new Atom(this, null);
      a.clr = new Color(RED); //new Color6(RED, YELLOW, BLUE, WHITE, GRIS, NAVY);
      a.xMin = this.xCtr() - 2;
      a.xMax = this.xCtr() + 3;
      var y = int(random(parent.yMin + 1, parent.yMax - 1));
      a.yMin = y - 1;
      a.yMax = y + 1;
      a.hori = true;
      a.verti = true;
      a.stoppi = true;
      a.epsilon = (this.xMax - this.xMin) / 7; //was /2
      a.ratio = 0.5; //bit wider //was square-ish
      this.insert(a);
    } //end for
    this.purge1();
    this.purge2();
  } //end setup

  //APOPTOSIS
  purge1() {
    //meant for a collection of Atom cells supposedly "rhytmic" on Vline
    //eliminate some of the cells inside this which are too close anyhow
    for (var i = 0; i < this.cells.length; i++) {
      for (var j = 0; j < this.cells.length; j++) {
        var ci = this.cells[i];
        var cj = this.cells[j];
        if (i != j && ci != null && cj != null) {
          if (
            (!cj.biparental() &&
              abs(ci.yCtr() - cj.yCtr()) < ci.epsilon + cj.epsilon) ||
            //make sure ci has some chance of not being squeezed already in the beginning
            (cj.biparental() &&
              abs(ci.yCtr() - cj.yCtr()) <
                cj.coparent.yMax - cj.coparent.yMin + ci.epsilon)
            //meaning: keep extra distance from the intersection plane cells such as cj
          )
            if (!this.cells[i].biparental()) this.cells[i] = null;
        }
      }
    }
    if (verbose) {
      print("VLine purge1 @");
      print(age);
    }
  } //end purge1

  purge2() {
    //eliminate atoms inside this VLine but outside the lozenge
    if (parent.type == "Canvas")
      if (this.cells != null)
        for (var i = 0; i < this.cells.length; i++)
          if (this.cells[i] != null)
            if (
              this.cells[i].xMax < parent.xMin(this.cells[i].yCtr()) ||
              this.cells[i].xMin > parent.xMax(this.cells[i].yCtr())
            )
              this.cells[i] = null;
    if (verbose) {
      print("VLine purge2 @");
      print(age);
    }
  } //end purge2

  purge3() {
    //eliminate rhythm cells which did not reach 90% line width
    //and for intersect cells also even check their width
    //PS: warning: don't run this purge action too early.
    for (var i = 0; i < this.cells.length; i++) {
      if (
        this.cells[i] != null &&
        this.cells[i].xMax - this.cells[i].xMin + 1 <
          0.9 * (this.xMax - this.xMin) &&
        (this.cells[i].coparent == null ||
          this.cells[i].xMax - this.cells[i].xMin + 1 <
            0.9 * (this.cells[i].coparent.xMax - this.cells[i].coparent.xMin))
      )
        this.cells[i] = null;
    } //end for
    if (verbose) {
      print("VLine purge3 @");
      print(age);
    }
  } //end purge3

  //TRIGGERED ACTION
  trigger() {
    this.purge3();
    this.compress();
  }
} //end VLine
