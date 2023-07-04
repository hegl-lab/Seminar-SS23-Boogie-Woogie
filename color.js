const RED = 0;
const BLUE = 1;
const YELLOW = 2;
const BLACK = 3;
const WHITE = 4;
const GRIS = 5;
const NAVY = 6;

class Color {
    constructor(label = null) {
        this.label;
        this.clr;
        if (label !== null) {
            this.color_1(label);
        }
    }

    color_1(label) {
        let w;
        this.label = label;
        let DM = this.rand_lo_hi(-8, 8);
        let DA = this.rand_lo_hi(-6, 6);
        let DS = this.rand_lo_hi(-4, 4);
        let DT = this.rand_lo_hi(-4, 4);
        switch (label) {
            case RED:
                this.clr = color(225 + DM, 15 + DS, 8 + DT);
                break;
            case BLUE:
                this.clr = color(30 + DM, 60 + DS, 141 + DT);
                break;
            case YELLOW:
                this.clr = color(238 + DM, 176 + DA, 14 + DT);
                break;
            case BLACK:
                w = 10;
                this.clr = color(w, w, w);
                break;
            case WHITE:
                w = int(random(215, 250));
                this.clr = color(w, w, w);
                break;
            case GRIS:
                w = int(random(140, 180));
                this.clr = color(w, w, w);
                break;
            case NAVY:
                this.clr = color(15, 20, random(70, 100));
                break;
        }
    }

    color_2(label1, label2) { let c = this.prob(0.5) ? new Color(label1) : new Color(label2); this.label = c.label; this.clr = c.clr; }
    color_3(label1, label2, label3) { let c = this.prob(0.33) ? new Color(label1) : this.prob(0.50) ? new Color(label2) : new Color(label3); this.label = c.label; this.clr = c.clr; }
    color_4(label1, label2, label3, label4) { let c = this.prob(0.25) ? new Color(label1) : this.prob(0.33) ? new Color(label2) : this.prob(0.50) ? new Color(label3) : new Color(label4); this.label = c.label; this.clr = c.clr; }
    color_5(label1, label2, label3, label4, label5) { let c = this.prob(0.20) ? new Color(label1) : this.prob(0.25) ? new Color(label2) : this.prob(0.33) ? new Color(label3) : this.prob(0.50) ? new Color(label4) : new Color(label5); this.label = c.label; this.clr = c.clr; }
    color_6(label1, label2, label3, label4, label5, label6) { let c = this.prob(0.16) ? new Color(label1) : this.prob(0.20) ? new Color(label2) : this.prob(0.25) ? new Color(label3) : this.prob(0.33) ? new Color(label4) : this.prob(0.50) ? new Color(label5) : new Color(label6); this.label = c.label; this.clr = c.clr; }
    color_7(label1, label2, label3, label4, label5, label6, label7) { let c = this.prob(0.14) ? new Color(label1) : this.prob(0.16) ? new Color(label2) : this.prob(0.20) ? new Color(label3) : this.prob(0.25) ? new Color(label4) : this.prob(0.33) ? new Color(label5) : this.prob(0.50) ? new Color(label6) : new Color(label7); this.label = c.label; this.clr = c.clr; }

    prob(p) { return random(1.0) < p; }
    rand_lo_hi(lo, hi) { return int(floor(random(lo, hi + 1))); }
    rand_hi(hi) { return int(floor(random(0, hi + 1))); }

    darker() {
        let n = new Color(this.label);
        n.clr = color(max(0, red(this.clr) - 10), max(0, green(this.clr) - 10), max(0, blue(this.clr) - 10));
        return n;
    }

    lighter() {
        let n = new Color(this.label);
        n.clr = color(red(this.clr) + 10, green(this.clr) + 10, blue(this.clr) + 10);
        return n;
    }

    complementary() {
        let c = new Color(BLACK);
        switch (this.label) {
            case RED:
                c = new Color(GRIS);
                break;
            case BLUE:
                c = this.prob(0.9) ? new Color(YELLOW) : new Color(RED);
                break;
            case YELLOW:
                c = new Color(BLUE);
                break;
            case BLACK:
                c = new Color(WHITE);
                break;
            case WHITE:
                c = new Color(BLACK);
                break;
            case GRIS:
                c = this.prob(0.5) ? new Color(RED) : new Color(WHITE);
                break;
            case NAVY:
                c = new Color(RED);
                break;
        }
        return c;
    }

    fresh() {
        let f = this.label;
        while (f == this.label)
            f = this.rand_lo_hi(RED, GRIS);
        return new Color(f);
    }

    fresh_exclude(exclude) {
        let f = this.label;
        while (f == this.label || f == exclude)
            f = this.rand_lo_hi(RED, GRIS);
        return new Color(f);
    }

    fresh_exclx1x2(x1, x2) {
        let f = this.label;
        while (f == this.label || f == x1 || f == x2)
            f = this.rand_lo_hi(RED, GRIS);
        return new Color(f);
    }

    fresh_cell(x) {
        return this.fresh_exclude(x.clr.label);
    }

    fresh_cellx1x2(x1, x2) {
        return this.fresh_exclx1x2(x1.clr.label, x2.clr.label);
    }

    isSAMELABEL(c) {
        return this.label == c.label;
    }
}
