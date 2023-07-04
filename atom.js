class Atom extends Cell {
    constructor(parent, coparent = null) {
        super();
        this.type = "Atom";
        this.hori = true;
        this.verti = true;
        this.stoppi = true;
        this.ratio = 1.0;
        this.parent = parent;
        this.clr = new Color();
        if (coparent != null) {
            this.coparent = coparent;
            this.midlifetrigger = 500;
            this.clr.color_3(RED, NAVY, WHITE);
        }
        else {
            this.clr.color_6(RED, YELLOW, BLUE, WHITE, GRIS, BLACK);
        }
    }

    split() {
        this.cells = new Array(2);
        for (let i = 0; i < this.cells.length; i++) {
            this.cells[i] = new Atom(this);
            this.cells[i].ratio = -1;
            this.cells[i].clr = (i == 0) ? this.clr : this.clr.complementary();
            this.cells[i].setxy(this.xCtr() + ((i == 0) ? 4 : -4), this.yCtr());
        }
    }

    trigger() {
        if (this.parent != null && this.coparent != null)
            if (this.prob(0.3))
                this.split();
    }
}