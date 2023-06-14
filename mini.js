//class implementation for Mini
/*significant changes: println-> console.log; type-casting dispatched; 
variable declarations with let; var. declaration with let outscide of functions left out
type of return values of methods dispatched; private function -> #function
"final int N" left out, classic variable declaration instead; 
*/
class Mini extends Cell{
    //constructor
    constructor(parent){ //parent is an instance of Cell
        const verbose = false; //including declaration of verbose in the constructor instead of declaring it globally
        type = "Mini";
        this.parent = parent;
        var dx, dy;
        if (PROB(0.25)){
            dx = 5; 
            dy = 3; //lying
        }   else 
        if (PROB(0.50)){
            dx = 3; 
            dy = 5; //standing
        }   else {
            dx = 2; 
            dy = 2; //square
        }
        //leave int() function out, although its use is allowed within the function setup() scope
        let x = dx + random(parent.xMin , parent.xMax - dx);
        let y = dy + random(parent.yMin , parent.yMax - dy); 
        xMin = x;
        xMax = x + dx;
        yMin = y;
        yMax = y + dy;
        clr = new Color(GRIS,RED,BLUE,WHITE,YELLOW);
        hori = true; 
        verti = true;
        stoppi = true;
        if (PROB(0.75)) ratio = dy / dx; else ratio = -1;
        activation = 800 + RAND(200);
        midlifetrigger = activation + 200;
    }
    fast(){
    //no more spreading in activation time,
    //things are smaller, setup gets faster
        activation = 50;
        midlifetrigger = activation + 200;  
    }
    done(){
        //no more triggers
        midlifetrigger = -1; 
    }
    //we move the declaration of the variable INFimum from line 58 to 47
    //since there is no keyword final in JavaScript and const's use outside of a method is no allowed
    //we dispatch final or const 
    INF = 1000000; 

    //implementation of the fuzzy methode is below
    tiny(){   return fuzzy(area(),0,0,1000,2000); }
    small(){  return fuzzy(area(),1000,2000,3000,4000); }
    medium(){ return fuzzy(area(),3000,4000,6000,8000); }
    large(){  return fuzzy(area(),6000,8000,INF,INF); }

    hstretched(){ return fuzzy(dydx()   ,0.00,0.00,0.66,1.50);}
    squarish()  { return fuzzy(dydx()   ,0.66,0.80,1.25,1.50);}
    square()    { return fuzzy(dydx()   ,0.75,0.90,1.10,1.25);}
    vstretched(){ return fuzzy(dydx()   ,0.66,1.50,INF ,INF );}  
    recursible(){ return fuzzy(nesting(),0.00,0.00,0.80,3.20 );}

    truth(){ return 1.0;}
    NOT(p){ return 1 - p; }
    P(p) { return random(1.0) < p;}

    //elaborate explanation of the use of fuuzy logic for minis is explained in the page 277 from teh article
    fuzzy(a,  lo1,  lo2,  hi1,  hi2){
        //generic fuzzy logic predicate, membership test for
        //being between low and high boundary; fuzzy bounds,
        //roughly, lo1 < low < lo2 and also hi1 < high < hi2
        let f1 = (a - lo1)/max(.01,lo2 - lo1);
        let f2 = 1 - (a - hi1)/max(.01,hi2 - hi1);
        if (f1 < 0) f1 = 0;
        if (f1 > 1) f1 = 1;
        if (f2 < 0) f2 = 0;
        if (f2 > 1) f2 = 1;
        return f1 * f2;
    }    
    //p5.js' setup function
    setup(){
        if (verbose) { print("Mini: setup, nesting = "); println(nesting());}
        //the Mini must have reached its final dimensions
        nogrow();
        let retry = 0; // int
        let done = (cells != null || type == "Atom"); //boolean
        while ( !done ){
            if (retry++ > 1000) done = true;
            let num = floor(random(22));
            //switch statement to select from 22 code blocks to be executed
            switch (num){
                case 0:  if (P(recursible()) && P(hstretched()) && P(tiny())    ){ setupH2();       done = true;} break;
                  case 1:  if (P(recursible()) && P(hstretched()) && P(small())   ){ setupG();        done = true;} break;
                  case 2:  if (P(recursible()) && P(hstretched()) && P(medium())  ){ setupHN();       done = true;} break;
                  case 3:  if (P(recursible()) && P(hstretched()) && P(large())   ){ setupHN();       done = true;} break;          
                  case 4:  if (                   P(vstretched()) && P(tiny())    ){ setupA();        done = true;} break;
                  case 5:  if (                   P(vstretched()) && P(small())   ){ setupG();        done = true;} break;
                  case 6:  if (P(recursible()) && P(vstretched()) && P(medium())  ){ setupVNL();      done = true;} break;
                  case 7:  if (                   P(vstretched()) && P(medium())  ){ setupG();        done = true;} break;
                  case 8:  if (P(recursible()) && P(vstretched()) && P(large())   ){ setupVNU();      done = true;} break;
                  case 9:  if (P(recursible()) && P(vstretched()) && P(large())   ){ setupVNL();      done = true;} break;
                  case 10: if (                   P(squarish())   && P(tiny())    ){ setupA();        done = true;} break;
                  case 11: if (P(recursible()) && P(squarish())   && P(small())   ){ setupNxN();      done = true;} break; 
                  case 12: if (P(recursible()) && P(squarish())   && P(small())   ){ setupG();        done = true;} break; 
                  case 13: if (                   P(squarish())   && P(small())   ){ setup2x2();      done = true;} break;  
                  case 14: if (P(recursible()) && P(squarish())   && P(small())   ){ setup2x2();      done = true;} break;      
                  case 15: if (P(recursible()) && P(squarish())   && P(medium())  ){ setupG();        done = true;} break;    
                  case 16: if (P(recursible()) && P(square())     && P(tiny())    ){ setup2x2();      done = true;} break;         
                  case 17: if (P(recursible()) && P(square())     && P(small())   ){ setupG();        done = true;} break;
                  case 18: if (P(recursible()) && P(square())     && P(small())   ){ setup2x2();      done = true;} break;
                  case 19: if (P(recursible()) && P(square())     && P(medium())  ){ setup2x2();      done = true;} break;
                  case 20: if (P(recursible()) && P(square())     && P(medium())  ){ setupG();        done = true;} break;
                  case 21: if (P(0.01)/*no rule applicable*/)                      {setupA();         done = true;} break;
                  default: console.log("MINI SETUP SWITCH FAILURE");
            }        
        }    
    }
    //the atom mini
    setupA(){
        if (verbose) console.log("Mini: setupA");
        done();
   }
   setup2x2(){
    if (verbose) console.log("Mini: setup2x2");
    //Mini divided in 4 squares (4 grid)
    cells = new Cell[4]; //4 cells created
    let dx = xMax - xMin;
    let dy = yMax - yMin;
    cells[0] = new Atom(this);
    cells[1] = new Atom(this);
    cells[2] = new Atom(this);
    cells[3] = new Atom(this);
    
    cells[0].xMin = xMin;        cells[0].xMax = xMin + dx/2; cells[0].yMin = yMin;        cells[0].yMax = yMin + dy/2;
    cells[1].xMin = xMin + dx/2; cells[1].xMax = xMax;        cells[1].yMin = yMin;        cells[1].yMax = yMin + dy/2;  
    cells[2].xMin = xMin;        cells[2].xMax = xMin + dx/2; cells[2].yMin = yMin + dy/2; cells[2].yMax = yMax;   
    cells[3].xMin = xMin + dx/2; cells[3].xMax = xMax;        cells[3].yMin = yMin + dy/2; cells[3].yMax = yMax;

    cells[0].hori = false; cells[0].verti = false;    
    cells[1].hori = false; cells[1].verti = false; 
    cells[2].hori = false; cells[2].verti = false; 
    cells[3].hori = false; cells[3].verti = false;     
    
    cells[1].clr = cells[0].clr.fresh();
    cells[2].clr = cells[1].clr;
    cells[3].clr = cells[0].clr;
    done();
    }
    //private method setupG for the goose-eye mini
    #setupG(){
        if (verbose) console.log("Mini: setupG");
        // G-Mini, or "gooze-eye" Mini, the kind with probably one kernel,
        // It must have grown first,  and then will self-center again now;
        // let x,y be that center, create internal content, just obe cell.
        let x = (xMin + xMax)/2;
        let y = (yMin + yMax)/2;
        if (PROB(0.90)){
            cells = new Cell[1];
            a = new Atom(this);
            //ternary operator
            let variable = (xMax - xMin) > 50 && (yMax - yMin) > 50 
                    ?  RAND(9,13) 
                    :  RAND(5,min(xMax - xMin,yMax - yMin)/4);
            a.xMin = x - variable; 
            a.xMax = x + variable;
            a.yMin = y - variable;
            a.yMax = y + variable;
            a.clr = clr.complementary();
            a.hori = false;
            a.verti = false;
            if (a.boxed()) insert(a);
        } //only 90% of them have a kernel indeed
        done();
   }    //end setupG

   //NxN grid
   setupNxN(){
    if (verbose) console.log("Mini: setupNxN");
    //kind of small checkerboard, 5x5 for example
    let dx = xMax - xMin;
    let dy = yMax - yMin;
    let Nx = max(1,round(dx / 10));
    let Ny = max(1,round(dy / 10));
    let xStep = dx/Nx; 
    let yStep = dy/Ny; 
    cells = new Cell[(Nx+2) * (Ny+2)];
    let prevs = new Color[Nx+1][Ny+1]; //new Color-Matrix
    for (let i=0; i < Nx; i++){
         for (let j=0; j < Ny; j++){
              let a = new Atom(this); //new object of type Atom 
              a.xMin = xMin + i*xStep;
              a.xMax = xMin + i*xStep + xStep;
              a.yMin = yMin + j*yStep;
              a.yMax = yMin + j*yStep + yStep;
              a.clr = new Color(RED,BLUE,YELLOW,BLACK,WHITE,GRIS);
              while (  i > 0 && a.clr.isSAMELABEL(prevs[i-1][j]) 
                    || j > 0 && a.clr.isSAMELABEL(prevs[i][j-1])
                    )  a.clr = new Color(RED,BLUE,YELLOW,BLACK,WHITE,GRIS);
              a.hori = false;
              a.verti = false;
              a.stoppi = true;
              a.activation = 100; //test
              prevs[i][j] = a.clr;
              insert(a);
            }   
        }//end for  
    done();     
    }   //endsetupNxN

    setupVNU(){  
        if (verbose) console.log("Mini: setupVNU");
        //vertically decomposed mini with N sub-minis and a hLine near Upper edge
        let N;
        if (dydx() > 3) N = 5;
            else if (dydx() > 2) N = 4;
                     else N = 3;
        cells = new Cell[N];
        let prevs = new Color[N]; 
        let h = new HLine(this);
              h.setxy((xMin + xMax)/2,yMin + 4 + RAND(4)); 
              h.clr = new Color(WHITE);  
              h.setup(); 
              h.yMin = yMin;
              h.yMax = yMin + 2*(h.yCtr() - yMin);   
        insert(h);
        let yBegin = h.yMax;
        let yStep = (yMax - yBegin)/float(N - 1);
        let a = new Mini(this);
             //the first one
             yBegin += yStep/2;
             a.setxy((xMax + xMin)/2,int(yBegin));
             a.clr = new Color(GRIS,RED,BLUE,YELLOW);
             a.ratio = -1;
             a.fast();
             prevs[1] = a.clr;
             insert(a);
        for (let i = 2; i < N; i++){
             let b = new Mini(this);
             //align them vertically
             yBegin += yStep;
             b.setxy((xMax + xMin)/2,int(yBegin));
             b.clr = new Color(GRIS,RED,BLUE,YELLOW);
             while ( b.clr.isSAMELABEL(prevs[i-1]))
                     b.clr = new Color(GRIS,RED,BLUE,YELLOW);
             b.ratio = -1;
             b.fast();
             prevs[i] = b.clr;
             insert(b);
        }    
        done();
   }    //end setupVNU

    setupVNL(){  
        if (verbose) println("Mini: setupVNL");
        //vertically decomposed mini with N sub-minis and a hLine near Lower edge 
        let N;
        if (dydx() > 3)          N = 5;
            else if (dydx() > 2) N = 4;
                     else        N = 3;
        cells = new Cell[N];
        let prevs = new Color[N]; 
        let h = new HLine(this);
              h.setxy((xMin + xMax)/2,yMax - 4 - RAND(4)); 
              h.clr = new Color(WHITE);  
              h.setup(); 
              h.yMax = yMax;
              h.yMin = yMax - 2*(yMax - h.yCtr());   
        insert(h);
        let yEnd = h.yMin;
        let yStep = (yEnd - yMin)/(N - 1);
        let a = new Mini(this);
             //this is the first one after the HLine
             let yBegin = yMin + yStep/2;
             a.setxy((xMax + xMin)/2,int(yBegin));
             a.clr = new Color(GRIS,RED,BLUE,YELLOW,WHITE);
             a.ratio = -1;
             a.fast();
             prevs[1] = a.clr;
             insert(a);
        for (let i = 2; i < N; i++){
             let b = new Mini(this);
             //align them vertically
             yBegin += yStep;
             b.setxy((xMax + xMin)/2,int(yBegin));
             b.clr = new Color(GRIS,RED,BLUE,YELLOW,WHITE);
             while ( b.clr.isSAMELABEL(prevs[i-1]))
                     b.clr = new Color(GRIS,RED,BLUE,YELLOW,GRIS);
             b.ratio = -1;
             b.fast();
             prevs[i] = b.clr;
             insert(b);
        } 
        done();
    }    //end setupVNL

    //two setup HN functions; one with one without parameter
    setupHN(){ 
        //Horizontally oriented composite mini, N sub-minis
        let N;
        if (dydx() < .33)          N = 5; 
            else if (dydx() < .50) N = 4;
                     else          N = 3;  
        setupHN(N);  
    }

    setupH2(){
        setupHN(2);
    }

    setupHN(N){  
        if (verbose) console.log("Mini: setupHN"); 
        cells = new Cell[N];
        let prevs = new Color[N]; 
        let xBegin = xMin;
        let xStep = (xMax - xBegin)/N;
        let a = new Mini(this);
             //this is really the first one
             xBegin += xStep/2;
             a.setxy(xBegin,(yMax + yMin)/2);
             a.clr = new Color(GRIS,RED,BLUE,YELLOW,WHITE);
             a.ratio = -1;
             a.fast();
             prevs[0] = a.clr;
             insert(a);
        for (let i = 1; i < N; i++){
             let b = new Mini(this);
             //align them horizontally
             xBegin += xStep;
             b.setxy(int(xBegin) + RAND(-int(xStep/2),int(+xStep/2)),(yMax + yMin)/2);
             b.clr = new Color(GRIS,RED,BLUE,YELLOW,WHITE);
             while ( b.clr.isSAMELABEL(prevs[i-1]))
                     b.clr = new Color(GRIS,RED,BLUE,YELLOW);
             b.ratio = -1;
             b.fast();
             prevs[i] = b.clr;
             insert(b);
        }
        done();
    }    //end setupHN

    //trigger 
    trigger(){
        setup();
        done();
    }
}
