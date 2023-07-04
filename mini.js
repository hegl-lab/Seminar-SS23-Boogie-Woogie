const INF = 1000000;

class Mini extends Cell {
    constructor(parent) {
        super();
        this.type = "Mini";
        this.parent = parent;
        let dx;
        let dy;
        if (this.prob(0.25)) {
            dx = 5;
            dy = 3;
        }
        else if (this.prob(0.50)) {
            dx = 3;
            dy = 5;
        }
        else {
            dx = 2;
            dy = 2;
        }
        let x = dx + int(random(this.parent.xMin, this.parent.xMax - dx));
        let y = dy + int(random(this.parent.yMin, this.parent.yMax - dy));
        this.xMin = x;
        this.xMax = x + dx;
        this.yMin = y;
        this.yMax = y + dy;
        this.clr = new Color();
        this.clr.color_5(GRIS, RED, BLUE, WHITE, YELLOW);
        this.hori = true;
        this.verti = true;
        this.stoppi = true;
        if (this.prob(0.75)) this.ratio = (dy) / (dx)
        else this.ratio = -1;
        this.activation = 800 + this.rand_hi(200);
        this.midlifetrigger = this.activation + 200;
    }

    fast() {
        this.activation = 50;
        this.midlifetrigger = this.activation + 200;
    }

    done() {
        this.midlifetrigger = -1;
    }

    fuzzy(a, lo1, lo2, hi1, hi2) {
        let f1 = (a - lo1) / max(0.01, lo2 - lo1);
        let f2 = 1 - (a - hi1) / max(0.01, hi2 - hi1);
        if (f1 < 0) f1 = 0;
        if (f1 > 1) f1 = 1;
        if (f2 < 0) f2 = 0;
        if (f2 > 1) f2 = 1;
        return f1 * f2;
    }

    tiny() { return this.fuzzy(this.area(), 0, 0, 1000, 2000); }
    small() { return this.fuzzy(this.area(), 1000, 2000, 3000, 4000); }
    medium() { return this.fuzzy(this.area(), 3000, 4000, 6000, 8000); }
    large() { return this.fuzzy(this.area(), 6000, 8000, INF, INF); }

    hstretched() { return this.fuzzy(this.dydx(), 0.00, 0.00, 0.66, 1.50); }
    squarish() { return this.fuzzy(this.dydx(), 0.66, 0.80, 1.25, 1.50); }
    square() { return this.fuzzy(this.dydx(), 0.75, 0.90, 1.10, 1.25); }
    vstretched() { return this.fuzzy(this.dydx(), 0.66, 1.50, INF, INF); }
    recursible() { return this.fuzzy(this.nesting(), 0.00, 0.00, 0.80, 3.20); }

    truth() { return 1.0; }
    not(p) { return 1 - p; }
    prob(p) { return random(1.0) < p; }

    setup() {
        this.nogrow();
        let retry = 0;
        let finished = (this.cells != null || this.type == "Atom");
        while (!finished) {
            if (retry++ > 1000) finished = true;
            let num = floor(random(22));
            switch (num) {
                case 0:  if (this.prob(this.recursible()) && this.prob(this.hstretched()) && this.prob(this.tiny()))        { this.setupH2();   finished = true; } break;   
                case 1:  if (this.prob(this.recursible()) && this.prob(this.hstretched()) && this.prob(this.small()))       { this.setupG();    finished = true; } break;    
                case 2:  if (this.prob(this.recursible()) && this.prob(this.hstretched()) && this.prob(this.medium()))      { this.setupHN();   finished = true; } break;   
                case 3:  if (this.prob(this.recursible()) && this.prob(this.hstretched()) && this.prob(this.large()))       { this.setupHN();   finished = true; } break;   
                case 4:  if (this.prob(this.vstretched()) && this.prob(this.tiny()))                                        { this.setupA();    finished = true; } break;    
                case 5:  if (this.prob(this.vstretched()) && this.prob(this.small()))                                       { this.setupG();    finished = true; } break;    
                case 6:  if (this.prob(this.recursible()) && this.prob(this.vstretched()) && this.prob(this.medium()))      { this.setupVNL();  finished = true; } break;  
                case 7:  if (this.prob(this.vstretched()) && this.prob(this.medium()))                                      { this.setupG();    finished = true; } break;    
                case 8:  if (this.prob(this.recursible()) && this.prob(this.vstretched()) && this.prob(this.large()))       { this.setupVNU();  finished = true; } break;  
                case 9:  if (this.prob(this.recursible()) && this.prob(this.vstretched()) && this.prob(this.large()))       { this.setupVNL();  finished = true; } break;  
                case 10: if (this.prob(this.squarish())   && this.prob(this.tiny()))                                        { this.setupA();    finished = true; } break;         
                case 11: if (this.prob(this.recursible()) && this.prob(this.squarish())   && this.prob(this.small()))       { this.setupNxN();  finished = true; } break;       
                case 12: if (this.prob(this.recursible()) && this.prob(this.squarish())   && this.prob(this.small()))       { this.setupG();    finished = true; } break;         
                case 13: if (this.prob(this.squarish())   && this.prob(this.small()))                                       { this.setup2x2();  finished = true; } break;       
                case 14: if (this.prob(this.recursible()) && this.prob(this.squarish())   && this.prob(this.small()))       { this.setup2x2();  finished = true; } break;       
                case 15: if (this.prob(this.recursible()) && this.prob(this.squarish())   && this.prob(this.medium()))      { this.setupG();    finished = true; } break;         
                case 16: if (this.prob(this.recursible()) && this.prob(this.square())     && this.prob(this.tiny()))        { this.setup2x2();  finished = true; } break;       
                case 17: if (this.prob(this.recursible()) && this.prob(this.square())     && this.prob(this.small()))       { this.setupG();    finished = true; } break;         
                case 18: if (this.prob(this.recursible()) && this.prob(this.square())     && this.prob(this.small()))       { this.setup2x2();  finished = true; } break;       
                case 19: if (this.prob(this.recursible()) && this.prob(this.square())     && this.prob(this.medium()))      { this.setup2x2();  finished = true; } break;       
                case 20: if (this.prob(this.recursible()) && this.prob(this.square())     && this.prob(this.medium()))      { this.setupG();    finished = true; } break;         
                case 21: if (this.prob(0.01))                                                                               { this.setupA();    finished = true; } break;
            }
        }
    }

    setupA() {
        this.done();
    }

    setup2x2() {
        this.cells = new Array(4);
        let dx = this.xMax - this.xMin;
        let dy = this.yMax - this.yMin;
        this.cells[0] = new Atom(this);
        this.cells[1] = new Atom(this);
        this.cells[2] = new Atom(this);
        this.cells[3] = new Atom(this);

        this.cells[0].xMin = this.xMin;
        this.cells[0].xMax = this.xMin + dx / 2;
        this.cells[0].yMin = this.yMin;
        this.cells[0].yMax = this.yMin + dy / 2;

        this.cells[1].xMin = this.xMin + dx / 2;
        this.cells[1].xMax = this.xMax;
        this.cells[1].yMin = this.yMin;
        this.cells[1].yMax = this.yMin + dy / 2;

        this.cells[2].xMin = this.xMin;
        this.cells[2].xMax = this.xMin + dx / 2;
        this.cells[2].yMin = this.yMin + dy / 2;
        this.cells[2].yMax = this.yMax;

        this.cells[3].xMin = this.xMin + dx / 2;
        this.cells[3].xMax = this.xMax;
        this.cells[3].yMin = this.yMin + dy / 2;
        this.cells[3].yMax = this.yMax;

        this.cells[0].hori = false; this.cells[0].verti = false;
        this.cells[1].hori = false; this.cells[1].verti = false;
        this.cells[2].hori = false; this.cells[2].verti = false;
        this.cells[3].hori = false; this.cells[3].verti = false;

        this.cells[1].clr = this.cells[0].clr.fresh();
        this.cells[2].clr = this.cells[1].clr;
        this.cells[3].clr = this.cells[0].clr;
        this.done();
    }

    setupG() {
        let x = (this.xMin + this.xMax) / 2;
        let y = (this.yMin + this.yMax) / 2;
        if (this.prob(0.90)) {
            this.cells = new Array(1);
            let a = new Atom(this);
            let vari = ((this.xMax - this.xMin) > 50 && (this.yMax - this.yMin) > 50)
                ? this.rand_lo_hi(9, 13)
                : this.rand_lo_hi(5, min(this.xMax - this.xMin, this.yMax - this.yMin) / 4);
            a.xMin = x - vari;
            a.xMax = x + vari;
            a.yMin = y - vari;
            a.yMax = y + vari;
            a.clr = this.clr.complementary();
            a.hori = false;
            a.verti = false;
            if (a.boxed()) this.insert(a);
        }
        this.done();
    }

    setupNxN() {
        let dx = this.xMax - this.xMin;
        let dy = this.yMax - this.yMin;
        let Nx = max(1, round(dx / 10));
        let Ny = max(1, round(dy / 10));
        let xStep = dx / Nx;
        let yStep = dy / Ny;
        this.cells = new Array((Nx + 2) * (Ny + 2));
        let prevs = new Array(Nx + 1);
        for (let i = 0; i < prevs.length; i++) {
            prevs[i] = new Array(Ny + 1);
        }

        for (let i = 0; i < Nx; i++) {
            for (let j = 0; j < Ny; j++) {
                let a = new Atom(this);
                a.xMin = int(this.xMin + i * xStep);
                a.xMax = int(this.xMin + i * xStep + xStep);
                a.yMin = int(this.yMin + j * yStep);
                a.yMax = int(this.yMin + j * yStep + yStep);
                a.clr.color_6(RED, BLUE, YELLOW, BLACK, WHITE, GRIS);
                while (i > 0 && a.clr.isSAMELABEL(prevs[i - 1][j])
                    || j > 0 && a.clr.isSAMELABEL(prevs[i][j - 1]))
                    a.clr.color_6(RED, BLUE, YELLOW, BLACK, WHITE, GRIS);
                a.hori = false;
                a.verti = false;
                a.stoppi = true;
                a.activation = 100;
                prevs[i][j] = a.clr;
                this.insert(a);
            }
        }
        this.done();
    }

    setupVNU() {
        let N;
        if (this.dydx() > 3) N = 5;
        else if (this.dydx() > 2) N = 4;
        else N = 3;
        this.cells = new Array(N);
        let prevs = new Array(N);
        let h = new HLine(this);
        h.setxy((this.xMin + this.xMax) / 2, this.yMin + 4 + this.rand_hi(4));
        h.clr.color_1(WHITE);
        h.setup();
        h.yMin = this.yMin;
        h.yMax = this.yMin + 2 * (h.yCtr() - this.yMin);
        this.insert(h);

        let yBegin = h.yMax;
        let yStep = (this.yMax - yBegin) / (N - 1);
        let a = new Mini(this);
        yBegin += yStep / 2;
        a.setxy((this.xMax + this.xMin) / 2, int(yBegin));
        a.clr.color_4(GRIS, RED, BLUE, YELLOW);
        a.ratio = -1;
        a.fast();
        prevs[1] = a.clr;
        this.insert(a);

        for (let i = 2; i < N; i++) {
            let b = new Mini(this);
            yBegin += yStep;
            b.setxy((this.xMax + this.xMin) / 2, int(yBegin));
            b.clr.color_4(GRIS, RED, BLUE, YELLOW);
            while (b.clr.isSAMELABEL(prevs[i - 1]))
                b.clr.color_4(GRIS, RED, BLUE, YELLOW);
            b.ratio = -1;
            b.fast();
            prevs[i] = b.clr;
            this.insert(b);
        }
        this.done();
    }

    setupVNL() {
        let N;
        if (this.dydx() > 3) N = 5;
        else if (this.dydx() > 2) N = 4;
        else N = 3;
        this.cells = new Array(N);
        let prevs = new Array(N);
        let h = new HLine(this);
        h.setxy((this.xMin + this.xMax) / 2, this.yMax - 4 - this.rand_hi(4));
        h.clr.color_1(WHITE);
        h.setup();
        h.yMax = this.yMax;
        h.yMin = this.yMax - 2 * (this.yMax - h.yCtr());
        this.insert(h);

        let yEnd = h.yMin;
        let yStep = (yEnd - this.yMin) / (N - 1);
        let a = new Mini(this);
        let yBegin = this.yMin + yStep / 2;
        a.setxy((this.xMax + this.xMin) / 2, int(yBegin));
        a.clr.color_5(GRIS, RED, BLUE, YELLOW, WHITE);
        a.ratio = -1;
        a.fast();
        prevs[1] = a.clr;
        this.insert(a);

        for (let i = 2; i < N; i++) {
            let b = new Mini(this);
            yBegin += yStep;
            b.setxy((this.xMax + this.xMin) / 2, int(yBegin));
            b.clr.color_5(GRIS, RED, BLUE, YELLOW, WHITE);
            while (b.clr.isSAMELABEL(prevs[i - 1]))
                b.clr.color_5(GRIS, RED, BLUE, YELLOW, GRIS);
            b.ratio = -1;
            b.fast();
            prevs[i] = b.clr;
            this.insert(b);
        }
        this.done();
    }

    setupHN() {
        let N;
        if (this.dydx() < 0.33) N = 5;
        else if (this.dydx() < 0.50) N = 4;
        else N = 3;
        this.setupHN_N(N);
    }

    setupH2() {
        this.setupHN_N(2);
    }

    setupHN_N(N) {
        this.cells = new Array(N);
        let prevs = new Array(N);
        let xBegin = this.xMin;
        let xStep = (this.xMax - xBegin) / N;
        let a = new Mini(this);
        xBegin += xStep / 2;
        a.setxy(int(xBegin), (this.yMax + this.yMin) / 2);
        a.clr.color_5(GRIS, RED, BLUE, YELLOW, WHITE);
        a.ratio = -1;
        a.fast();
        prevs[0] = a.clr;
        this.insert(a);

        for (let i = 1; i < N; i++) {
            let b = new Mini(this);
            xBegin += xStep;
            b.setxy(int(xBegin) + this.rand_lo_hi(-int(xStep / 2), int(+xStep / 2)), (this.yMax + this.yMin) / 2);
            b.clr.color_5(GRIS, RED, BLUE, YELLOW, WHITE);
            while (b.clr.isSAMELABEL(prevs[i - 1]))
                b.clr.color_4(GRIS, RED, BLUE, YELLOW);
            b.ratio = -1;
            b.fast();
            prevs[i] = b.clr;
            this.insert(b);
        }
        this.done();
    }

    trigger() {
        this.setup();
        this.done();
    }
}