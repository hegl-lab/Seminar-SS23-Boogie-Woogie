//we implement thhe class Atom that inherits from the Cell class

class Atom extends Cell{ 
    //constructors
    constructor(parent,coparent){
    super(); 
    this.#iniAtom();
    var colors6 = [RED,YELLOW,BLUE,WHITE,GRIS,BLACK];
    var colors3= [RED,NAVY,WHITE];
    this.parent = parent;
    if (coparent != null) {
        this.coparent = coparent;
        this.midlifetrigger = 500;  
       
       // var rnd = random(colors);
        this.clr = new Color(random(colors6)); //new Color3(RED,NAVY,WHITE);
    }
    else {
        print("Atom constructor: coparent is null");
        
        this.clr = new Color(random(colors3) ); //new Color6(RED,YELLOW,BLUE,WHITE,GRIS,BLACK); we create a new instance of class color
    }

    } 
    //private methods in JavaScrpit are set with a hash # before its name
    #iniAtom(){ //private Atom initializer function 
       this.type = "Atom";
       this.hori = true;
       this.verti = true;
       this.stoppi = true;
       this.ratio = 1.0;
    }

    //TRIGGERED ACTION      
    trigger(){     //change void trigger() to function trigger()
        if (this.parent != null && this.coparent != null)
            if (this.PROB(0.3))
                this.split();
   }
   split(){
        //atoms are splittable
        //for a dual parent atom, typically at H-VLine intersection.
        var cells = new Array(2); //cells is an array of 'Cell's
        for (var i = 0; i < cells.length; i++){ //length function of arrays same as in Java
             cells[i] = new Atom(this);
             cells[i].ratio = -1;
             cells[i].clr = (i == 0) ? this.clr : this.clr.complementary();
             cells[i].setxy(this.xCtr() + ((i == 0) ? 4 : -4),this.yCtr()); //xCtr() return the center of xMin and xMax
        }
   }
}//end class Atom