//Copyright (C) <2013> <Loe Feijs and TU/e
class Mini extends Cell {
  verbose = false;

  //CONCEPTION
  constructor(parent) {
    super();
    this.type = "Mini";
    this.parent = parent;
    this.dx;
    this.dy;
    if (this.PROB(0.25)) {
      this.dx = 5;
      this.dy = 3; //lying
    } else if (this.PROB(0.5)) {
      this.dy = 5; //standing
      this.dx = 3;
    } else {
      this.dx = 2;
      this.dy = 2; //square
    }
    this.x = this.dx + int(random(parent.xMin, parent.xMax - this.dx));
    this.y = this.dy + int(random(parent.yMin, parent.yMax - this.dy));
    this.xMin = this.x;
    this.xMax = this.x + this.dx;
    this.yMin = this.y;
    this.yMax = this.y + this.dy;
    this.clr = new Color(GRIS, RED, BLUE, WHITE, YELLOW);
    this.hori = true;
    this.verti = true;
    this.stoppi = true;
    if (this.PROB(0.75)) this.ratio = float(this.dy) / float(this.dx);
    else this.ratio = -1;
    this.activation = 800 + this.RAND(200);
    this.midlifetrigger = this.activation + 200;
  }
  fast() {
    //no more spreading in activation time,
    //things are smaller, setup gets faster
    this.activation = 50;
    this.midlifetrigger = this.activation + 200;
  }
  done() {
    //no more triggers
    this.midlifetrigger = -1;
  }

  //COMPOSITION
  tiny() {
    return fuzzy(area(), 0, 0, 1000, 2000);
  }
  small() {
    return fuzzy(area(), 1000, 2000, 3000, 4000);
  }
  medium() {
    return fuzzy(area(), 3000, 4000, 6000, 8000);
  }
  large() {
    return fuzzy(area(), 6000, 8000, INF, INF);
  }
  hstretched() {
    return fuzzy(dydx(), 0.0, 0.0, 0.66, 1.5);
  }
  squarish() {
    return fuzzy(dydx(), 0.66, 0.8, 1.25, 1.5);
  }
  square() {
    return fuzzy(dydx(), 0.75, 0.9, 1.1, 1.25);
  }
  vstretched() {
    return fuzzy(dydx(), 0.66, 1.5, INF, INF);
  }
  recursible() {
    return fuzzy(nesting(), 0.0, 0.0, 0.8, 3.2);
  }

  INF = 1000000;
  truth() {
    return 1.0;
  }
  NOT(p) {
    return 1 - p;
  }
  P(p) {
    return random(1.0) < p;
  }

  fuzzy(a, lo1, lo2, hi1, hi2) {
    //generic fuzzy logic predicate, membership test for
    //being between low and high boundary; fuzzy bounds,
    //roughly, lo1 < low < lo2 and also hi1 < high < hi2
    var f1 = (a - lo1) / max(0.01, lo2 - lo1);
    var f2 = 1 - (a - hi1) / max(0.01, hi2 - hi1);
    if (f1 < 0) f1 = 0;
    if (f1 > 1) f1 = 1;
    if (f2 < 0) f2 = 0;
    if (f2 > 1) f2 = 1;
    return f1 * f2;
  }

  setup() {
    if (verbose) {
      print("Mini: setup, nesting = ");
      print(this.nesting());
    }
    //based on probabilistic (fuzzy) logic, cf. Zadeh
    //only for not-yet-decomposed Mini's,  of course;
    //the Mini must have reached its final dimensions
    this.nogrow();
    var retry = 0;
    var done = this.cells != null || this.type == "Atom";
    while (!done) {
      if (retry++ > 1000) done = true;
      var num = floor(random(22));
      switch (num) {
        case 0:
          if (P(this.recursible()) && P(this.hstretched()) && P(this.tiny())) {
            this.setupH2();
            done = true;
          }
          break;
        case 1:
          if (P(this.recursible()) && P(this.hstretched()) && P(this.small())) {
            this.setupG();
            done = true;
          }
          break;
        case 2:
          if (
            P(this.recursible()) &&
            P(this.hstretched()) &&
            P(this.medium())
          ) {
            this.setupHN();
            done = true;
          }
          break;
        case 3:
          if (P(this.recursible()) && P(this.hstretched()) && P(this.large())) {
            this.setupHN();
            done = true;
          }
          break;
        case 4:
          if (P(this.vstretched()) && P(this.tiny())) {
            this.setupA();
            done = true;
          }
          break;
        case 5:
          if (P(this.vstretched()) && P(this.small())) {
            this.setupG();
            done = true;
          }
          break;
        case 6:
          if (
            P(this.recursible()) &&
            P(this.vstretched()) &&
            P(this.medium())
          ) {
            this.setupVNL();
            done = true;
          }
          break;
        case 7:
          if (P(this.vstretched()) && P(this.medium())) {
            this.setupG();
            done = true;
          }
          break;
        case 8:
          if (P(this.recursible()) && P(this.vstretched()) && P(this.large())) {
            this.setupVNU();
            done = true;
          }
          break;
        case 9:
          if (P(this.recursible()) && P(this.vstretched()) && P(this.large())) {
            this.setupVNL();
            done = true;
          }
          break;
        case 10:
          if (P(this.squarish()) && P(this.tiny())) {
            this.setupA();
            done = true;
          }
          break;
        case 11:
          if (P(this.recursible()) && P(this.squarish()) && P(this.small())) {
            this.setupNxN();
            done = true;
          }
          break;
        case 12:
          if (P(this.recursible()) && P(this.squarish()) && P(this.small())) {
            this.setupG();
            done = true;
          }
          break;
        case 13:
          if (P(this.squarish()) && P(this.small())) {
            this.setup2x2();
            done = true;
          }
          break;
        case 14:
          if (P(this.recursible()) && P(this.squarish()) && P(this.small())) {
            this.setup2x2();
            done = true;
          }
          break;
        case 15:
          if (P(this.recursible()) && P(this.squarish()) && P(this.medium())) {
            this.setupG();
            done = true;
          }
          break;
        case 16:
          if (P(this.recursible()) && P(this.square()) && P(this.tiny())) {
            this.setup2x2();
            done = true;
          }
          break;
        case 17:
          if (P(this.recursible()) && P(this.square()) && P(this.small())) {
            this.setupG();
            done = true;
          }
          break;
        case 18:
          if (P(this.recursible()) && P(this.square()) && P(this.small())) {
            this.setup2x2();
            done = true;
          }
          break;
        case 19:
          if (P(this.recursible()) && P(this.square()) && P(this.medium())) {
            this.setup2x2();
            done = true;
          }
          break;
        case 20:
          if (P(this.recursible()) && P(this.square()) && P(this.medium())) {
            this.setupG();
            done = true;
          }
          break;
        case 21:
          if (P(0.01) /*no rule applicable*/) {
            this.setupA();
            done = true;
          }
          break;
        default:
          print("MINI SETUP SWITCH FAILURE");
      }
    }
  }

  setupA() {
    if (verbose) print("Mini: setupA");
    done();
  }
  setup2x2() {
    if (verbose) print("Mini: setup2x2");
    //Mini divided in 4, better be really square
    var cells = new Array[4]();
    var dx = this.xMax - this.xMin;
    var dy = this.yMax - this.yMin;
    cells[0] = new Atom(this);
    cells[1] = new Atom(this);
    cells[2] = new Atom(this);
    cells[3] = new Atom(this);

    cells[0].xMin = this.xMin;
    cells[0].xMax = this.xMin + this.dx / 2;
    cells[0].yMin = this.yMin;
    cells[0].yMax = this.yMin + this.dy / 2;
    cells[1].xMin = this.xMin + this.dx / 2;
    cells[1].xMax = this.xMax;
    cells[1].yMin = this.yMin;
    cells[1].yMax = this.yMin + this.dy / 2;
    cells[2].xMin = this.xMin;
    cells[2].xMax = this.xMin + this.dx / 2;
    cells[2].yMin = this.yMin + this.dy / 2;
    cells[2].yMax = this.yMax;
    cells[3].xMin = this.xMin + this.dx / 2;
    cells[3].xMax = this.xMax;
    cells[3].yMin = this.yMin + this.dy / 2;
    cells[3].yMax = this.yMax;

    cells[0].hori = false;
    cells[0].verti = false;
    cells[1].hori = false;
    cells[1].verti = false;
    cells[2].hori = false;
    cells[2].verti = false;
    cells[3].hori = false;
    cells[3].verti = false;

    cells[1].clr = cells[0].clr.fresh();
    cells[2].clr = cells[1].clr;
    cells[3].clr = cells[0].clr;
    done();
  } //end setup2x2

  setupG() {
    if (verbose) print("Mini: setupG");
    // G-Mini, or "gooze-eye" Mini, the kind with probably one kernel,
    // It must have grown first,  and then will self-center again now;
    // let x,y be that center, create internal content, just obe cell.
    var x = (this.xMin + this.xMax) / 2;
    var y = (this.yMin + this.yMax) / 2;
    if (this.PROB(0.9)) {
      cells = new Array[1]();
      var a = new Atom(this);
      var varr =
        this.xMax - this.xMin > 50 && this.yMax - this.yMin > 50
          ? this.RAND(9, 13)
          : this.RAND(
              5,
              min(this.xMax - this.xMin, this.yMax - this.yMin) / 4
            );
      a.xMin = x - varr;
      a.xMax = x + varr;
      a.yMin = y - varr;
      a.yMax = y + varr;
      a.clr = clr.complementary();
      a.hori = false;
      a.verti = false;
      if (a.boxed()) this.insert(a);
    } //only 90% of them have a kernel indeed
    this.done();
  } //end setupG

  setupNxN() {
    if (verbose) println("Mini: setupNxN");
    //kind of small checkerboard, 5x5 for example
    var dx = this.xMax - this.xMin;
    var dy = this.yMax - this.yMin;
    var Nx = max(1, round(dx / 10));
    var Ny = max(1, round(dy / 10));
    var xStep = dx / Nx;
    var yStep = dy / Ny;
    var cells = new Array((Nx + 2) * (Ny + 2));
    var prevs = new Array(Nx + 1);
    for (var i = 0; i <= Nx; i++) {
      prevs[i] = new Array(Ny + 1);
    }
    for (var i = 0; i < Nx; i++) {
      for (var j = 0; j < Ny; j++) {
        var a = new Atom(this);
        a.xMin = int(this.xMin + i * xStep);
        a.xMax = int(this.xMin + i * xStep + xStep);
        a.yMin = int(this.yMin + j * yStep);
        a.yMax = int(this.yMin + j * yStep + yStep);
        a.clr = new Color(RED, BLUE, YELLOW, BLACK, WHITE, GRIS);
        while (
          (i > 0 && a.clr.isSAMELABEL(prevs[i - 1][j])) ||
          (j > 0 && a.clr.isSAMELABEL(prevs[i][j - 1]))
        )
          a.clr = new Color6(RED, BLUE, YELLOW, BLACK, WHITE, GRIS);
        a.hori = false;
        a.verti = false;
        a.stoppi = true;
        a.activation = 100; //test
        prevs[i][j] = a.clr;
        this.insert(a);
      }
    } //end for
    this.done();
  } //endsetupNxN

  setupVNU() {
    if (verbose) print("Mini: setupVNU");
    //vertically decomposed mini with N sub-minis and a hLine near Upper edge
    var N;
    if (this.dydx() > 3) N = 5;
    else if (this.dydx() > 2) N = 4;
    else N = 3;
    var cells = new Array(N);
    var prevs = new Array(N);
    var h = new HLine(this);
    h.setxy((this.xMin + this.xMax) / 2, this.yMin + 4 + this.RAND(4));
    h.clr = new Color(WHITE);
    h.setup();
    h.yMin = this.yMin;
    h.yMax = this.yMin + 2 * (h.yCtr() - this.yMin);
    this.insert(h);
    var yBegin = h.yMax;
    var yStep = (this.yMax - yBegin) / float(N - 1);
    a = new Mini(this);
    //this is the first one
    yBegin += yStep / 2;
    a.setxy((this.xMax + this.xMin) / 2, int(yBegin));
    a.clr = new Color4(GRIS, RED, BLUE, YELLOW);
    a.ratio = -1;
    a.fast();
    prevs[1] = a.clr;
    this.insert(a);
    for (var i = 2; i < N; i++) {
      var b = new Mini(this);
      //align them vertically
      yBegin += yStep;
      b.setxy((xMax + xMin) / 2, int(yBegin));
      b.clr = new Color(GRIS, RED, BLUE, YELLOW);
      while (b.clr.isSAMELABEL(prevs[i - 1]))
        b.clr = new Color4(GRIS, RED, BLUE, YELLOW);
      b.ratio = -1;
      b.fast();
      prevs[i] = b.clr;
      this.insert(b);
    }
    this.done();
  } //end setupVNU

  setupVNL() {
    if (verbose) print("Mini: setupVNL");
    //vertically decomposed mini with N sub-minis and a hLine near Lower edge
    var N;
    if (this.dydx() > 3) {
      N = 5;
    } else if (dydx() > 2) {
      N = 4;
    } else {
      N = 3;
    }
    var cells = new Array(N);
    var prevs = new Array(N);
    var h = new HLine(this);
    h.setxy((this.xMin + this.xMax) / 2, this.yMax - 4 - this.RAND(4));
    h.clr = new Color(WHITE);
    h.setup();
    h.yMax = this.yMax;
    h.yMin = this.yMax - 2 * (this.yMax - h.yCtr());
    this.insert(h);
    var yEnd = h.yMin;
    var yStep = (yEnd - this.yMin) / (N - 1);
    var a = new Mini(this);
    //this is the first one after the HLine
    var yBegin = this.yMin + yStep / 2;
    a.setxy((this.xMax + this.xMin) / 2, int(yBegin));
    a.clr = new Color5(GRIS, RED, BLUE, YELLOW, WHITE);
    a.ratio = -1;
    a.fast();
    prevs[1] = a.clr;
    this.insert(a);
    for (var i = 2; i < N; i++) {
      var b = new Mini(this);
      //align them vertically
      yBegin += yStep;
      b.setxy((this.xMax + this.xMin) / 2, int(yBegin));
      b.clr = new Color5(GRIS, RED, BLUE, YELLOW, WHITE);
      while (b.clr.isSAMELABEL(prevs[i - 1]))
        b.clr = new Color5(GRIS, RED, BLUE, YELLOW, GRIS);
      b.ratio = -1;
      b.fast();
      prevs[i] = b.clr;
      this.insert(b);
    }
    this.done();
  } //setupVNL

  setupHN() {
    //Horizontally oriented composite mini, N sub-minis
    var N;
    if (this.dydx() < 0.33) {
      N = 5;
    } else if (this.dydx() < 0.5) {
      N = 4;
    } else {
      N = 3;
    }
    this.setupHN_withN(N);
  }

  setupH2() {
    this.setupHN_withN(2);
  }

  setupHN_withN(N) {
    if (verbose) print("Mini: setupHN");
    var cells = new Array(N);
    var prevs = new Array(N);
    var xBegin = this.xMin;
    var xStep = (this.xMax - xBegin) / N;
    var a = new Mini(this);
    //this is really the first one
    xBegin += xStep / 2;
    a.setxy(int(xBegin), (this.yMax + this.yMin) / 2);
    a.clr = new Color5(GRIS, RED, BLUE, YELLOW, WHITE);
    a.ratio = -1;
    a.fast();
    prevs[0] = a.clr;
    this.insert(a);
    for (var i = 1; i < N; i++) {
      var b = new Mini(this);
      //align them horizontally
      xBegin += xStep;
      b.setxy(
        int(xBegin) + this.RAND2(-int(xStep / 2), int(+xStep / 2)),
        (this.yMax + this.yMin) / 2
      );
      b.clr = new Color5(GRIS, RED, BLUE, YELLOW, WHITE);
      while (b.clr.isSAMELABEL(prevs[i - 1]))
        b.clr = new Color4(GRIS, RED, BLUE, YELLOW);
      b.ratio = -1;
      b.fast();
      prevs[i] = b.clr;
      insert(b);
    }
    this.done();
  } //end setupHN

  //TRIGGERED ACTION
  trigger() {
    this.setup();
    this.done();
  }
} //end Mini
