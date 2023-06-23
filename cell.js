const LEFT__ = 0;
const RIGHT_ = 1;
const UPWARD = 2;
const DNWARD = 3;
const DT = 50;

class Cell {
    constructor() {
        this.type = "Cell";
        this.parent = null;
        this.coparent = null;
        this.xMin;
        this.xMax;
        this.yMin;
        this.yMax;
        this.clr;
        this.hori;
        this.verti;
        this.stoppi;
        this.ratio = -1;
        this.age = 0;
        this.epsilon = 0;
        this.activation = 0;
        this.midlifetrigger = 0;
        this.cells = null;
        this.bours = null;
    }

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
        return (this.yMax - this.yMin) / max(0.1, (this.xMax - this.xMin));
    }

    nesting() {
        if (this.parent == null) return 0;
        else return 1 + this.parent.nesting();
    }

    biparental() {
        return (this.parent != null && this.coparent != null);
    }

    setxy(x, y) {
        this.xMin = x - 1;
        this.xMax = x + 1;
        this.yMin = y - 1;
        this.yMax = y + 1;
    }

    copy(dst) {
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
            for (let i = 0; i < this.cells.length; i++) {
                if (this.cells[i] != null) {
                    dst.cells[i] = new Cell();
                    this.cells[i].copy(dst.cells[i]);
                }
            }
        }
    }

    insert(c) {
        if (this.cells != null) {
            let i = 0;
            while (i < this.cells.length && this.cells[i] != null)
                i++;
            if (i < this.cells.length) {
                this.cells[i] = c;
            } else {
                console.log("Cell: INSERT FAILED");
            }
        } else {
            console.log("Cell: INSERT FAILED");
        }
    }

    insertUnique(c) {
        let found = false;
        if (this.cells != null)
            for (let i = 0; i < this.cells.length; i++)
                if (this.cells[i] != null)
                    if (this.cells[i].xCtr() == c.xCtr() &&
                        this.cells[i].yCtr() == c.yCtr())
                        found = true;
        if (!found) this.insert(c);
    }

    insertCells(c) {
        if (c.cells != null)
            for (let i = 0; i < c.cells.length; i++)
                this.insert(c.cells[i]);
    }

    compress() {
        if (this.cells != null) {
            let cnt = 0;
            for (let i = 0; i < this.cells.length; i++)
                if (this.cells[i] != null)
                    cnt++;
            let newcells = new Array(cnt);
            let j = 0;
            for (let i = 0; i < this.cells.length; i++)
                if (this.cells[i] != null)
                    newcells[j++] = this.cells[i];
            this.cells = newcells;
            for (let i = 0; i < this.cells.length; i++)
                this.cells[i].compress();
        }
    }

    contains(xOther, yOther, epsilon) {
        return (
            xOther >= this.xMin - epsilon &&
            xOther <= this.xMax + epsilon &&
            yOther >= this.yMin - epsilon &&
            yOther <= this.yMax + epsilon
        );
    }

    boxed() {
        return (
            (this.coparent == null && this.paboxed()) ||
            (this.coparent != null &&
                ((this.paboxed() && this.coboxed()) ||
                    (this.paboxedXL(150) && this.coboxed()) ||
                    (this.paboxed() && this.coboxedXL(150))))
        );
    }

    paboxed() {
        return (
            this.xMin >= this.parent.xMin &&
            this.xMax <= this.parent.xMax &&
            this.yMin >= this.parent.yMin &&
            this.yMax <= this.parent.yMax
        );
    }

    coboxed() {
        return (
            this.xMin >= this.coparent.xMin &&
            this.xMax <= this.coparent.xMax &&
            this.yMin >= this.coparent.yMin &&
            this.yMax <= this.coparent.yMax
        );
    }

    paboxedXL(XL) {
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
        return (
            contains(other.xMin, other.yMin, epsilon) ||
            contains(other.xMin, other.yMax, epsilon) ||
            contains(other.xMax, other.yMin, epsilon) ||
            contains(other.xMax, other.yMax, epsilon)
        );
    }

    bumped_direction(other, epsilon, direction) {
        let b = false;
        let xMid = (this.xMin + this.xMax) / 2;
        let yMid = (this.yMin + this.yMax) / 2;
        let other_xMid = (other.xMin + other.xMax) / 2;
        let other_yMid = (other.yMin + other.yMax) / 2;
        switch (direction) {
            case LEFT__:
                b =
                    other.contains(this.xMin, this.yMin, epsilon) ||
                    this.contains(other.xMax, other.yMin, epsilon) ||
                    other.contains(this.xMin, yMid, epsilon) ||
                    this.contains(other.xMax, other_yMid, epsilon) ||
                    other.contains(this.xMin, this.yMax, epsilon) ||
                    this.contains(other.xMax, other.yMax, epsilon);
                break;
            case RIGHT_:
                b =
                    other.contains(this.xMax, this.yMin, epsilon) ||
                    this.contains(other.xMin, other.yMin, epsilon) ||
                    other.contains(this.xMax, yMid, epsilon) ||
                    this.contains(other.xMin, other_yMid, epsilon) ||
                    other.contains(this.xMax, this.yMax, epsilon) ||
                    this.contains(other.xMin, other.yMax, epsilon);
                break;
            case UPWARD:
                b =
                    other.contains(this.xMin, this.yMax, epsilon) ||
                    this.contains(other.xMin, other.yMin, epsilon) ||
                    other.contains(xMid, this.yMax, epsilon) ||
                    this.contains(other_xMid, other.yMin, epsilon) ||
                    other.contains(this.xMax, this.yMax, epsilon) ||
                    this.contains(other.xMax, other.yMin, epsilon);
                break;
            case DNWARD:
                b =
                    other.contains(this.xMin, this.yMin, epsilon) ||
                    this.contains(other.xMin, other.yMax, epsilon) ||
                    other.contains(xMid, this.yMin, epsilon) ||
                    this.contains(other_xMid, other.yMax, epsilon) ||
                    other.contains(this.xMax, this.yMin, epsilon) ||
                    this.contains(other.xMax, other.yMax, epsilon);
                break;
        }
        return b && other.area() > 25;
    }

    bumped_others(others, epsilon, direction) {
        let test = false;
        for (let i = 0; i < others.length; i++)
            if (others[i] != null && others[i] != this)
                if (this.bumped_direction(others[i], epsilon, direction))
                    test = true;
        return test;
    }

    rated() {
        let dx = max(0.01, this.xMax - this.xMin);
        let dy = this.yMax - this.yMin;
        return (
            this.ratio < 0 ||
            (dx < 5 && dy < 5) ||
            (0.8 * this.ratio <= dy / dx && dy / dx <= 1.2 * this.ratio)
        );
    }

    twin(other) {
        return (
            this.xCtr() == other.xCtr() &&
            this.xMin == other.xMin &&
            this.xMax == other.xMax
        );
    }

    prob(p) {
        return random(1.0) < p;
    }

    rand_lo_hi(lo, hi) {
        return int(floor(random(lo, hi + 1)));
    }

    rand_hi(hi) {
        return int(floor(random(0, hi + 1)));
    }

    min8(a, b, c, d, e, f, g, h) {
        let ab = min(a, b);
        let cd = min(c, d);
        let ef = min(e, f);
        let gh = min(g, h);
        let abcd = min(ab, cd);
        let efgh = min(ef, gh);
        return min(abcd, efgh);
    }

    mindist(c, d) {
        return this.min8(
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
        this.bours = this.cells;
        if (this.cells != null) {
            let newbours = new Array(this.cells.length);
            let twodx = 2 * dt;
            let j = 0;
            for (let i = 0; i < this.cells.length; i++)
                if (this.cells[i] != null)
                    if (this.mindist(this, this.cells[i]) <= twodx)
                        newbours[j++] = this.cells[i];
            this.bours = new Array(j);
            for (let i = 0; i < j; i++) {
                this.bours[i] = newbours[i];
            }
        }
    }

    grow4self() {
        let others = this.parent.cells;

        if (this.verti) {
            let step = 1;
            this.yMin -= step;
            if ((this.stoppi &&
                this.bumped_others(others, this.epsilon, DNWARD)) ||
                !this.boxed() ||
                !this.rated())
                this.yMin += step;

            this.yMax += step;
            if ((this.stoppi &&
                this.bumped_others(others, this.epsilon, UPWARD)) ||
                !this.boxed() ||
                !this.rated())
                this.yMax -= step;
        }

        if (this.hori) {
            let step = 1;
            this.xMin -= step;
            if ((this.stoppi &&
                this.bumped_others(others, this.epsilon, LEFT__)) ||
                !this.boxed() ||
                !this.rated())
                this.xMin += step;

            this.xMax += step;
            if ((this.stoppi &&
                this.bumped_others(others, this.epsilon, RIGHT_)) ||
                !this.boxed() ||
                !this.rated())
                this.xMax -= step;
        }
    }

    grow4rec() {
        for (let i = 0; i < this.cells.length; i++) {
            if (this.cells[i] != null) {
                this.cells[i].grow();
            }
        }
    }

    grow() {
        if (this.age % DT == 0) {
            this.newbours(DT);
        }
        if (this.age > this.activation) {
            if (this.parent != null && this.parent.cells != null) this.grow4self();
            if (this.cells != null) this.grow4rec();
        }
        if (this.age == this.midlifetrigger) {
            this.trigger();
            this.newbours(DT);
        }
        this.age++;
    }

    nogrow() {
        this.hori = false;
        this.verti = false;
    }

    exit() {
        if (this.parent != null)
            if (this.parent.cells != null)
                for (let i = 0; i < this.parent.cells.length; i++)
                    if (this.parent.cells[i] == this) this.parent.cells[i] = null;
    }

    exitIfOutLier(canvas) {
        if (this.xMax < canvas.minX(this.yCtr()) ||
            this.xMin > canvas.maxX(this.yCtr()))
            this.exit();
    }

    trigger() {
        if (this.type == "HLine") {
            this.trigger();
        } else if (this.type == "VLine") {
            this.trigger();
        } else if (this.type == "Canvas") {
            this.trigger();
        } else if (this.type == "Mini") {
            this.trigger();
        } else if (this.type == "Quad") {
            this.trigger();
        } else if (this.type == "Atom") {
            this.trigger();
        } else if (this.type == "Cell") {
            this.trigger();
        }
    }

    draw() {
        noStroke();
        fill(this.clr.clr);
        if (this.xMax - this.xMin > 4 && this.yMax - this.yMin > 4) {
            rect(this.xMin, this.yMin, this.xMax - this.xMin, this.yMax - this.yMin);
        }
        if (this.cells != null) {
            for (let i = this.cells.length - 1; i >= 0; i--) {
                if (this.cells[i] != null) {
                    this.cells[i].draw();
                }
            }
        }
    }
}