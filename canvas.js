//Copyright (C) <2013> <Loe Feijs and TU/e

//some notes regarding conversion: super was converted to this / casting to instanceof / cells Array had a trickier conversion(might be faulty) 
class Canvas extends Cell {
    //CONCEPTION
    constructor(x,y){
        this.type = "Canvas";
        this.xMin = x - MAXX/2;      
        this.xMax = x + MAXX/2; 
        this.yMin = y - MAXY/2;      
        this.yMax = y + MAXY/2; 
        this.parent = null;
        this.age = 0;   
        this.midlifetrigger = 110;
    }

}//end Canvas

    const verbose = false;
    const MAXX = int(1270.0/Math.sqrt(2)); //one pixel = 2mm real VBW, real VBW is 127 x 127cm, vertical 179cm
    const MAXY = int(1270.0/Math.sqrt(2)); //displayWidth x displayHeight @ TU/e HG3.53 = 1920 x 1080, 1600 x 900 @ TU/e laptop
               
    //special "attribute"" fields for lozenge:
    function xMin(y) { if (y < yCtr()) return int(xMin + (yCtr() - y)); else return int(xMin + (y - yCtr())); }
    function xMax(y) { if (y < yCtr()) return int(xMax - (yCtr() - y)); else return int(xMax - (y - yCtr())); }
    function yMin(x) { if (x < xCtr()) return int(yMin + (xCtr() - x)); else return int(yMin + (x - xCtr())); }
    function yMax(x) { if (x < xCtr()) return int(yMax - (xCtr() - x)); else return int(xMax - (x - xCtr())); }

  

//COMPOSITION  
function setup(){
     //make a Victory Boogie Woogie tribute composition
     clr = new Color(WHITE);

     const NRQUADS  =   2;//do not change this
     const NRHLINES =  15;//many get purge'd anyhow
     const NRVLINES =  30;//idem
     const NRMINIS =   75;//idem
     const NRMICROS =  20;//idem

     let cells = [];
     let totalCells = 4 * NRQUADS + NRHLINES + 2 * NRVLINES + NRMINIS + NRMICROS;
     for (let i = 0; i < totalCells; i++) {
        cells.push(new Cell());
     }   
     midlifetrigger = 500;
    
     //add an upmost quadruple configuration 
     var qy = int(random(yMin + 50,yMin + 125));
     var qx = int(random(xMin(qy) + 10,xMax(qy) - 10));
     var q = new Quad(this);
     q.setxy(qx,qy);
     q.setup(false);
     insert(q);
     
     //and a downmost yellow/gris configuration
     q = new Quad(this);
     q.setxy(xCtr(),yMax - RAND(50,100));
     q.setup(true);
     insert(q);

     //now compose a grid, a bit Broadway
     for (let i=0;  i < NRHLINES; i++) {
          //first create the empty HLines, which is important: 
          //these HLines help some (most) of the VLines to stop,
          //for example the twins (otherwise they re-unite again).
          var h = new HLine(this); 
          insert(h);
     }
     for (let i=0;  i < NRVLINES; i++) {
          //then the VLines and their twins,
          //the Hlines must be there already
          var v = new VLine(this);
          insert(v);
          v.prep();
          if (v.stoppi) {
              var twin = new VLine(this); 
              v.copy(twin); 
              var y = (v.yCtr() < yMax/2) ? int(6*yMax/7) : int(yMax/3);//near opposite side
              twin.yMin = y;
              twin.yMax = y;
              twin.prep();
              insert(twin);
          }
     }//end for      
      purge1(); 
     //then fill in the remaining details of the HLines
     //which will include varersection atoms
     for (let i=0;  i < cells.length; i++) { 
          if (cells[i] != null && cells[i].type == "HLine"){
            if (cells[i] instanceof HLine) {    //converted from ((HLine)cells[i]).setup();
                cells[i].setup();
              }
         }
     }//end for
     //then fill in the remaining details of the VLines

     for (let i=0;  i < cells.length; i++) { 
          if (cells[i] != null && cells[i].type == "VLine"){
            if (cells[i] instanceof VLine) {    //converted from ((HLine)cells[i]).setup();
                cells[i].setup();
              }
         }
     }//end for
     for (let i=0; i < NRMINIS; i++){
          var m = new Mini(this);
          insert(m);
          //setup postponed
     }//end for       
     for (let i=0; i < NRMICROS; i++){
          var m = new Micro(this);
          insert(m);
          //setup postponed
     }//end for
     
     //and some more cleanup
     purge2();
     purge3();
}
       
 //APOPTOSIS
function purge1(){
     //meant for the collection of Hlines and VLines typically:
     //eliminate some of the cells being either too close anyhow,
     //or HLines vertizontally too close, or VLines horizontally too close,
     //(being too close depends on the width for a VLine and height for an HLine)
     //but avoid removing twins. PS RUN THIS ONLY BEFORE GROWTH, NOT AT MIDLIFETRIGGERS
     for (let i=0; i < cells.length; i++){
         for (let j=0; j < cells.length; j++){
             var ci = cells[i];
             var cj = cells[j];
             if (i != j && ci != null && cj != null && !ci.twin(cj)){
                 if (  (  ci.type == "Micro" && cj.type == "Micro"
                       && abs(ci.xCtr() - cj.xCtr()) < 30 && abs(ci.yCtr() - cj.yCtr()) < 30
                       )
                    || (  ci.type == "Mini" && cj.type == "Mini" &&
                          (  abs(ci.xCtr() - cj.xCtr()) < 30 && abs(ci.yCtr() - cj.yCtr()) < 30
                          || ci.bumped(cj,0)
                          )
                       )
                    || (  ci.type == "HLine" && cj.type == "HLine"
                       && abs(ci.yCtr() - cj.yCtr()) <= 3 + (ci.yMax - ci.yMin)/2 + (cj.yMax - cj.yMin)/2 
                       )
                    || (  ci.type == "VLine" && cj.type == "VLine"
                       && abs(ci.xCtr() - cj.xCtr()) <= 3 + (ci.xMax - ci.xMin)/2 + (cj.xMax - cj.xMin)/2   
                       )    
                    )  cells[i] = null;
             }
         }
     }  
     if (verbose) { print("Canvas purge1 @");print(age); }   
}    //end purge1

function purge2(){
     //remove cells with x,y outside lozenge
     if (cells != null)
         for (let i=0; i < cells.length; i++)
              if (cells[i] != null){
                  cells[i].exitIfOutLier(this);
     }
     if (verbose) { print("Canvas purge2 @");print(age); }
}    //end purge2

function purge3(){
     //also get rid of HLines with unfortunate positions 
     for (let i = 0; i < cells.length; i++)                
          if (cells[i] != null)
              if (cells[i].type == "HLine")
                  if (  cells[i].yCtr() < yMin + 50 
                     || cells[i].yCtr() > yMax - 50 
                     )   cells[i] = null;
     //also get rid of VLines with unfortunate positions 
     for (let i = 0; i < cells.length; i++)                
          if (cells[i] != null)
              if (cells[i].type == "VLine")
                  if (  cells[i].xCtr() < xMin + 75 
                     || cells[i].xCtr() > xMax - 75
                     )  cells[i] = null;
     //also get rid of Minis with unfortunate positions 
     for (let i = 0; i < cells.length; i++)                
          if (cells[i] != null)
              if (cells[i].type == "Mini")
                  if (  cells[i].xCtr() < xMin + 100
                     || cells[i].xCtr() > xMin + 800
                     || cells[i].yCtr() < yMin + 100 
                     )  cells[i] = null;              
     if (verbose) { print("Canvas purge3 @");print(age);}
}    //end purge3


//TRIGGERED ACTION
function trigger(){
     compress();
}

//PRESENTATION
function grid(){
     stroke(0,180,0);
     for (let x = 0; x < xMax; x += 10){
          if (x%100 == 0) strokeWeight(1); else strokeWeight(0);
          line(x,0,x,yMax);
     }    strokeWeight(0);
     for (let y = 0; y < yMax; y += 10){
          if (y%100 == 0) strokeWeight(1); else strokeWeight(0);
          line(0,y,yMax,y);
     }    strokeWeight(1);//default
}
function rontgen(){
     grid();
     super.rontgen(4);
}
function count(){
     var n = this.count();
     print("cell count = "); 
     print(n);
     return n; 
}
function lozenge(printing){
     noStroke();
     if (rontgen) 
         fill(145,165,145,200);  //transparent
         else if (printing)      //no ink waste
                  fill(255,255,255,255);//white
                  else fill(0,0,0,255); //black

     var xMin = (width - MAXX)/2;
     var xMax = (width + MAXX)/2 + 1;
     var xCtr = (width)/2;
     var yMin = (height - MAXY)/2;
     var yMax = (height + MAXY)/2 + 1;
     var yCtr = (height)/2;
     triangle(xMin,yMin,xCtr,yMin,xMin,yCtr);
     triangle(xCtr,yMin,xMax,yMin,xMax,yCtr);
     triangle(xMax,yCtr,xMax,yMax,xCtr,yMax);
     triangle(xCtr,yMax,xMin,yMax,xMin,yCtr);
     stroke(180,180,180);
     line(xCtr,yMin,xMin,yCtr);
     line(xCtr,yMin,xMax,yCtr);
     line(xMax,yCtr,xCtr,yMax);
     line(xCtr,yMax,xMin,yCtr);    
}    //end lozenge

function draw(printing){
     //White background is better for printing
     //other wise, black is better for screen.
     this.draw();
     this.lozenge(printing);
     if (verbose) if (age % 500 == 0){ print("Canvas @"); print(age);}
} 
