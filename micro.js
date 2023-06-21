//Copyright (C) <2013> <Loe Feijs and TU/e
class Micro extends Cell{
  
    //CONCEPTION
    constructor(parent){
          super();
          this.type = "Micro";
          this.parent = parent;
          this.y = parent.yCtr() + this.RAND(-75,75);
          this.x = (this.PROB(0.5)) ? parent.xMin + this.RAND(75) : parent.xMax - this.RAND(75);
          //so micros typically live in the leftmost and in
          //the rightmost left and right corner of a canvas
          this.setxy(this.x,this.y);
          this.hori = true;
          this.verti = true;
          this.stoppi = true;
          this.ratio = 1.0;
          this.clr = parent.clr;
          this.epsilon = 10;
          this.activation = 10;
          this.midlifetrigger = this.activation + 50;
    }
    
    //COMPOSITION
     setup(){
          //micros grow fast in the beginning, then at midlifetrigger they 
          //get the real micro in the middle of a large white enclosement,
          //where the "real" micros is yellow with an internal rectangle,
          //which is either gris or black. The idea of this nesting is to
          //force most of the lines and later mini's to stop and not over-
          //run the micro's (preferably they even keep appropriate distance).
          this.hori = false; 
          this.verti = false;
          //so growth is stopped
          if (largeEnough()){
              this.cells = new Array(1);
              var a = new Micro(this);
                    a.xMin = this.xCtr() - int(random(10,15));
                    a.xMax = this.xCtr() + int(random(10,15));
                    a.yMin = this.yCtr() - int(random(15,20));
                    a.yMax = this.yCtr() + int(random(15,20));
                    a.hori = false; 
                    a.verti = false;
                    a.clr = new Color(YELLOW);
              this.insert(a);
              a.cells = new Array(1);
              var b = new Atom(a);
                   b.xMax = a.xMax;
                   b.yMax = a.yMax;
                   b.xMin = a.xMin + (a.xMax - a.xMin)/3;
                   b.yMin = a.yMin + (a.yMax - a.yMin)/3;
                   b.hori = false; 
                   b.verti = false;
                   b.clr = (this.PROB(0.6)) ? new Color(YELLOW) : new Color(BLACK);
              a.insert(b);
          }   else this.exit();
    }
    
     largeEnough(){
             return this.xMax - this.xMin > 40
                 || this.yMax - this.yMin > 40;
    }
    
    //TRIGGERED ACTION      
    trigger(){
         if (parent.type == "Canvas") 
             this.setup(); 
    }
}//end class Micro