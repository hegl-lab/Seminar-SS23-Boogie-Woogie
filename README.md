# HEGL Illustrating Mathematics
## Generating Victory Boogie Woogie by Piet Mondrian

<img src="https://github.com/arjansiddhpura/Boogie-Woogie/assets/75858676/6d5cd54b-ee70-432d-94e1-9feee913f510" alt="Piet_Mondriaan_Victory_Boogie_Woogie" width="400" height="400">   




In the past semester we developed a website that generates randomized compositions in the style of the painting Victory Boogie Woogie which is Piet Mondrian’s last and one of his most famous unfinished works.

To replicate the painting, one must first understand what it entails. A lot of the details in this painting contain fundamental elements developed by Mondrian from his previous works. Some of these elements include 
* Bright primary colours that first appear in his impressionist paintings
* His cubism paintings progressively show his affinity for creating order in chaos
* His establishment of the De Stijl movement starting with his simple compositions, which progressively combined resulted in Victory Boogie Woogie

Each of these elements give rhythm and harmony to the chaos that we perceive at a first glance. In its essence, the painting is meant to represent the vibrant lifestyle of New York, but is open to multiple interpretations at the same time. 

Our program is based on Prof. Loe M.G. Feijs’ article “A program for Victory Boogie Woogie” which showcases a successful attempt of imitating it algorithmically. Prof Feijs tried multiple approaches to build these compositions (using regular grids and perturbing them, recursively splitting the plane and its subplanes, drawing random triangles) but none of these approaches came close to replicating the essence of the painting. The final implementation consists of letting lines and planes compete for space on the canvas.

For a general idea of the project, the building block of our whole project is a single class called the Cell. All other objects are mutations of this cell object. The cell regulates its own growth and also takes care of how to interact with its neighbours, its children and its own parents, rendering itself finally on the screen. The root of this recursive tree is called the Canvas, where it all begins by setting up various types of cells. These include the horizontal and vertical lines that begin drawing first, Quad objects having four cells within themselves to create the borders of the Canvas, a Micro object that has a recursive nesting of one level, ie it has a cell within itself and lastly, Mini which makes use of fuzzy logic to determine the type and number of cells that are created within itself recursively. The simplest manifestation of the cell is called the Atom, which forms the leaf of our recursive tree by being a simple square. All of these cells are also simultaneously coloured in the palette of the Victory Boogie Woogie Painting by Piet Mondrian.

We make use of various technologies like HTML, CSS, JavaScript and combine it with P5js to render this website.

<img width="400" alt="Screenshot" src="https://github.com/arjansiddhpura/Boogie-Woogie/assets/75858676/e43fec72-15a0-4fc5-b90d-d59d1bff471c">




The style of implementing the painting with the composite pattern leads not to just a single copy of the Victory Boogie Woogie, but to a wide range of similar canvases. Some of them are much better than others, but all of them include the characteristic “Mondrian Style”. As Victory Boogie Woogie was unfinished when Mondrian died, there is much space for interpretation and similarly, an openness for the further improvement of this project itself.
