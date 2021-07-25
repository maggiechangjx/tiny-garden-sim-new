# Tiny Garden Simulation 
This simulation is still under construction! 

... This README has yet to be updated ... . . . 



## Current progress and simulation descriptions
There are two seeds available, one of which produces roots that grow vertically while the other produces roots that grow horizontally. All roots will choose the most nutrient-rich soil cell to grow into, and reduce the nutrient level of that soil cell. If multiple cells have the same high nutrient value, the roots will become greedy and occupy all the cells, as long as they are not next to each other. When the roots reach the surface of the soil, they will grow into flowers with heights between 4 cells and 8 cells. Currently, if a vertical root collides with a horizontal root, the growth on that location will stop, the cell will turn green, and the nutrient level will be further reduced. There's also a small collision related bug in the implementation, where the two different plants will attempt to grow into one another when they try to occupy the same grid. 

### Thoughts on the garden's future
In addition to fixing the bug, I hope to implement an alternative collision event -- perhaps the collision will lead to the growth of a parasitic plant that takes over other plants. I also want to implement more interactions for maintaining the garden (ie. water the plants, dig into the soil to cut certain roots), environmental variables that affects the conditions of the plants and roots, and a more informative interactive 'toolkit' that informs the gardener of the types of plants, gardening capabilities, and envrionmental changes.

On a broader scale, building the garden made me wonder how time can be altered or delayed in these grid-based simulations, where one iteration can be considered as the smallest unit of time. Since a set of rules are implemented to be executed once every iteration, I wonder how the rules can be set up so that the execution of certain events would be delayed, or whether one set of rules can take more iterations to fully execute while the rest of the rules take fewer iterations. 

---

## Some implementation details
All interactions are implemented in main.js, which consists of 3 general parts: 
1. Initiate grid and load information to each cell
2. Implement rules to be executed through iteration 
3. Iterate, add interactive elements

### Data organization
Effective organization of different data became a much more dominant concern in this simulation as opposed to Game of Life. Some organizational decisions that made the rest of the implementation easier for me are: 
1. Separating the sky and soil into two separate arrays 
   - Since different rules are being applied to the sky and soil, I can iterate through each list without worrying about the 'scope' of the iteration.
2. Using arrays of `soilCell` objects and `plant` objects to store multiple kinds of data
   - Since some functions needed different types of data pertaining to the same cell and simultaneously removed different data of the same cell index (ex. `hNeighbours`), it was easier to refer to all the data if they are stored in the same object.
   - It was easier to check for the length of a plant stem when the plant data are grouped as they are displayed vertically on the grid (the `state` and `id` constructors in the `plant` class) as opposed to in an one-dimensional array.
3. Building helper functions `coordX()`, `coordY()`, `coordToIndex()` to translate any array index value to x, y coordinates, and any x, y coordinates to index values
   - Since I decided to mostly stick to one-dimensional arrays to display the grid and store data, these helper functions made it easier to write convolutions for returning a cell's neighbours, and accessing different data in `plantInfo`

### Root growth 
`growVRoot()` controls the growth of vertical roots and `growHRoots()` controls the growth of horizontal roots. All roots follow a similar growing pattern:

The `grow-` functions determine a cell's three most immediate neighbours to the direction of growth through `hNeighbours()` and `vNeighbours()`, and picks the neighbour with the highest nutrient level (`mostNutri()`) to occupy. If multiple neighbours have the same nutrient value, `mostNutri()` will pick the neighbour(s) that are not next to each other, for aesthetic reasons. 

### Plant growth 
`growBud()` connects the soil array to the sky array: if there is a root at the top layer of the soil, a bud will grow at the bottom layer of the sky, on the same column as the root. 

`growPlants()` builds upon `growBud()`. If a plant cell exists under each cell it iterates through, and turns the current cell into a plant cell. A flower will grow when the length of the plant stem (recorded in `plantInfo[i].state`) equals the ideal total length of the plant set by `plantInfo[i].len`. The plant should stop growing once its flower forms.

### Step()
`step()` creates a single iteration of all the interactions. Since the sky and soil are separated into arrays of different lengths, multiple for-loops need to be implemented in step().

---

## Additional dispersed thoughts
- As more implementations are added, I'd probably need to separate the code into multiple js files 
- I did a bit of wikipedia reading on L-systems and watched these two videos by The Coding Train on its implementation (https://www.youtube.com/watch?v=f6ra024-ASY&ab_channel=TheCodingTrain, https://www.youtube.com/watch?v=E1B4UoSQMFw&ab_channel=TheCodingTrain), but ultimately decided that it might be a bit overly complicated for a grid-based simualtion
- How complex can I make this simulation before it starts crashing / running extremely slow? 
- Does splitting the grid into multiple parts affect processing speed? 
- What kind of narrative do I want to tell through the garden? 
- How to make sense of labour as an e-gardener in a garden sim? 
- Flowers growing on four different sides 
- Saving states, having the garden continue growing for a LONG time 


- where's the human's position in a sustainable eco cycle? 
= seeing simulation not from the position of a human? eg. playing as the worm ?? playing as the fungi??????!! 
- humans as pests   can come in and cut plants down 
- 'player' is another plant connectd to the mother tree
