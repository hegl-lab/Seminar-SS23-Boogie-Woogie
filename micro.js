class Micro extends Cell {
    constructor(parent) {
        super();
        this.type = "Micro";
        this.parent = parent;
        let y = this.parent.yCtr() + this.rand_lo_hi(-75, 75);
        let x = (this.prob(0.5)) ? this.parent.xMin + this.rand_hi(75) : this.parent.xMax - this.rand_hi(75);
        this.setxy(x, y);
        this.hori = true;
        this.verti = true;
        this.stoppi = true;
        this.ratio = 1.0;
        this.clr = this.parent.clr;
        this.epsilon = 10;
        this.activation = 10;
        this.midlifetrigger = this.activation + 50;
    }

    largeEnough() {
        return (this.xMax - this.xMin > 40 || this.yMax - this.yMin > 40);
    }

    setup() {
        this.hori = false;
        this.verti = false;
        if (this.largeEnough()) {
            this.cells = new Array(1);
            let a = new Micro(this);
            a.xMin = this.xCtr() - int(random(10, 15));
            a.xMax = this.xCtr() + int(random(10, 15));
            a.yMin = this.yCtr() - int(random(15, 20));
            a.yMax = this.yCtr() + int(random(15, 20));
            a.hori = false;
            a.verti = false;
            a.clr = new Color(YELLOW);
            this.insert(a);
            a.cells = new Array(1);
            let b = new Atom(a);
            b.xMax = a.xMax;
            b.yMax = a.yMax;
            b.xMin = a.xMin + (a.xMax - a.xMin) / 3;
            b.yMin = a.yMin + (a.yMax - a.yMin) / 3;
            b.hori = false;
            b.verti = false;
            b.clr = (this.prob(0.6)) ? new Color(GRIS) : new Color(BLACK);
            a.insert(b);
        }
        else this.exit();
    }

    trigger() {
        if (this.parent.type == "Canvas")
            this.setup();
    }
}