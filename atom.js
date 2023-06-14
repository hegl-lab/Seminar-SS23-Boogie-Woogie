//we implement thhe class Atom that inherits from the Cell class

class Atom extends Cell{ 
    //constructors
    constructor(parent,coparent){
    super(); 
    this.#iniAtom();
    this.parent = parent;
    if (coparent != null) {
        this.coparent = coparent;
        this.midlifetrigger = 500;  
        this.clr = new Color3(RED,NAVY,WHITE);
    }
    else {
        this.clr = new Color6(RED,YELLOW,BLUE,WHITE,GRIS,BLACK); //we create a new instance of class color
    }

    } 
    //private methods in JavaScrpit are set with a hash # before its name
    #iniAtom(){ //private Atom initializer function 
       type = "Atom";
       hori = true;
       verti = true;
       stoppi = true;
       ratio = 1.0;
    }

    //TRIGGERED ACTION      
    trigger(){     //change void trigger() to function trigger()
        if (parent != null && coparent != null)
            if (PROB(0.3))
                split();
   }
   split(){
        //atoms are splittable
        //for a dual parent atom, typically at H-VLine intersection.
        cells = new Cell[2]; //cells is an array of 'Cell's
        for (i = 0; i < cells.length; i++){ //length function of arrays same as in Java
             cells[i] = new Atom(this);
             cells[i].ratio = -1;
             cells[i].clr = (i == 0) ? clr : clr.complementary();
             cells[i].setxy(xCtr() + ((i == 0) ? 4 : -4),yCtr()); //xCtr() return the center of xMin and xMax
        }
   }
}//end class Atom