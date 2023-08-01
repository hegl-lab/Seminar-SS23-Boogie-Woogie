class HLine extends Cell {
    constructor(parent) {
        super();
        this.type = "HLine";
        this.parent = parent;
        let x = int(random(WINSIZE/2, window.screen.width*(2/3)));
        this.rnd = this.parent.yMax - this.parent.yMin;
        if (this.parent.type == "Canvas") {
            this.setxy(
                this.rand_lo_hi(this.parent.xMin + this.rnd/5, this.parent.xMax - this.rnd/5),
                this.rand_lo_hi(this.parent.yMin + this.rnd/5, this.parent.yMax - this.rnd/5));
        } else {
            this.setxy(
                this.rand_lo_hi(this.parent.xMin + 10, this.parent.xMax - 10),
                this.rand_lo_hi(this.parent.yMin + 10, this.parent.yMax - 10));
        }
        this.clr = new Color(YELLOW);
        this.hori = true;
        this.verti = false;
        this.stoppi = (abs(this.yCtr() - this.parent.yCtr()) < 50) || this.prob(0.7);
        this.midlifetrigger = this.activation + 1000;
        this.cells = new Array(NRATOMS);
        for (let k = 0; k < this.cells.length; k++)
            this.cells[k] = null;

    }

    setxy(x, y) {
        this.xMin = x - 1;
        this.xMax = x + 1;
        this.yMin = y - this.rnd/110 - int(random(this.rnd/130));
        this.yMax = y + this.rnd/110 + int(random(this.rnd/110));
    }

    setup() {
        for (let j = 0; j < this.parent.cells.length; j++) {
            let cj = this.parent.cells[j];
            if (cj != this && cj != null && cj.type == "VLine") {
                let coparent = cj;
                let a = new Atom(this, coparent);
                coparent.insert(a);
                a.xMin = coparent.xCtr() - 1;
                a.xMax = coparent.xCtr() + 1;
                a.yMin = this.yCtr() - 1;
                a.yMax = this.yCtr() + 1;
                a.ratio = -1;
                this.insertUnique(a);
            }
        }
        for (let i = 0; i < NRRHYTHMPLANES; i++) {
            let a = new Atom(this);
            a.clr.color_5(RED, BLUE, WHITE, GRIS, NAVY);
            let x = int(random(this.parent.xMin, this.parent.xMax));
            let y = this.yCtr();
            a.xMin = x - 1;
            a.xMax = x + 1;
            a.yMin = y - 2;
            a.yMax = y + 2;
            a.hori = true;
            a.verti = true;
            a.stoppi = true;
            a.epsilon = (this.yMax - this.yMin) / 3;
            a.ratio = 2.0;
            this.insert(a);
        }
        this.purge1();
        this.purge2();
    }

    purge1() {
        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells.length; j++) {
                let ci = this.cells[i];
                let cj = this.cells[j];
                if (i != j && ci != null && cj != null)
                    if ((!cj.biparental() &&
                        abs(ci.xCtr() - cj.xCtr()) < ci.epsilon + cj.epsilon) ||
                        (cj.biparental() &&
                            abs(ci.xCtr() - cj.xCtr()) < cj.coparent.xMax - cj.coparent.xMin + ci.epsilon))
                        if (!this.cells[i].biparental())
                            this.cells[i] = null;
            }
        }
    }

    purge2() {
        if (this.parent.type == "Canvas")
            if (this.cells != null)
                for (let i = 0; i < this.cells.length; i++)
                    if (this.cells[i] != null)
                        if (this.cells[i].xMax < this.parent.minX(this.cells[i].yCtr()) ||
                            this.cells[i].xMin > this.parent.maxX(this.cells[i].yCtr()))
                            this.cells[i] = null;
    }

    purge3() {
        for (let i = 0; i < this.cells.length; i++)
            if (this.cells[i] != null
                && this.cells[i].yMax - this.cells[i].yMin + 1 < 0.9 * (this.yMax - this.yMin)
                && (this.cells[i].coparent == null ||
                    this.cells[i].yMax - this.cells[i].yMin + 1 < 0.9 * (this.cells[i].coparent.yMax - this.cells[i].coparent.yMin)))
                this.cells[i] = null;
    }

    trigger() {
        this.purge3();
        this.compress();
    }
}