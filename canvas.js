
const WINHEIGHT = window.screen.height;
const MAXX = parseInt(WINHEIGHT / Math.sqrt(2));
const MAXY = parseInt(WINHEIGHT / Math.sqrt(2));

const NRQUADS = 2;
const NRHLINES = 10;
// const NRVLINES = 30;
const NRMINIS = 75;
const NRMICROS = 20;

class Canvas extends Cell {
    constructor(x, y) {
        super();
        this.type = "Canvas";
        this.xMin = x - MAXX / 2;
        this.xMax = x + MAXX / 2;
        this.yMin = y - MAXY / 2;
        this.yMax = y + MAXY / 2;
        this.parent = null;
        this.clr = new Color(WHITE);
        this.age = 0;
        this.midlifetrigger = 110;
    }

    minX(y) { if (y < this.yCtr()) return this.xMin + (this.yCtr() - y); else return this.xMin + (y - this.yCtr()); }
    maxX(y) { if (y < this.yCtr()) return this.xMax - (this.yCtr() - y); else return this.xMax - (y - this.yCtr()); }
    minY(x) { if (x < this.xCtr()) return this.yMin + (this.xCtr() - x); else return this.yMin + (x - this.xCtr()); }
    maxY(x) { if (x < this.xCtr()) return this.yMax - (this.xCtr() - x); else return this.xMax - (x - this.xCtr()); }

    setup() {
        this.cells = new Array(4 * NRQUADS + NRHLINES + NRMINIS + NRMICROS);
        this.midlifetrigger = 500;

        let qy = int(random(this.yMin + 50, this.yMin + 125));
        let qx = int(random(this.minX(qy) + 10, this.maxX(qy) - 10));
        let q = new Quad(this);
        q.setxy(qx, qy);
        q.setup(false);
        this.insert(q);

        q = new Quad(this);
        q.setxy(this.xCtr(), this.yMax - this.rand_lo_hi(50, 100));
        q.setup(true);
        this.insert(q);

        for (let i = 0; i < NRHLINES; i++) {
            let h = new HLine(this);
            this.insert(h);
        }

        // for (let i = 0; i < NRVLINES; i++) {
        //     let v = new VLine(this);
        //     this.insert(v);
        //     v.prep();
        //     if (v.stoppi) {
        //         let twin = new VLine(this);
        //         v.copy(twin);
        //         let y = (v.yCtr() < this.yMax / 2) ? 6 * this.yMax / 7 : this.yMax / 3;
        //         twin.yMin = y;
        //         twin.yMax = y;
        //         twin.prep();
        //         this.insert(twin);
        //     }
        // }

        this.purge1();

        for (let i = 0; i < this.cells.length; i++) {
            if (this.cells[i] != null && this.cells[i].type == "HLine") {
                this.cells[i].setup();
            }
        }

        // for (let i = 0; i < this.cells.length; i++) {
        //     if (this.cells[i] != null && this.cells[i].type == "VLine") {
        //         this.cells[i].setup();
        //     }
        // }

        for (let i = 0; i < NRMINIS; i++) {
            let m = new Mini(this);
            this.insert(m);
        }

        for (let i = 0; i < NRMICROS; i++) {
            let m = new Micro(this);
            this.insert(m);
        }

        this.purge2();
        this.purge3();
    }

    purge1() {
        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells.length; j++) {
                let ci = this.cells[i];
                let cj = this.cells[j];
                if (i != j && ci != null && cj != null && !ci.twin(cj)) {
                    if ((ci.type == "Micro" && cj.type == "Micro"
                        && abs(ci.xCtr() - cj.xCtr()) < 30 && abs(ci.yCtr() - cj.yCtr()) < 30)
                        || (ci.type == "Mini" && cj.type == "Mini" &&
                            (abs(ci.xCtr() - cj.xCtr()) < 30 && abs(ci.yCtr() - cj.yCtr()) < 30
                                || ci.bumped(cj, 0)))
                        || (ci.type == "HLine" && cj.type == "HLine"
                            && abs(ci.yCtr() - cj.yCtr()) <= 3 + (ci.yMax - ci.yMin) / 2 + (cj.yMax - cj.yMin) / 2)
                        || (ci.type == "VLine" && cj.type == "VLine"
                            && abs(ci.xCtr() - cj.xCtr()) <= 3 + (ci.xMax - ci.xMin) / 2 + (cj.xMax - cj.xMin) / 2)) {
                        this.cells[i] = null;
                    }
                }
            }
        }
    }

    purge2() {
        if (this.cells != null)
            for (let i = 0; i < this.cells.length; i++)
                if (this.cells[i] != null) {
                    this.cells[i].exitIfOutLier(this);
                }
    }

    purge3() {
        for (let i = 0; i < this.cells.length; i++)
            if (this.cells[i] != null)
                if (this.cells[i].type == "HLine")
                    if (this.cells[i].yCtr() < this.yMin + 50
                        || this.cells[i].yCtr() > this.yMax - 50)
                        this.cells[i] = null;

        for (let i = 0; i < this.cells.length; i++)
            if (this.cells[i] != null)
                if (this.cells[i].type == "VLine")
                    if (this.cells[i].xCtr() < this.xMin + 75
                        || this.cells[i].xCtr() > this.xMax - 75)
                        this.cells[i] = null;

        for (let i = 0; i < this.cells.length; i++)
            if (this.cells[i] != null)
                if (this.cells[i].type == "Mini")
                    if (this.cells[i].xCtr() < this.xMin + 100
                        || this.cells[i].xCtr() > this.xMin + 800
                        || this.cells[i].yCtr() < this.yMin + 100)
                        this.cells[i] = null;
    }

    trigger() {
        this.compress();
    }

    lozenge() {
        fill(255, 255, 255, 255);
        stroke(255, 255, 255, 255);

        let xMin = (width - MAXX) / 2;
        let xMax = (width + MAXX) / 2 + 1;
        let xCtr = (width) / 2;
        let yMin = (height - MAXY) / 2;
        let yMax = (height + MAXY) / 2 + 1;
        let yCtr = (height) / 2;
        triangle(xMin, yMin, xCtr, yMin, xMin, yCtr);
        triangle(xCtr, yMin, xMax, yMin, xMax, yCtr);
        triangle(xMax, yCtr, xMax, yMax, xCtr, yMax);
        triangle(xCtr, yMax, xMin, yMax, xMin, yCtr);
        stroke(180, 180, 180);
        line(xCtr, yMin, xMin, yCtr);
        line(xCtr, yMin, xMax, yCtr);
        line(xMax, yCtr, xCtr, yMax);
        line(xCtr, yMax, xMin, yCtr);
    }

    draw() {
        super.draw();
        this.lozenge();
    }
}