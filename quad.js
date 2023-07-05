class Quad extends Cell {
    constructor(parent) {
        super();
        this.type = "Quad";
        this.parent = parent;
        this.clr = this.parent.clr;
        this.hori = true;
        this.verti = true;
        this.stoppi = true;
        this.ratio = 0.75;
        this.activation = 0;
        this.midlifetrigger = 100;
    }

    setxy_size(x, y, hsize, vsize) {
        this.xMin = x - hsize / 2;
        this.xMax = x + hsize / 2;
        this.yMin = y - vsize / 2;
        this.yMax = y + vsize / 2;
    }

    setup(faux) {
        this.setxy_size(this.xCtr(), this.yCtr(), 100, 100);
        this.cells = new Array(4);
        for (let i = 0; i < 4; i++) {
            let x = this.xCtr();
            let y = this.yCtr();
            let c = new Quad(this);
            c.setxy(this.xCtr(), this.yCtr());
            c.clr = (i == 1) ? new Color(WHITE) : (i == 2) ? new Color(WHITE) : new Color(GRIS);
            c.hori = (i != 1);
            c.verti = (i != 1);
            x += (i > 1) ? 11 : 0;
            y += (i % 2 == 1) ? 9 : 0;
            c.setxy_size(x, y, 10, 8);
            this.insert(c);
        }
        if (faux) this.setupBIS();
    }

    setupBIS() {
        let offset = this.rand_hi(50);
        this.cells[1].clr = new Color(YELLOW);
        this.cells[1].xMin -= offset;
        this.cells[1].xMax -= offset;
        this.cells[1].hori = true;
        this.cells[2].clr = new Color(YELLOW);
    }

    schrapnel() {
        if (this.cells != null) {
            for (let i = 0; i < this.cells.length; i++) {
                this.cells[i].verti = this.cells[i].hori;
                this.cells[i].parent = this.parent;
                this.parent.insert(this.cells[i]);
            }
        }
        if (this.cells != null) this.exit();
    }

    trigger() {
        this.schrapnel();
    }
}