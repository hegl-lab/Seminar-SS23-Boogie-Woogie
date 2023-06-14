//Copyright (C) <2013> <Loe Feijs and TU/e
class Cell {
  //CONCEPTION
  constructor() {
    const dt = 50; //growth step
    this.type = "Cell";
    this.LEFT__ = 0; //directions
    this.RIGHT_ = 1;
    this.UPWARD = 2;
    this.DNWARD = 3;
    this.verbose = false;
    var type;
    this.parent = null;
    this.coparent = null;
    this.xMin;
    this.xMax;
    this.yMin;
    this.yMax;
    this.clr;
    this.hori = false; //if true, it tends to grow horizontally,
    this.verti = false; //if true, it ill grow vertically as well
    this.stoppi = false; //if true, it stops upon bumping on cell.
    this.ratio = -1;
    this.age = 0;
    this.epsilon = 0;
    this.activation = 0;
    this.midlifetrigger = 0;
    this.cells = new Array(); //for the recursive this.cells
    this.bours = new Array(); //for collision detection
  }

  //Derived properties:
  xCtr() {
    return (this.xMin + this.xMax) / 2;
  }
  yCtr() {
    return (this.yMin + this.yMax) / 2;
  }
  area() {
    return (this.xMax - this.xMin) * (this.yMax - this.yMin);
  }
  dydx() {
    return (
      float(this.yMax - this.yMin) / max(0.1, float(this.xMax - this.xMin))
    );
  }
  nesting() {
    if (this.parent == null) return 0;
    else return 1 + this.parent.nesting();
  }
  biparental() {
    return this.parent != null && this.coparent != null;
  }

  setxy(x, y) {
    this.xMin = x - 1;
    this.xMax = x + 1;
    this.yMin = y - 1;
    this.yMax = y + 1;
  }
  copy(dst) {
    //from this to destination
    dst.type = this.type;
    dst.parent = this.parent;
    dst.coparent = this.coparent;
    dst.xMin = this.xMin;
    dst.xMax = this.xMax;
    dst.yMin = this.yMin;
    dst.yMax = this.yMax;
    dst.clr = this.clr;
    dst.hori = this.hori;
    dst.verti = this.verti;
    dst.stoppi = this.stoppi;
    dst.ratio = this.ratio;
    dst.age = this.age;
    dst.epsilon = this.epsilon;
    dst.activation = this.activation;
    dst.midlifetrigger = this.midlifetrigger;
    if (this.cells != null) {
      dst.cells = new Array(this.cells.length);
      for (var i = 0; i < this.cells.length; i++) {
        if (this.cells[i] != null) {
          dst.cells[i] = new Cell();
          this.cells[i].copy(dst.cells[i]);
        }
      }
    }
  }
  insert(c) {
    //Put given Cell c in the first free slot of this.cells, if any
    if (this.cells != null) {
      var i = 0;
      while (i < this.cells.length && this.cells[i] != null) i++;
      if (i < this.cells.length) this.cells[i] = c;
      else {
        print("Cell: INSERT FAILED");
        // c.tell();
      }
    } else {
      print("Cell: INSERT FAILED");
      // c.tell();
    }
  }

  insertUnique(c) {
    //Like insert, but avoid duplicates with respect to x,y.
    //Intersection planes in case of twin VLines are tricky.
    var found = false;
    if (this.cells != null)
      for (var i = 0; i < this.cells.length; i++)
        if (this.cells[i] != null)
          if (
            this.cells[i].xCtr() == c.xCtr() &&
            this.cells[i].yCtr() == c.yCtr()
          )
            found = true;
    if (!found) insert(c);
  }
  insertCells(c) {
    //Apply typically for a quadruple object c, being useless
    //but carrying four this.cells, to be inserted into the canvas
    if (c.cells != null)
      for (var i = 0; i < c.cells.length; i++) insert(c.cells[i]);
  }
  compress() {
    //get rid of superflupuous null entries in this.cells
    if (this.cells != null) {
      var cnt = 0;
      var old = this.cells.length;
      for (var i = 0; i < this.cells.length; i++)
        if (this.cells[i] != null) cnt++;
      var newcells = new Array[cnt]();
      var j = 0;
      for (var i = 0; i < this.cells.length; i++)
        if (this.cells[i] != null) newcells[j++] = this.cells[i];
      this.cells = newcells;
      for (var i = 0; i < this.cells.length; i++) this.cells[i].compress();
      if (this.verbose) {
        print("Cell: compression gain = ");
        print(old - cnt);
      }
    }
  }

  //ANALYSIS
  //let LEFT__  = 0; //directions
  //let  RIGHT_  = 1;
  //let UPWARD  = 2;
  //let DNWARD  = 3;

  contains(xOther, yOther, epsilon) {
    //the cell is supposed to have an extra area of this.epsilon around it,
    //yields true if extended area of this cell contains the other point
    return (
      xOther >= this.xMin - this.epsilon &&
      xOther <= this.xMax + this.epsilon &&
      yOther >= this.yMin - this.epsilon &&
      yOther <= this.yMax + this.epsilon
    );
  }

  boxed() {
    return (
      (this.coparent == null && paboxed()) ||
      (this.coparent != null &&
        ((paboxed() && coboxed()) ||
          (paboxedXL(150) && coboxed()) ||
          (paboxed() && coboxedXL(150))))
    );
  }

  paboxed() {
    //whether this this.cells is boxed in the cell's parent
    return (
      this.xMin >= this.parent.xMin &&
      this.xMax <= this.parent.xMax &&
      this.yMin >= this.parent.yMin &&
      this.yMax <= this.parent.yMax
    );
  }

  coboxed() {
    //boxed in the cell's coparent
    return (
      this.xMin >= this.coparent.xMin &&
      this.xMax <= this.coparent.xMax &&
      this.yMin >= this.coparent.yMin &&
      this.yMax <= this.coparent.yMax
    );
  }

  paboxedXL(XL) {
    //boxed in a strectched ("eXtra Large") version of the the cell's parent
    if (this.parent.hori)
      return (
        this.xMin >= this.parent.xMin - XL &&
        this.xMax <= this.parent.xMax + XL &&
        this.yMin >= this.parent.yMin &&
        this.yMax <= this.parent.yMax
      );
    else if (this.parent.verti)
      return (
        this.xMin >= this.parent.xMin &&
        this.xMax <= this.parent.xMax &&
        this.yMin >= this.parent.yMin - XL &&
        this.yMax <= this.parent.yMax + XL
      );
    else return false;
  }

  coboxedXL(XL) {
    //boxed in the cell's this.coparent
    if (this.coparent.hori)
      return (
        this.xMin >= this.coparent.xMin - XL &&
        this.xMax <= this.coparent.xMax + XL &&
        this.yMin >= this.coparent.yMin &&
        this.yMax <= this.coparent.yMax
      );
    else if (this.coparent.verti)
      return (
        this.xMin >= this.coparent.xMin &&
        this.xMax <= this.coparent.xMax &&
        this.yMin >= this.coparent.yMin - XL &&
        this.yMax <= this.coparent.yMax + XL
      );
    else return false;
  }

  bumped(other, epsilon) {
    return;
    contains(other.xMin, other.yMin, this.epsilon) ||
      contains(other.xMin, other.yMax, this.epsilon) ||
      contains(other.xMax, other.yMin, this.epsilon) ||
      contains(other.xMax, other.yMax, this.epsilon);
  }

  bumped(other, epsilon, richting) {
    //eg richting==LEFT__ then bumped means colision around this.xMin side of this cell, etc.
    var b = false;
    var xMid = (this.xMin + this.xMax) / 2;
    var yMid = (this.yMin + this.yMax) / 2;
    var other_xMid = (other.xMin + other.xMax) / 2;
    var other_yMid = (other.yMin + other.yMax) / 2;
    switch (richting) {
      case this.LEFT__:
        b =
          other.contains(this.xMin, this.yMin, this.epsilon) ||
          this.contains(other.xMax, other.yMin, this.epsilon) ||
          other.contains(this.xMin, this.yMid, this.epsilon) ||
          this.contains(other.xMax, other_yMid, this.epsilon) || //new
          other.contains(this.xMin, this.yMax, this.epsilon) ||
          this.contains(other.xMax, other.yMax, this.epsilon);
        break;
      case this.RIGHT_:
        b =
          other.contains(this.xMax, this.yMin, this.epsilon) ||
          this.contains(other.xMin, other.yMin, this.epsilon) ||
          other.contains(this.xMax, this.yMid, this.epsilon) ||
          this.contains(other.xMin, other_yMid, this.epsilon) || //new
          other.contains(this.xMax, this.yMax, this.epsilon) ||
          this.contains(other.xMin, other.yMax, this.epsilon);
        break;
      case this.UPWARD:
        b =
          other.contains(this.xMin, this.yMax, this.epsilon) ||
          this.contains(other.xMin, other.yMin, this.epsilon) ||
          other.contains(this.xMid, this.yMax, this.epsilon) ||
          this.contains(other_xMid, other.yMin, this.epsilon) || //new
          other.contains(this.xMax, this.yMax, this.epsilon) ||
          this.contains(other.xMax, other.yMin, this.epsilon);
        break;
      case this.DNWARD:
        b =
          other.contains(this.xMin, this.yMin, this.epsilon) ||
          this.contains(other.xMin, other.yMax, this.epsilon) ||
          other.contains(this.xMid, this.yMin, this.epsilon) ||
          this.contains(other_xMid, other.yMax, this.epsilon) || //new
          other.contains(this.xMax, this.yMin, this.epsilon) ||
          this.contains(other.xMax, other.yMax, this.epsilon);
        break;
    }
    return b && other.area() > 25; //was b && other.age > other.activation && !(other.clr.isWHITE()&&!this.clr.isGRIS());//a bit ad-hoc, admittedly
  }

  bumped(others, epsilon, richting) {
    var test = false;
    for (var i = 0; i < others.length; i++)
      if (others[i] != null && others[i] != this)
        if (bumped(others[i], this.epsilon, richting)) test = true;
    return test;
  }

  rated() {
    //i.e. respecting the ratio constraint
    var dx = max(0.01, this.xMax - this.xMin);
    var dy = this.yMax - this.yMin;
    return (
      this.ratio < 0 ||
      (dx < 5 && dy < 5) || //allow the small ones to start growing
      (0.8 * this.ratio <= dy / dx && dy / dx <= 1.2 * this.ratio)
    );
  }
  twin(other) {
    return (
      xCtr() == other.xCtr() &&
      this.xMin == other.xMin &&
      this.xMax == other.xMax
    );
  }

  //and a few auxiliaries for random choice:
  PROB(p) {
    return random(1.0) < p;
  } //true with probability p
  RAND2(lo, hi) {
    return int(floor(random(lo, hi + 1)));
  } //random in range
  RAND(hi) {
    return int(floor(random(0, hi + 1)));
  } //random in range from zero

  //GROWTH
  //first the preparations for the efficient collision detection
  //bours must be who-ever is reachable in dx
  //growth steps, so not beyond distance  2dx.
  //The term dx means "long distance" (radio ham slang).
  //The term "bours" is supposed to mean neighbour (but
  //I wanted a word as long as "cells").
  min8(a, b, c, d, e, f, g, h) {
    var ab = min(a, b);
    var cd = min(c, d);
    var ef = min(e, f);
    var gh = min(g, h);
    var abcd = min(ab, cd);
    var efgh = min(ef, gh);
    return min(abcd, efgh);
  }
  mindist(c, d) {
    //this distance is like the manhattan distance, but
    //now taking the minimum instead of adding x and y.
    return min8(
      abs(c.xMin - d.xMin),
      abs(c.xMin - d.xMax),
      abs(c.xMax - d.xMin),
      abs(c.xMax - d.xMax),
      abs(c.yMin - d.yMin),
      abs(c.yMin - d.yMax),
      abs(c.yMax - d.yMin),
      abs(c.yMax - d.yMax)
    );
  }
  newbours(dt) {
    //recalculate the set of new neighbours,
    //ie the this.cells bump-able within dx steps
    this.bours = this.cells;
    if (this.cells != null) {
      var newbours = new Array[this.cells.length]();
      var twodx = 2 * dt;
      var j = 0;
      for (var i = 0; i < this.cells.length; i++)
        if (this.cells[i] != null)
          if (mindist(this, this.cells[i]) <= twodx)
            newbours[j++] = this.cells[i];
      this.bours = new Cell(j);
      for (var i = 0; i < j; i++) this.bours[i] = newbours[i];
    }
  }

  grow4self() {
    //Grow the cell but no this.cells inside this, just
    //check the others, the box and respect ratio.
    var others = this.parent.cells;
    if (this.verti) {
      var step = 1;
      this.yMin -= step;
      if (
        (this.stoppi && bumped(others, this.epsilon, this.DNWARD)) ||
        !boxed() ||
        !rated()
      )
        this.yMin += step;
      this.yMax += step;
      if (
        (this.stoppi && bumped(others, this.epsilon, this.UPWARD)) ||
        !boxed() ||
        !rated()
      )
        this.yMax -= step;
    } //so we do backtracking
    if (this.hori) {
      var step = 1;
      this.xMin -= step;
      if (
        (this.stoppi && bumped(others, this.epsilon, this.LEFT__)) ||
        !boxed() ||
        !rated()
      )
        this.xMin += step;
      this.xMax += step;
      if (
        (this.stoppi && bumped(others, this.epsilon, this.RIGHT_)) ||
        !boxed() ||
        !rated()
      )
        this.xMax -= step;
    }
  }
  grow4rec() {
    //now for recursion dont grow eg canvas but grow this.cells inside
    for (var i = 0; i < this.cells.length; i++) {
      if (this.cells[i] != null) {
        this.cells[i].grow();
        //cells[i].shrink();//rethink
      }
    }
  }
  grow() {
    if (this.age % this.dt == 0) newbours(this.dt);
    //every dx steps update bours
    if (this.age > this.activation) {
      if (this.parent != null && this.parent.cells != null) grow4self();
      if (this.cells != null) grow4rec();
    }
    if (this.age == this.midlifetrigger) {
      trigger();
      newbours(this.dt);
      //just in case the trigger changes things:
      //update bours (ps means here "neighbours"
    }
    this.age++;
  } //end grow

  grow_steps(steps) {
    if (steps > 0) {
      grow();
      grow_steps(steps - 1);
    }
  }
  nogrow() {
    this.hori = false;
    this.verti = false;
  }

  //APOPTOSIS
  exit() {
    if (this.parent != null)
      if (this.parent.cells != null)
        for (var i = 0; i < this.parent.cells.length; i++)
          if (this.parent.cells[i] == this) this.parent.cells[i] = null;
  }

  exitIfOutLier(canvas) {
    //remove self if x,y outside lozenge
    if (this.xMax < canvas.xMin(yCtr()) || this.xMin > canvas.xMax(yCtr()))
      exit();
  } //end exitIfOutLier

  //TRIGGERED ACTION
  trigger() {
    //callback by the growth engine triggered at midlifetrigger
    //for example delayed composition and various cleanups
    if (type == "HLine") {
      this instanceof HLine && this.trigger();
    } else if (type == "VLine") {
      this instanceof VLine && this.trigger();
    } else if (type == "Canvas") {
      this instanceof Canvas && this.trigger();
    } else if (type == "Mini") {
      this instanceof Mini && this.trigger();
    } else if (type == "Quad") {
      this instanceof Quad && this.trigger();
    } else if (type == "Atom") {
      this instanceof Atom && this.trigger();
    } else if (type == "Cell") {
      this instanceof Cell && this.trigger();
    } else print("TRIGGER CALLBACK FAILURE");
  }

  //PRESENTATION
  orect(xMin, yMin, xMax, yMax) {
    //old rectangle: add a bit of speckles
    fill(this.clr.clr);
    rect(xMin, this.yMin, xMax, this.yMax);
    noFill();
    stroke(this.clr.darker().darker().clr);
    if ((xMax - xMin + this.yMax - this.yMin) % 2 > 0)
      stroke(this.clr.lighter().clr);
    else stroke(this.clr.darker().clr);
    rect(xMin + 1, this.yMin + 1, xMax - 2, this.yMax - 2);
    fill(this.clr.clr);
    stroke(this.clr.darker().clr);
    for (var i = 0; i < 25; i++)
      for (var j = 0; j < 12; j++)
        rect(
          this.xMin + ((i * i + 113 * j) % max(1, this.xMax - this.xMin)),
          this.yMin + ((i + j * i) % max(1, this.yMax - this.yMin)),
          0.5,
          0.5
        );
  }

  draw() {
    fill(this.clr.clr);
    if (boxing) stroke(new Color(BLACK).clr);
    else stroke(this.clr.clr);
    if (this.xMax - this.xMin > 4 && this.yMax - this.yMin > 4) {
      if (!oldlook)
        rect(
          this.xMin,
          this.yMin,
          this.xMax - this.xMin,
          this.yMax - this.yMin
        );
      if (oldlook)
        orect(
          this.xMin,
          this.yMin,
          this.xMax - this.xMin,
          this.yMax - this.yMin
        );
    }
    if (this.cells != null) {
      for (var i = this.cells.length - 1; i >= 0; i--) {
        if (this.cells[i] != null) {
          this.cells[i].draw();
        }
      }
    }
  } //end draw

  rontgen(foppen) {
    fill(0, 255, 0);
    stroke(0, 125, 0);
    if (this.hori && this.verti)
      rect(xCtr() - foppen, yCtr() - foppen, 2 * foppen, 2 * foppen);
    if (this.hori && !this.verti)
      rect(xCtr() - 2 * foppen, yCtr() - foppen, 4 * foppen, 2 * foppen);
    if (!this.hori && this.verti)
      rect(xCtr() - foppen, yCtr() - 2 * foppen, 2 * foppen, 4 * foppen);
    if (!this.hori && !this.verti)
      rect(xCtr() - foppen, yCtr() - foppen, 2 * foppen, 2 * foppen);
    if (this.cells != null) {
      for (var i = 0; i < this.cells.length; i++) {
        if (this.cells[i] != null) {
          this.cells[i].rontgen(max(2, foppen - 1));
        }
      }
    }
  }

  // tell() {
  //   tell(0);
  // }

  // tell(indent) {
  //   for (var i = 0; i < 4 * indent; i++) print(" ");
  //   print(this.type + ", ");
  //   this.clr.tell();
  //   print(",xMin=");
  //   print(this.xMin);
  //   print(",xMax=");
  //   print(this.xMax);
  //   print(",yMin=");
  //   print(this.yMin);
  //   print(",yMax=");
  //   print(this.yMax);
  //   print(",hori=");
  //   print(this.hori);
  //   print(",verti=");
  //   print(this.verti);
  //   print(",stoppi=");
  //   print(this.stoppi);
  //   print(",ratio=");
  //   print(this.ratio);
  //   print(",epsilon=");
  //   print(this.epsilon);
  //   print(",dydx()=");
  //   print(this.dydx());
  //   if (this.cells != null) {
  //     for (var i = this.cells.length - 1; i >= 0; i--) {
  //       if (this.cells[i] != null) {
  //         this.cells[i].tell(indent + 1);
  //       }
  //     }
  //   }
  // } //end tell

  count() {
    var n = 1;
    if (this.cells != null)
      for (var i = 0; i < this.cells.length; i++)
        if (this.cells[i] != null) n += this.cells[i].count();
    return n;
  } //end  count
} //end Cell
