var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/style/main.css
var init_ = __esm({
  "src/style/main.css"() {
  }
});

// src/world-params.js
var require_world_params = __commonJS({
  "src/world-params.js"(exports2, module2) {
    init_();
    module2.exports = {
      WIDTH: 95,
      SKY_HEIGHT: 15,
      SOIL_HEIGHT: 50,
      HEIGHT: 65,
      MYCOR_NUM: 2,
      MYCOR_RADIUS: 5,
      MYCOR_MIN_RADIUS: 1,
      LOWEST_STARTING_NUTRI: 25,
      LOW_NUTRI: 6,
      MAX_NUTRI: 32,
      FLOOD_THRESHOLD: 60,
      WATER_NUTRI_VAL: 20,
      ROOT_LEN_FOR_PLANT: 10,
      MAX_ROOT_LEN: 200,
      ROOT_MULTIPLIER: 8,
      ROOT_GROWTH_RATE: 30,
      frame: document.querySelector(".frame")
    };
  }
});

// src/index-coord-helper.js
function coordY(cell) {
  let y;
  let id = Number(cell.id);
  for (i = 0; i < HEIGHT + 1; i++) {
    if (id < i * WIDTH && id >= (i - 1) * WIDTH) {
      y = i - 1;
    }
  }
  if (y === void 0) {
    y = 0;
  }
  return y;
}
function coordX(cell) {
  let x;
  let id = Number(cell.id);
  if (coordY(cell) == 0) {
    x = id;
  } else if (coordY(cell) > 0) {
    x = id - WIDTH * coordY(cell);
  }
  if (x == void 0) {
    return 0;
  } else {
    return x;
  }
}
function coordToIndex(lst) {
  return lst[1] * WIDTH + lst[0];
}
var world, WIDTH, SOIL_HEIGHT, HEIGHT, frame;
var init_index_coord_helper = __esm({
  "src/index-coord-helper.js"() {
    world = require_world_params();
    ({ WIDTH, SOIL_HEIGHT, HEIGHT, frame } = world);
  }
});

// src/mycor-params.js
var require_mycor_params = __commonJS({
  "src/mycor-params.js"(exports2, module2) {
    module2.exports = {
      O_COEFF: 0,
      A_COEFF: 1,
      C_COEFF: 1,
      S_COEFF: 2,
      R_COEFF: 0.5
    };
  }
});

// src/soil-activities.js
var require_soil_activities = __commonJS({
  "src/soil-activities.js"(exports2, module2) {
    init_();
    init_index_coord_helper();
    var worldParams2 = require_world_params();
    var {
      WIDTH: WIDTH3,
      SOIL_HEIGHT: SOIL_HEIGHT3,
      HEIGHT: HEIGHT3,
      MYCOR_NUM,
      MYCOR_RADIUS,
      MYCOR_MIN_RADIUS,
      LOWEST_STARTING_NUTRI: LOWEST_STARTING_NUTRI2,
      MAX_NUTRI: MAX_NUTRI2,
      frame: frame2
    } = worldParams2;
    var soil2 = [];
    var soilInfo2 = [];
    var mycorInfo2 = [];
    var soilCell = class {
      constructor(state, nutri, id, organism) {
        this.state = state;
        this.nutri = nutri;
        this.id = id;
        this.organism = organism;
      }
    };
    var mycor = class {
      constructor(vel, separation, radius, id) {
        this.vel = vel;
        this.separation = separation;
        this.radius = radius;
        this.id = id;
      }
    };
    function createSoil2() {
      let stotal = WIDTH3 * SOIL_HEIGHT3;
      for (let i2 = 0; i2 < stotal; i2++) {
        const cell = document.createElement("div");
        cell.classList.add("soil");
        cell.setAttribute("id", i2);
        frame2.appendChild(cell);
        soil2.push(cell);
      }
      for (let i2 = 0; i2 < WIDTH3; i2++) {
        soil2[i2].classList.add("organic");
      }
      for (let i2 = WIDTH3; i2 < stotal / 2 - WIDTH3; i2++) {
        soil2[i2].classList.add("topsoil");
      }
      for (let i2 = stotal / 2 - WIDTH3; i2 < stotal; i2++) {
        soil2[i2].classList.add("subsoil");
      }
    }
    function loadSoilInfo2() {
      for (let i2 = 0; i2 < WIDTH3; i2++) {
        soilInfo2.push(new soilCell(soil2[i2].className, Math.floor(Math.random() * (MAX_NUTRI2 - LOWEST_STARTING_NUTRI2) + LOWEST_STARTING_NUTRI2), i2));
      }
      for (let i2 = WIDTH3; i2 < soil2.length / 2 - WIDTH3; i2++) {
        soilInfo2.push(new soilCell(soil2[i2].className, Math.floor(Math.random() * (MAX_NUTRI2 - LOWEST_STARTING_NUTRI2) + LOWEST_STARTING_NUTRI2), i2));
      }
      for (let i2 = soil2.length / 2 - WIDTH3; i2 < soil2.length; i2++) {
        soilInfo2.push(new soilCell(soil2[i2].className, Math.floor(Math.random() * (MAX_NUTRI2 - LOWEST_STARTING_NUTRI2) + LOWEST_STARTING_NUTRI2), i2));
      }
    }
    function createMycor2() {
      for (let num = 0; num < MYCOR_NUM; num++) {
        let velX = Math.round(Math.random() * 2 - 1);
        let velY = Math.round(Math.random() * 2 - 1);
        let vel = [velX, velY];
        let randIndex = Math.floor(Math.random() * (soil2.length - WIDTH3) + WIDTH3);
        if (velX == 0 && velY == 0) {
          vel[Math.floor(Math.random() * 2)] = 1;
        }
        mycorInfo2.push(new mycor(vel, 1, 5, randIndex));
        soil2[randIndex].className = soil2[randIndex].className.concat(" mycor");
        soilInfo2[randIndex].organism = mycorInfo2[mycorInfo2.length - 1];
      }
    }
    function toggleHRoot2(cell) {
      cell.addEventListener("click", () => {
        cell.classList.toggle("h_root");
        soilInfo2[cell.id].state = cell.className;
        soilInfo2[cell.id].nutri -= 1;
        console.log(cell);
      });
    }
    function toggleVRoot2(cell) {
      cell.addEventListener("click", () => {
        cell.classList.toggle("v_root");
        soilInfo2[cell.id].state = cell.className;
        soilInfo2[cell.id].nutri -= 0.5;
        console.log(cell);
      });
    }
    function hypotenuse(x, y) {
      return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }
    function mostNutri2(lst) {
      let l2 = lst;
      if (l2.length === 1)
        return l2;
      if (l2[0].nutri < l2[1].nutri) {
        l2.splice(0, 1);
      } else {
        l2.splice(1, 1);
      }
      if (l2.length === 2 && l2[0].nutri == l2[1].nutri) {
        if (l2[0].id == l2[1].id - 45 || l2[0].id == l2[1].id - 1) {
          l2.splice(1, 1);
        } else {
          return l2;
        }
      }
      return mostNutri2(l2);
    }
    function arrIncludes(arr, str) {
      let a = arr;
      if (a.length > 1 && !a[0].includes(str)) {
        a.splice(0, 1);
      } else {
        return a[0].includes(str);
      }
      return arrIncludes(a, str);
    }
    function rootVel(ogCell, relCell) {
      let ogX = coordX(ogCell);
      let ogY = coordY(ogCell);
      let relX = coordX(relCell);
      let relY = coordY(relCell);
      let vel = [0, 0];
      if (ogX > relX) {
        vel[0] = -1;
      } else if (ogX < relX) {
        vel[0] = 1;
      }
      if (ogY > relY) {
        vel[1] = -1;
      } else if (ogY < relY) {
        vel[1] = 1;
      }
      return vel;
    }
    function mycorNeighbours(cell) {
      let nCount = 0;
      let x = coordX(cell);
      let y = coordY(cell);
      let avgPos = [0, 0];
      let avgVel = [0, 0];
      let radius = soilInfo2[cell.id].organism.radius;
      for (dx = -radius; dx <= radius; dx++) {
        for (dy = -radius; dy <= radius; dy++) {
          let nx = (x + dx + WIDTH3) % WIDTH3;
          let ny = (y + dy + SOIL_HEIGHT3) % SOIL_HEIGHT3;
          let nID = coordToIndex([nx, ny]);
          if (soil2[nID].className.includes("mycor") && soilInfo2[nID].nutri > 0) {
            let nVel = soilInfo2[nID].organism.vel;
            avgPos[0] += nx;
            avgPos[1] += ny;
            avgVel[0] += nVel[0];
            avgVel[1] += nVel[1];
            nCount += 1;
          } else if (soil2[nID].className.includes("h_root") || soil2[nID].className.includes("v_root")) {
            let posMultiplier = 2;
            let velMultiplier = 2;
            avgPos[0] += nx * posMultiplier;
            avgPos[1] += ny * posMultiplier;
            let rVel = rootVel(cell, soil2[nID]);
            avgVel[0] += rVel[0] * velMultiplier;
            avgVel[1] += rVel[1] * velMultiplier;
            nCount += 1;
          }
        }
      }
      avgPos[0] = nCount > 0 ? Math.round(avgPos[0] / nCount) : 0;
      avgPos[1] = nCount > 0 ? Math.round(avgPos[1] / nCount) : 0;
      let avgPosLen = hypotenuse(avgPos[0], avgPos[1]);
      if (avgPosLen > 0) {
        avgPos[0] = Math.round(avgPos[0] / avgPosLen);
        avgPos[1] = Math.round(avgPos[1] / avgPosLen);
      }
      avgVel[0] = nCount > 0 ? Math.round(avgVel[0] / nCount) : 0;
      avgVel[1] = nCount > 0 ? Math.round(avgVel[1] / nCount) : 0;
      return {
        pos: avgPos,
        vel: avgVel
      };
    }
    function growMycor2(i2) {
      let data = require_mycor_params();
      let { O_COEFF, A_COEFF, C_COEFF, S_COEFF, R_COEFF } = data;
      let n = mycorNeighbours(soil2[i2]);
      let x = coordX(soil2[i2]);
      let y = coordY(soil2[i2]);
      let newVel = soilInfo2[i2].organism.vel;
      let randAdjustment = [
        Math.round(Math.random() * 2 - 1),
        Math.round(Math.random() * 2 - 1)
      ];
      newVel[0] = n.vel[0];
      +n.pos[0] * 0.1;
      newVel[1] = n.vel[1];
      +n.pos[1] * 0.1;
      let newVelLen = hypotenuse(newVel[0], newVel[1]);
      if (newVelLen > 0) {
        newVel[0] = Math.round(newVel[0] / newVelLen);
        newVel[1] = Math.round(newVel[1] / newVelLen);
      }
      let nx = (x + newVel[0] + WIDTH3) % WIDTH3;
      let ny = (y + newVel[1] + SOIL_HEIGHT3) % SOIL_HEIGHT3;
      let newMycorID = coordToIndex([nx, ny]);
      if (!soil2[newMycorID].className.includes("mycor") && !soil2[newMycorID].className.includes("h_root") && !soil2[newMycorID].className.includes("v_root")) {
        let newMycor = new mycor(newVel, 1, MYCOR_RADIUS, newMycorID);
        soilInfo2[newMycorID].organism = newMycor;
        mycorInfo2.push(newMycor);
      }
    }
    function vNeighbours(cell) {
      let n = [];
      let x = coordX(cell);
      let y = coordY(cell);
      let ny = (y + 1 + SOIL_HEIGHT3) % SOIL_HEIGHT3;
      for (let dx2 = -1; dx2 < 2; dx2++) {
        let nx = (x + dx2 + WIDTH3) % WIDTH3;
        n.push(soilInfo2[coordToIndex([nx, ny])]);
      }
      return n;
    }
    function growVRoot2(i2) {
      let nb = vNeighbours(soil2[i2]);
      let nbState = [];
      for (let j2 = 0; j2 < nb.length; j2++) {
        nbState.push(nb[j2].state);
      }
      if (!arrIncludes(nbState, "v_root") && !arrIncludes(nbState, "mycor")) {
        let grow = mostNutri2(nb);
        for (let k2 = 0; k2 < grow.length; k2++) {
          if (soilInfo2[grow[k2].id].state.includes("h_root") && soilInfo2[grow[k2].nutri > 0]) {
            growHVRoot2(grow[k2].id);
          } else if (soilInfo2[grow[k2].id].nutri > 0) {
            soilInfo2[grow[k2].id].state = soilInfo2[grow[k2].id].state.concat(" v_root");
            soilInfo2[grow[k2].id].nutri -= 1;
          }
        }
      }
    }
    function hNeighbours(cell, dir) {
      let x = coordX(cell);
      let y = coordY(cell);
      let n = [];
      for (let dx2 = -1; dx2 < 2; dx2 += 2) {
        for (let dy2 = -1; dy2 < 2; dy2++) {
          let nx = (x + dx2 + WIDTH3) % WIDTH3;
          let ny = (y + dy2 + SOIL_HEIGHT3) % SOIL_HEIGHT3;
          n.push(soilInfo2[coordToIndex([nx, ny])]);
        }
      }
      if (dir == "both") {
        return n;
      } else if (dir == "l") {
        return n.splice(0, 3);
      } else if (dir == "r") {
        return n.splice(3);
      } else {
        return "hNeighbours invalid cell direction";
      }
    }
    function growHRoot2(i2) {
      let nb = hNeighbours(soil2[i2], "both");
      let lnb = nb.slice(0, 3);
      let rnb = nb.slice(3);
      let nbState = [];
      for (let j2 = 0; j2 < nb.length; j2++) {
        nbState.push(nb[j2].state);
      }
      let lnbState = nbState.slice(0, 3);
      let rnbState = nbState.slice(3);
      if (!arrIncludes(nbState, "h_root") && !arrIncludes(nbState, "mycor")) {
        let growL = mostNutri2(lnb);
        let growR = mostNutri2(rnb);
        for (let k2 = 0; k2 < growL.length; k2++) {
          if (soilInfo2[growL[k2].id].state.includes("h_root")) {
            growHVRoot2(growL[k2].id);
          } else if (soilInfo2[growL[k2].id].nutri > 0) {
            soilInfo2[growL[k2].id].state = soilInfo2[growL[k2].id].state.concat(" h_root");
            soilInfo2[growL[k2].id].nutri -= 1;
          }
        }
        for (let k2 = 0; k2 < growR.length; k2++) {
          if (soilInfo2[growR[k2].id].state.includes("h_root")) {
            growHVRoot2(growR[k2].id);
          } else if (soilInfo2[growR[k2].id].nutri > 0) {
            soilInfo2[growR[k2].id].state = soilInfo2[growR[k2].id].state.concat(" h_root");
            soilInfo2[growR[k2].id].nutri -= 1;
          }
        }
      } else if (!arrIncludes(lnbState, "h_root") && !arrIncludes(lnbState, "mycor")) {
        let grow = mostNutri2(lnb);
        for (let k2 = 0; k2 < grow.length; k2++) {
          if (soilInfo2[grow[k2].id].state.includes("h_root")) {
            growHVRoot2(grow[k2].id);
          } else if (soilInfo2[grow[k2].id].nutri > 0) {
            soilInfo2[grow[k2].id].state = soilInfo2[grow[k2].id].state.concat(" h_root");
            soilInfo2[grow[k2].id].nutri -= 1;
          }
        }
      } else if (!arrIncludes(rnbState, "h_root") && !arrIncludes(rnbState, "mycor")) {
        let grow = mostNutri2(rnb);
        for (let k2 = 0; k2 < grow.length; k2++) {
          if (soilInfo2[grow[k2].id].state.includes("h_root")) {
            growHVRoot2(grow[k2].id);
          } else if (soilInfo2[grow[k2].id].nutri > 0) {
            soilInfo2[grow[k2].id].state = soilInfo2[grow[k2].id].state.concat(" h_root");
            soilInfo2[grow[k2].id].nutri -= 1;
          }
        }
      }
    }
    function growHVRoot2(i2) {
      soilInfo2[i2].state = "soil hv_root";
      soilInfo2[i2].nutri -= 3;
    }
    function reduceNutrient2(i2) {
      if (soil2[i2].className.includes("h_root") || soil2[i2].className.includes("v_root") || soil2[i2].className.includes("mycor")) {
        if (soilInfo2[i2].nutri > 0)
          soilInfo2[i2].nutri -= 0.5;
        if (soilInfo2[i2].nutri <= 0) {
          let stotal = WIDTH3 * SOIL_HEIGHT3;
          if (i2 < WIDTH3)
            soilInfo2[i2].state = "soil organic";
          else if (i2 >= WIDTH3 && i2 < stotal / 2 - WIDTH3)
            soilInfo2[i2].state = "soil topsoil";
          else if (i2 < stotal)
            soilInfo2[i2].state = "soil subsoil";
          for (let i3 = 0; i3 < mycorInfo2.length; i3++) {
            if (mycorInfo2[i3].id = i3)
              mycorInfo2.splice(i3, 1);
          }
        }
      }
      if (soil2[i2].className.includes("mycor")) {
        soilInfo2[i2].nutri += 0.5;
      }
    }
    module2.exports = {
      soil: soil2,
      soilInfo: soilInfo2,
      mycorInfo: mycorInfo2,
      arrIncludes,
      createSoil: createSoil2,
      loadSoilInfo: loadSoilInfo2,
      createMycor: createMycor2,
      toggleHRoot: toggleHRoot2,
      toggleVRoot: toggleVRoot2,
      mostNutri: mostNutri2,
      growMycor: growMycor2,
      growVRoot: growVRoot2,
      growHRoot: growHRoot2,
      growHVRoot: growHVRoot2,
      reduceNutrient: reduceNutrient2
    };
  }
});

// src/sky-activities.js
var require_sky_activities = __commonJS({
  "src/sky-activities.js"(exports2, module2) {
    init_();
    init_index_coord_helper();
    var worldParams2 = require_world_params();
    var { WIDTH: WIDTH3, SKY_HEIGHT: SKY_HEIGHT2, SOIL_HEIGHT: SOIL_HEIGHT3, HEIGHT: HEIGHT3, LOW_NUTRI: LOW_NUTRI2, frame: frame2 } = worldParams2;
    var soilActs = require_soil_activities();
    var soil2 = soilActs.soil;
    var soilInfo2 = soilActs.soilInfo;
    var sky2 = [];
    var plantInfo2 = [];
    var plant = class {
      constructor(len, state, id) {
        this.len = len;
        this.state = state;
        this.id = id;
      }
    };
    function createSky2() {
      for (let i2 = 0; i2 < WIDTH3 * SKY_HEIGHT2; i2++) {
        const cell = document.createElement("div");
        cell.classList.add("sky");
        cell.setAttribute("id", i2);
        frame2.appendChild(cell);
        sky2.push(cell);
      }
    }
    function loadPlantInfo2() {
      for (let i2 = 0; i2 < WIDTH3; i2++) {
        let id = [];
        let state = [];
        for (let j2 = i2; j2 < sky2.length; j2 += WIDTH3) {
          id.push(j2);
          state.push("sky");
        }
        plantInfo2.push(new plant(Math.floor(Math.random() * (8 - 4) + 4), state, id));
      }
    }
    function growBud2(i2) {
      let diff = WIDTH3 * (SKY_HEIGHT2 - 1);
      let x = coordX(sky2[i2]);
      let y = coordY(sky2[i2]);
      if (soil2[i2 - diff].className == "soil organic h_root") {
        plantInfo2[x].state[y] = "sky h_plant";
      } else if (soil2[i2 - diff].className == "soil organic v_root") {
        plantInfo2[x].state[y] = "sky v_plant";
      }
    }
    function growPlants2(i2) {
      let top = i2 - WIDTH3;
      let bot = i2 + WIDTH3;
      let x = coordX(sky2[i2]);
      let y = coordY(sky2[i2]);
      let hstem = plantInfo2[x].state.filter((cell) => cell.includes("h_plant"));
      let vstem = plantInfo2[x].state.filter((cell) => cell.includes("v_plant"));
      let plant1stem = plantInfo2[x].state.filter((cell) => cell.includes("ab_plant1"));
      if (sky2[bot].className.includes("h_plant") && !sky2[top].className.includes("h_flower") && !sky2[top].className.includes("v_plant") && !sky2[top].className.includes("water") && hstem.length < plantInfo2[x].len) {
        plantInfo2[x].state[y] = "sky h_plant";
      } else if (sky2[bot].className.includes("h_plant") && !sky2[top].className.includes("h_flower") && hstem.length == plantInfo2[x].len) {
        plantInfo2[x].state[SKY_HEIGHT2 - hstem.length - 1] = "sky h_flower";
      } else if (sky2[bot].className.includes("v_plant") && !sky2[top].className.includes("v_flower") && !sky2[top].className.includes("h_plant") && !sky2[top].className.includes("water") && vstem.length < plantInfo2[x].len) {
        plantInfo2[x].state[y] = "sky v_plant";
      } else if (sky2[bot].className.includes("v_plant") && !sky2[top].className.includes("v_flower") && vstem.length == plantInfo2[x].len) {
        plantInfo2[x].state[SKY_HEIGHT2 - vstem.length - 1] = "sky v_flower";
      }
    }
    function wiltPlant2(i2) {
      let diff = WIDTH3 * (SKY_HEIGHT2 - 1);
      let x = coordX(sky2[i2]);
      let y = coordY(sky2[i2]);
      if (sky2[i2].className.includes("h_flower_wilted") || sky2[i2].className.includes("h_plant_wilted")) {
        let budID = plantInfo2[x].id[SKY_HEIGHT2 - 1];
        let soilID = budID - diff;
        if (soilInfo2[soilID].nutri <= LOW_NUTRI2 && !sky2[i2 + WIDTH3].className.includes("h_plant_wilted")) {
          plantInfo2[x].state[y + 1] = "sky h_plant_wilted";
        }
      }
      if (sky2[i2].className.includes("v_flower_wilted") || sky2[i2].className.includes("v_plant_wilted")) {
        let budID = plantInfo2[x].id[SKY_HEIGHT2 - 1];
        let soilID = budID - diff;
        if (soilInfo2[soilID].nutri <= LOW_NUTRI2 && !sky2[i2 + WIDTH3].className.includes("v_plant_wilted")) {
          plantInfo2[x].state[y + 1] = "sky v_plant_wilted";
        }
      }
    }
    function wiltFlower2(i2) {
      let diff = WIDTH3 * (SKY_HEIGHT2 - 1);
      let x = coordX(sky2[i2]);
      let y = coordY(sky2[i2]);
      if (sky2[i2].className.includes("h_flower")) {
        let budID = plantInfo2[x].id[SKY_HEIGHT2 - 1];
        let soilID = budID - diff;
        if (soilInfo2[soilID].nutri <= LOW_NUTRI2) {
          plantInfo2[x].state[y] = "sky h_flower_wilted";
        }
      }
      if (sky2[i2].className.includes("v_flower")) {
        let budID = plantInfo2[x].id[SKY_HEIGHT2 - 1];
        let soilID = budID - diff;
        if (soilInfo2[soilID].nutri <= LOW_NUTRI2) {
          plantInfo2[x].state[y] = "sky v_flower_wilted";
        }
      }
    }
    function plantGone2(i2) {
      let diff = WIDTH3 * (SKY_HEIGHT2 - 1);
      let x = coordX(sky2[i2]);
      let y = coordY(sky2[i2]);
      if (sky2[i2].className.includes("h_flower_wilted")) {
        let budID = plantInfo2[x].id[SKY_HEIGHT2 - 1];
        let rootID = budID - diff;
        if (!plantInfo2[x].state.includes("sky h_flower") && !plantInfo2[x].state.includes("sky h_plant") && !soil2[rootID].className.includes("h_root")) {
          for (let j2 = 0; j2 < SKY_HEIGHT2; j2++) {
            if (!plantInfo2[x].state[j2].includes("hose")) {
              plantInfo2[x].state[j2] = "sky";
            }
          }
        }
      }
      if (sky2[i2].className.includes("v_flower_wilted")) {
        let budID = plantInfo2[x].id[SKY_HEIGHT2 - 1];
        let rootID = budID - diff;
        if (!plantInfo2[x].state.includes("sky v_flower") && !plantInfo2[x].state.includes("sky v_plant") && !soil2[rootID].className.includes("v_root")) {
          for (let j2 = 0; j2 < SKY_HEIGHT2; j2++) {
            if (!plantInfo2[x].state[j2].includes("hose")) {
              plantInfo2[x].state[j2] = "sky";
            }
          }
        }
      }
    }
    module2.exports = {
      sky: sky2,
      plantInfo: plantInfo2,
      createSky: createSky2,
      loadPlantInfo: loadPlantInfo2,
      growBud: growBud2,
      growPlants: growPlants2,
      wiltFlower: wiltFlower2,
      wiltPlant: wiltPlant2,
      plantGone: plantGone2
    };
  }
});

// src/style/nutri-grid.css
var init_2 = __esm({
  "src/style/nutri-grid.css"() {
  }
});

// src/nutri-grid.js
var require_nutri_grid = __commonJS({
  "src/nutri-grid.js"(exports2, module2) {
    init_2();
    init_index_coord_helper();
    var worldParams2 = require_world_params();
    var {
      WIDTH: WIDTH3,
      SOIL_HEIGHT: SOIL_HEIGHT3,
      LOWEST_STARTING_NUTRI: LOWEST_STARTING_NUTRI2,
      LOW_NUTRI: LOW_NUTRI2,
      MAX_NUTRI: MAX_NUTRI2,
      FLOOD_THRESHOLD,
      WATER_NUTRI_VAL
    } = worldParams2;
    var soilActivities2 = require_soil_activities();
    var soilInfo2 = soilActivities2.soilInfo;
    var nutriFrame2 = document.querySelector(".nutri_frame");
    var soilNutri2 = [];
    var soilNutriRec2 = [];
    function createSoilNutri2() {
      let stotal = WIDTH3 * SOIL_HEIGHT3;
      for (let i2 = 0; i2 < stotal; i2++) {
        const cell = document.createElement("div");
        cell.classList.add("soil-nutri");
        cell.setAttribute("id", i2);
        nutriFrame2.appendChild(cell);
        soilNutri2.push(cell);
      }
      for (let i2 = 0; i2 < WIDTH3 * SOIL_HEIGHT3; i2++) {
        soilNutri2[i2].classList.add("nutri_soil");
        soilNutriRec2.push(soilNutri2[i2].className);
      }
    }
    function updateNutriRec2() {
      for (let i2 = 0; i2 < soilNutriRec2.length; i2++) {
        if (soilInfo2[i2].nutri < LOW_NUTRI2 && !soilNutriRec2[i2].includes("low-nutri")) {
          soilNutriRec2[i2] = soilNutriRec2[i2].concat(" low-nutri");
        }
        if (soilInfo2[i2].nutri >= LOW_NUTRI2 && soilInfo2[i2].nutri < LOWEST_STARTING_NUTRI2 + 2 && !soilNutriRec2[i2].includes("med-nutri")) {
          soilNutriRec2[i2] = soilNutriRec2[i2].concat(" med-nutri");
        }
        if (soilInfo2[i2].nutri > MAX_NUTRI2) {
          soilNutriRec2[i2] = soilNutriRec2[i2].replace("low-nutri", "");
          soilNutriRec2[i2] = soilNutriRec2[i2].replace("med-nutri", "");
        }
        if (soilInfo2[i2].nutri <= 0 && !soilNutriRec2[i2].includes("dead-nutri")) {
          soilNutriRec2[i2] = soilNutriRec2[i2].concat(" dead-nutri");
        }
      }
    }
    function showNutri2() {
      let hiddenNutri = document.getElementsByClassName("hidden-nutri")[0];
      hiddenNutri.classList.toggle("show-nutri");
    }
    function nutriNeighbours(cell) {
      let x = coordX(cell);
      let y = coordY(cell);
      let neighbours = [];
      for (let dx2 = -1; dx2 < 2; dx2++) {
        for (let dy2 = 0; dy2 < 2; dy2++) {
          let nx = (x + dx2 + WIDTH3) % WIDTH3;
          let ny = (y + dy2 + SOIL_HEIGHT3) % SOIL_HEIGHT3;
          let nID = coordToIndex([nx, ny]);
          neighbours.push(soilNutri2[nID].id);
        }
      }
      return neighbours;
    }
    function waterNutriFlow2() {
      for (let i2 = 0; i2 < soilNutri2.length; i2++) {
        if (soilInfo2[i2].nutri > FLOOD_THRESHOLD && !soilNutriRec2[i2].includes("soil-flood")) {
          soilNutriRec2[i2] = soilNutriRec2[i2].concat(" soil-flood");
        }
        if (soilNutri2[i2].className.includes("soil-water")) {
          let n = nutriNeighbours(soilNutri2[i2]);
          if (soilInfo2[i2].nutri <= MAX_NUTRI2) {
            soilInfo2[i2].nutri += WATER_NUTRI_VAL;
            soilNutriRec2[i2] = soilNutriRec2[i2].replace(" soil-water", "");
          } else if (soilNutri2[i2].className.includes("soil-water") && soilInfo2[i2].nutri > MAX_NUTRI2 && i2 < soilNutri2.length - WIDTH3) {
            let below = i2 + WIDTH3;
            if (soilInfo2[below].nutri <= MAX_NUTRI2)
              soilInfo2[below].nutri += WATER_NUTRI_VAL;
            soilNutriRec2[below] = soilNutriRec2[below].concat(" soil-water");
            soilNutriRec2[i2] = soilNutriRec2[i2].replace(" soil-water", "");
          }
          for (let j2 = 0; j2 < n.length; j2++) {
            if (soilInfo2[n[j2]].nutri <= MAX_NUTRI2)
              soilInfo2[n[j2]].nutri += WATER_NUTRI_VAL;
          }
        }
      }
    }
    module2.exports = {
      nutriFrame: nutriFrame2,
      soilNutri: soilNutri2,
      soilNutriRec: soilNutriRec2,
      createSoilNutri: createSoilNutri2,
      updateNutriRec: updateNutriRec2,
      showNutri: showNutri2,
      waterNutriFlow: waterNutriFlow2
    };
  }
});

// src/style-helper.js
var require_style_helper = __commonJS({
  "src/style-helper.js"(exports2, module2) {
    init_();
    function toggleBtnOnOff2(element) {
      if (element.className !== "toggled") {
        element.className = "toggled";
      } else {
        element.className = "";
      }
    }
    function fadeElem2(elem, duration, finalOpacity) {
      let start = new Date();
      (function next() {
        let time = new Date() - start;
        if (time < duration) {
          elem.style.opacity = 1 - time / duration;
          requestAnimationFrame(next);
        } else {
          elem.style.opacity = finalOpacity;
        }
      })();
    }
    module2.exports = {
      toggleBtnOnOff: toggleBtnOnOff2,
      fadeElem: fadeElem2
    };
  }
});

// src/hose.js
var require_hose = __commonJS({
  "src/hose.js"(exports2, module2) {
    init_();
    init_2();
    init_index_coord_helper();
    var worldParams2 = require_world_params();
    var { WIDTH: WIDTH3, SKY_HEIGHT: SKY_HEIGHT2, SOIL_HEIGHT: SOIL_HEIGHT3, HEIGHT: HEIGHT3, frame: frame2 } = worldParams2;
    var skyActivies2 = require_sky_activities();
    var sky2 = skyActivies2.sky;
    var plantInfo2 = skyActivies2.plantInfo;
    var soilActivities2 = require_soil_activities();
    var soil2 = soilActivities2.soil;
    var soilInfo2 = soilActivities2.soilInfo;
    var nutriActivities = require_nutri_grid();
    var soilNutri2 = nutriActivities.soilNutri;
    var soilNutriRec2 = nutriActivities.soilNutriRec;
    var styling2 = require_style_helper();
    var {
      toggleBtnOnOff: toggleBtnOnOff2
    } = styling2;
    var waterBtn1 = document.getElementById("activate_water");
    var hoseBtn1 = document.getElementById("activate_hose");
    var waterBtn2 = document.getElementById("water_btn");
    var hoseBtn = document.getElementById("hose_btn");
    function buildHose(cell) {
      let x = coordX(cell);
      let y = coordY(cell);
      cell.addEventListener("click", () => {
        cell.classList.toggle("hose");
        plantInfo2[x].state[y] = cell.className;
        console.log(cell);
      });
    }
    function getSpigots2() {
      let hoses = [];
      for (let x = 0; x < WIDTH3; x++) {
        let id = coordToIndex([x, 0]);
        if (sky2[id].className.includes("hose")) {
          hoses.push(sky2[id]);
        }
      }
      for (let y = 0; y < SKY_HEIGHT2; y++) {
        let id = coordToIndex([0, y]);
        let id2 = coordToIndex([WIDTH3 - 1, y]);
        if (sky2[id].className.includes("hose")) {
          hoses.push(sky2[id]);
        } else if (sky2[id2].className.includes("hose")) {
          hoses.push(sky2[id2]);
        }
      }
      return hoses;
    }
    function nextHoseCell2(currentCell, prevCell = currentCell) {
      let next = [];
      let x = coordX(currentCell);
      let y = coordY(currentCell);
      let botID = coordToIndex([x, y + 1]);
      let leftID = coordToIndex([x - 1, y]);
      let rightID = coordToIndex([x + 1, y]);
      let checklist = [sky2[botID], sky2[leftID], sky2[rightID]];
      for (let i2 = 0; i2 < checklist.length; i2++) {
        if (checklist[i2].className.includes("hose") && checklist[i2] != prevCell) {
          next.push(checklist[i2]);
          if (sky2[botID] == checklist[i2]) {
            let nx = coordX(checklist[i2]);
            let ny = coordY(checklist[i2]);
            let nLeftID = coordToIndex([nx - 1, ny]);
            let nRightID = coordToIndex([nx + 1, ny]);
            if (sky2[nLeftID].className.includes("hose") && sky2[nRightID].className.includes("hose") && sky2[nLeftID] != checklist[i2] && sky2[nRightID] != checklist[i2]) {
              next.push(sky2[nLeftID]);
              next.push(sky2[nRightID]);
            }
          }
        }
      }
      return next;
    }
    function isHose2(currentCell, prevCell = currentCell) {
      let prev = prevCell;
      let current = currentCell;
      newHoseCell = nextHoseCell2(current, prev);
      if (newHoseCell.length == 1) {
        prev = currentCell;
        current = newHoseCell[0];
        isHose2(current, prev);
      }
      if (newHoseCell.length == 0)
        return false;
      else if (newHoseCell.length == 3)
        return [true, newHoseCell[0]];
      else {
        console.error("isHose error");
      }
    }
    function waterFlow2(i2) {
      let ogX = coordX(sky2[i2]);
      let ogY = coordY(sky2[i2]);
      if (sky2[i2].className.includes("water") && i2 < sky2.length - WIDTH3) {
        let belowID = i2 + WIDTH3;
        if (!sky2[belowID].className.includes("water")) {
          let belowX = coordX(sky2[belowID]);
          let belowY = coordY(sky2[belowID]);
          plantInfo2[ogX].state[ogY] = plantInfo2[ogX].state[ogY].replace(" water", "");
          plantInfo2[belowX].state[belowY] = plantInfo2[belowX].state[belowY].concat(" water");
        }
      } else if (sky2[i2].className.includes("water") && i2 > sky2.length - WIDTH3 && i2 < sky2.length) {
        let diff = WIDTH3 * (SKY_HEIGHT2 - 1);
        let belowID = i2 - diff;
        soilNutriRec2[belowID] = soilNutriRec2[belowID].concat(" soil-water");
        plantInfo2[ogX].state[ogY] = plantInfo2[ogX].state[ogY].replace(" water", "");
      }
    }
    function waterOn2() {
      let spigots = getSpigots2();
      if (spigots.length > 0) {
        for (let i2 = 0; i2 < spigots.length; i2++) {
          if (isHose2(spigots[i2])[0]) {
            let center = isHose2(spigots[i2])[1];
            let waterID = Number(center.id) + WIDTH3;
            let waterX = coordX(sky2[waterID]);
            let waterY = coordY(sky2[waterID]);
            if (!plantInfo2[waterX].state[waterY].includes("water")) {
              plantInfo2[waterX].state[waterY] = plantInfo2[waterX].state[waterY].concat(" water");
            }
            sky2[waterID].className = sky2[waterID].className.concat(" water");
          }
        }
      }
    }
    waterBtn2.addEventListener("click", function() {
      toggleBtnOnOff2(waterBtn2);
      waterOn2();
    });
    hoseBtn.addEventListener("click", function() {
      toggleBtnOnOff2(hoseBtn);
      sky2.forEach((cell) => {
        buildHose(cell);
      });
    });
    module2.exports = {
      getSpigots: getSpigots2,
      nextHoseCell: nextHoseCell2,
      isHose: isHose2,
      waterFlow: waterFlow2,
      waterOn: waterOn2,
      waterBtn: waterBtn2
    };
  }
});

// src/single-seed.js
var require_single_seed = __commonJS({
  "src/single-seed.js"(exports2, module2) {
    init_();
    init_index_coord_helper();
    var styling2 = require_style_helper();
    var worldParams2 = require_world_params();
    var {
      WIDTH: WIDTH3,
      SOIL_HEIGHT: SOIL_HEIGHT3,
      SKY_HEIGHT: SKY_HEIGHT2,
      HEIGHT: HEIGHT3,
      LOWEST_STARTING_NUTRI: LOWEST_STARTING_NUTRI2,
      LOW_NUTRI: LOW_NUTRI2,
      MAX_NUTRI: MAX_NUTRI2,
      ROOT_LEN_FOR_PLANT,
      MAX_ROOT_LEN,
      CONT_ROOT_GROW,
      ROOT_MULTIPLIER,
      frame: frame2
    } = worldParams2;
    var soilActivities2 = require_soil_activities();
    var {
      arrIncludes,
      soil: soil2,
      soilInfo: soilInfo2,
      mycorInfo: mycorInfo2,
      createSoil: createSoil2,
      loadSoilInfo: loadSoilInfo2,
      mostNutri: mostNutri2,
      reduceNutrient: reduceNutrient2
    } = soilActivities2;
    var skyActivities = require_sky_activities();
    var {
      sky: sky2,
      plantInfo: plantInfo2
    } = skyActivities;
    var singlePlant = class {
      constructor(id, rootLen, maxRootLen, rootList, soilPlantList) {
        this.id = id;
        this.rootLen = rootLen;
        this.maxRootLen = maxRootLen, this.rootList = rootList;
        this.soilPlantList = soilPlantList;
      }
    };
    var allPlants2 = [];
    function toggleSeed12(cell) {
      cell.addEventListener("click", () => {
        cell.classList.toggle("seed1");
        soilInfo2[cell.id].state = cell.className;
        soilInfo2[cell.id].nutri -= 1;
        allPlants2.push(new singlePlant(Number(cell.id), 1, MAX_ROOT_LEN, [Number(cell.id)], []));
        console.log(cell);
      });
    }
    function avgPlant1SoilNutri(i2) {
      let seedID = findSeedID2(i2);
      let allPlantsPos = findIndex2(allPlants2, seedID);
      let rootList = allPlants2[allPlantsPos].rootList;
      let soilPlantList = allPlants2[allPlantsPos].soilPlantList;
      let totalNutri = 0;
      for (let k2 = 0; k2 < rootList.length; k2++) {
        let cellID = rootList[k2];
        totalNutri += soilInfo2[cellID].nutri;
      }
      for (let j2 = 0; j2 < soilPlantList.length; j2++) {
        let cellID = soilPlantList[j2];
        totalNutri += soilInfo2[cellID].nutri;
      }
      return {
        allPlantsPos,
        avgPlantNutri: totalNutri / (rootList.length + soilPlantList.length)
      };
    }
    function findIndex2(arr, index) {
      let result = arr.find(({ id }) => Number(id) == Number(index));
      return arr.indexOf(result);
    }
    function root1Neighbours(cell) {
      let n = [];
      let x = coordX(cell);
      let y = coordY(cell);
      let ny = (y + 1 + SOIL_HEIGHT3) % SOIL_HEIGHT3;
      for (let dx2 = -1; dx2 < 2; dx2++) {
        let nx = (x + dx2 + WIDTH3) % WIDTH3;
        n.push(soilInfo2[coordToIndex([nx, ny])]);
      }
      return n;
    }
    function findSeedID2(i2) {
      for (j = 0; j < allPlants2.length; j++) {
        for (k = 0; k < allPlants2[j].rootList.length; k++) {
          let searchID = allPlants2[j].rootList[k];
          if (searchID == i2) {
            return allPlants2[j].id;
          }
        }
        for (l = 0; l < allPlants2[j].soilPlantList.length; l++) {
          let searchID = allPlants2[j].soilPlantList[l];
          if (searchID == i2) {
            return allPlants2[j].id;
          }
        }
      }
    }
    function growRoot12(i2) {
      let nb = root1Neighbours(soil2[i2]);
      let nbState = [];
      for (let j2 = 0; j2 < nb.length; j2++) {
        nbState.push(nb[j2].state);
      }
      let avg = avgPlant1SoilNutri(i2);
      let { allPlantsPos, avgPlantNutri } = avg;
      if (!arrIncludes(nbState, "root1") && !arrIncludes(nbState, "seed1") && !arrIncludes(nbState, "ud_plant1") && avgPlantNutri > LOW_NUTRI2) {
        let grow = mostNutri2(nb);
        let seedID = findSeedID2(i2);
        let allPlantsID = findIndex2(allPlants2, seedID);
        for (let k2 = 0; k2 < grow.length; k2++) {
          if (soilInfo2[grow[k2].id].nutri > 0 && allPlants2[allPlantsID].rootLen < allPlants2[allPlantsID].maxRootLen) {
            soilInfo2[grow[k2].id].state = soilInfo2[grow[k2].id].state.concat(" root1");
            soilInfo2[grow[k2].id].nutri -= 1;
            allPlants2[allPlantsID].rootLen += 1;
            allPlants2[allPlantsID].rootList.push(grow[k2].id);
          }
        }
      }
    }
    function growPlant1Under2(i2) {
      allPlantSeedID = findIndex2(allPlants2, i2);
      let aboveID = i2 - WIDTH3;
      if (aboveID >= 0) {
        let seedID = findSeedID2(i2);
        let plantID = findIndex2(allPlants2, seedID);
        let avg = avgPlant1SoilNutri(i2);
        let { allPlantsPos, avgPlantNutri } = avg;
        if (soil2[i2].className.includes("seed1") && allPlants2[allPlantSeedID].rootLen > ROOT_LEN_FOR_PLANT && !soil2[aboveID].className.includes("ud_plant1") && !soil2[aboveID].className.includes("seed1") && avgPlantNutri > LOW_NUTRI2) {
          soilInfo2[aboveID].state = soilInfo2[aboveID].state.concat(" ud_plant1");
          soilInfo2[aboveID].nutri -= 1;
          allPlants2[plantID].soilPlantList.push(aboveID);
        }
        if (soil2[i2].className.includes("ud_plant1") && !soil2[aboveID].className.includes("ud_plant1") && !soil2[aboveID].className.includes("root1") && !soil2[aboveID].className.includes("seed1") && avgPlantNutri > LOW_NUTRI2) {
          soilInfo2[aboveID].state = soilInfo2[aboveID].state.concat(" ud_plant1");
          soilInfo2[aboveID].nutri -= 1;
          allPlants2[plantID].soilPlantList.push(aboveID);
        }
      }
    }
    function seed1Bud2(i2) {
      let diff = WIDTH3 * (SKY_HEIGHT2 - 1);
      let x = coordX(sky2[i2]);
      let y = coordY(sky2[i2]);
      if (soil2[i2 - diff].className.includes("ud_plant1") && !plantInfo2[x].state[y].includes("ab_plant1")) {
        let avg = avgPlant1SoilNutri(i2 - diff);
        let { allPlantsPos, avgPlantNutri } = avg;
        if (avgPlantNutri > LOW_NUTRI2) {
          plantInfo2[x].state[y] = plantInfo2[x].state[y].concat(" ab_plant1");
        }
      }
    }
    function growPlant1Above2(i2) {
      let top = i2 - WIDTH3;
      let bot = i2 + WIDTH3;
      let x = coordX(sky2[i2]);
      let y = coordY(sky2[i2]);
      let plant1stem = plantInfo2[x].state.filter((cell) => cell.includes("ab_plant1"));
      if (sky2[bot].className.includes("ab_plant1") && !sky2[top].className.includes("flower1") && !sky2[top].className.includes("water") && plant1stem.length < plantInfo2[x].len) {
        plantInfo2[x].state[y] = "sky ab_plant1";
      } else if (sky2[bot].className.includes("ab_plant1") && !sky2[top].className.includes("flower1") && plant1stem.length == plantInfo2[x].len) {
        plantInfo2[x].state[SKY_HEIGHT2 - plant1stem.length - 1] = "sky flower1";
        let budID = plantInfo2[x].id[SKY_HEIGHT2 - 1];
        let diff = WIDTH3 * (SKY_HEIGHT2 - 1);
        let topSoilRootID = budID - diff;
        let seedID = findSeedID2(topSoilRootID);
        let plantID = findIndex2(allPlants2, seedID);
        allPlants2[plantID].maxRootLen = plant1stem.length * ROOT_MULTIPLIER;
      }
    }
    function reducePlant1Nutri2(i2) {
      if (soil2[i2].className.includes("seed1") || soil2[i2].className.includes("ud_plant1") || soil2[i2].className.includes("root1")) {
        if (soilInfo2[i2].nutri > 0)
          soilInfo2[i2].nutri -= 1;
      }
      if (soil2[i2].className.includes("seed1")) {
        let avg = avgPlant1SoilNutri(i2);
        let { allPlantsPos, avgPlantNutri } = avg;
        console.log(avgPlantNutri);
        if (avgPlantNutri < LOW_NUTRI2) {
          if (allPlants2[allPlantsPos].rootList.length > 1) {
            let removedID = allPlants2[allPlantsPos].rootList.pop();
            allPlants2[allPlantsPos].rootLen -= 1;
            soilInfo2[removedID].state = soilInfo2[removedID].state.replace(" root1", "");
            soil2[removedID].className = soilInfo2[removedID].state;
            console.log(`${allPlants2[allPlantsPos].rootList}`);
          }
        }
      }
    }
    function wiltFlower12(i2) {
      let x = coordX(sky2[i2]);
      let y = coordY(sky2[i2]);
      let diff = WIDTH3 * (SKY_HEIGHT2 - 1);
      let budID = plantInfo2[x].id[SKY_HEIGHT2 - 1];
      let topSoilID = budID - diff;
      if (plantInfo2[x].state[y] == "sky flower1") {
        let avg = avgPlant1SoilNutri(topSoilID);
        let { allPlantsPos, avgPlantNutri } = avg;
        if (avgPlantNutri < LOW_NUTRI2) {
          plantInfo2[x].state[y] = "sky flower1_wilted";
        } else if (plantInfo2[x].state[y] == "sky flower1_wilted" && avgPlantNutri >= LOW_NUTRI2 && plantInfo2[x].state[y + 1] == "sky ab_plant1") {
          plantInfo2[x].state[y] = "sky flower1";
        }
      }
    }
    function wiltPlant12(i2) {
      let x = coordX(sky2[i2]);
      let y = coordY(sky2[i2]);
      let diff = WIDTH3 * (SKY_HEIGHT2 - 1);
      let budID = plantInfo2[x].id[SKY_HEIGHT2 - 1];
      let topSoilID = budID - diff;
      if (plantInfo2[x].state[y] == "sky ab_plant1") {
        let avg = avgPlant1SoilNutri(topSoilID);
        let { allPlantsPos, avgPlantNutri } = avg;
        if (avgPlantNutri < LOW_NUTRI2 && plantInfo2[x].state[y - 1].includes("wilted")) {
          plantInfo2[x].state[y] = "sky ab_plant1_wilted";
        }
      }
      if (plantInfo2[x].state[y] == "sky ab_plant1_wilted") {
        let avg = avgPlant1SoilNutri(topSoilID);
        let { allPlantsPos, avgPlantNutri } = avg;
        if (avgPlantNutri >= LOW_NUTRI2 && plantInfo2[x].state[y + 1].includes("ab_plant1")) {
          plantInfo2[x].state[y] = "sky ab_plant1";
        }
      }
    }
    function wiltPlant1Bud2(i2) {
      let x = coordX(sky2[i2]);
      let y = coordY(sky2[i2]);
      let diff = WIDTH3 * (SKY_HEIGHT2 - 1);
      let budID = plantInfo2[x].id[SKY_HEIGHT2 - 1];
      let topSoilID = budID - diff;
      if (plantInfo2[x].state[y] == "sky ab_plant1") {
        let avg = avgPlant1SoilNutri(topSoilID);
        let { allPlantsPos, avgPlantNutri } = avg;
        if (avgPlantNutri < LOW_NUTRI2 && plantInfo2[x].state[y - 1] == "sky ab_plant1_wilted") {
          plantInfo2[x].state[y] = "sky ab_plant1_wilted";
        }
      }
      if (plantInfo2[x].state[y] == "sky ab_plant1_wilted") {
        let avg = avgPlant1SoilNutri(topSoilID);
        let { allPlantsPos, avgPlantNutri } = avg;
        if (avgPlantNutri >= LOW_NUTRI2) {
          plantInfo2[x].state[y] = "sky ab_plant1";
        }
      }
    }
    function plant1Gone2(i2) {
      let diff = WIDTH3 * (SKY_HEIGHT2 - 1);
      let x = coordX(sky2[i2]);
      let y = coordY(sky2[i2]);
      if (sky2[i2].className.includes("flower1_wilted")) {
        let budID = plantInfo2[x].id[SKY_HEIGHT2 - 1];
        let topSoilID = budID - diff;
        let avg = avgPlant1SoilNutri(topSoilID);
        let { allPlantsPos, avgPlantNutri } = avg;
        let plantCells = plantInfo2[x].state.filter((cell) => cell.includes("plant"));
        let wiltedCells = plantInfo2[x].state.filter((cell) => cell.includes("wilted"));
        if (avgPlantNutri < LOW_NUTRI2 && plantCells.length + 1 == wiltedCells.length) {
          for (let j2 = 0; j2 < SKY_HEIGHT2; j2++) {
            if (!plantInfo2[x].state[j2].includes("hose")) {
              plantInfo2[x].state[j2] = "sky";
            }
          }
        }
      }
    }
    function plant1UnderGone2(i2) {
      if (soil2[i2].className.includes("seed1")) {
        let x = coordX(soil2[i2]);
        let plant = plantInfo2[x].state.filter((cell) => cell.includes("ab_plant1"));
        if (plant.length == 0) {
          let plantID = findIndex2(allPlants2, i2);
          if (allPlants2[plantID].soilPlantList.length > 0 && allPlants2[plantID].rootList.length == 1) {
            for (let j2 = 0; j2 < allPlants2[plantID].soilPlantList.length; j2++) {
              let udID = allPlants2[plantID].soilPlantList[j2];
              soilInfo2[udID].state = soilInfo2[udID].state.replace(" ud_plant1", "");
              soil2[udID].className = soil2[udID].className.replace(" ud_plant1", "");
            }
            soilInfo2[i2].state = soilInfo2[i2].state.replace(" seed1", "");
            soil2[i2].className = soil2[i2].className.replace(" seed1", "");
            allPlants2.splice(plantID, 1);
          }
        }
      }
    }
    module2.exports = {
      allPlants: allPlants2,
      findIndex: findIndex2,
      toggleSeed1: toggleSeed12,
      findSeedID: findSeedID2,
      growRoot1: growRoot12,
      growPlant1Under: growPlant1Under2,
      growPlant1Above: growPlant1Above2,
      seed1Bud: seed1Bud2,
      reducePlant1Nutri: reducePlant1Nutri2,
      wiltFlower1: wiltFlower12,
      wiltPlant1: wiltPlant12,
      wiltPlant1Bud: wiltPlant1Bud2,
      plant1Gone: plant1Gone2,
      plant1UnderGone: plant1UnderGone2
    };
  }
});

// src/page-effects.js
var require_page_effects = __commonJS({
  "src/page-effects.js"(exports2, module2) {
    init_();
    var allInfo3 = document.getElementById("info");
    var allInfoChildren2 = allInfo3.children;
    var infoPage2 = document.getElementById("all_info");
    function initInfo2() {
      allInfoChildren2[0].classname = "info1";
      for (let i2 = 1; i2 < allInfoChildren2.length; i2++) {
        allInfoChildren2[i2].className = "info" + i2 + "_hide";
      }
    }
    function cycleInfo2() {
      let currentInfo = 0;
      for (let i2 = 0; i2 < allInfoChildren2.length; i2++) {
        if (!allInfoChildren2[i2].className.includes("hide")) {
          currentInfo = allInfoChildren2[i2].className;
        }
      }
      if (currentInfo == 0) {
        allInfoChildren2[0].className = "info1";
        currentInfo = allInfoChildren2[0].className;
        infoPage2.id = "all_info";
      }
      let nextInfoID = Number(currentInfo.replace("info", ""));
      let infoID = Number(currentInfo.replace("info", "")) - 1;
      let infoName = infoID + 1;
      let nextInfoName = nextInfoID + 1;
      if (nextInfoName <= allInfoChildren2.length) {
        allInfoChildren2[infoID].className = "info" + infoName.toString() + "_hide";
        allInfoChildren2[nextInfoID].className = "info" + nextInfoName.toString();
      } else if (nextInfoName > allInfoChildren2.length) {
        allInfoChildren2[infoID].className = "info" + infoName.toString() + "_hide";
        infoPage2.id = "all_info_hide";
      }
    }
    module2.exports = {
      infoPage: infoPage2,
      allInfo: allInfo3,
      allInfoChildren: allInfoChildren2,
      initInfo: initInfo2,
      cycleInfo: cycleInfo2
    };
  }
});

// src/main.js
init_();
init_index_coord_helper();
var soilActivities = require_soil_activities();
var {
  soil,
  soilInfo,
  mycorInfo,
  createSoil,
  loadSoilInfo,
  createMycor,
  toggleHRoot,
  toggleVRoot,
  mostNutri,
  growMycor,
  growVRoot,
  growHRoot,
  growHVRoot,
  reduceNutrient
} = soilActivities;
var skyActivies = require_sky_activities();
var {
  sky,
  plantInfo,
  createSky,
  loadPlantInfo,
  growBud,
  growPlants,
  wiltFlower,
  wiltPlant,
  plantGone
} = skyActivies;
var worldParams = require_world_params();
var {
  WIDTH: WIDTH2,
  SKY_HEIGHT,
  SOIL_HEIGHT: SOIL_HEIGHT2,
  HEIGHT: HEIGHT2,
  LOWEST_STARTING_NUTRI,
  LOW_NUTRI,
  MAX_NUTRI,
  ROOT_GROWTH_RATE
} = worldParams;
var nutriGrid = require_nutri_grid();
var {
  nutriFrame,
  soilNutri,
  soilNutriRec,
  createSoilNutri,
  updateNutriRec,
  showNutri,
  waterNutriFlow
} = nutriGrid;
var hoseActivities = require_hose();
var {
  getSpigots,
  nextHoseCell,
  isHose,
  waterFlow,
  waterOn,
  waterBtn
} = hoseActivities;
var styling = require_style_helper();
var {
  toggleBtnOnOff,
  fadeElem
} = styling;
var plant1 = require_single_seed();
var {
  allPlants,
  findIndex,
  toggleSeed1,
  findSeedID,
  growRoot1,
  growPlant1Under,
  growPlant1Above,
  seed1Bud,
  reducePlant1Nutri,
  wiltFlower1,
  wiltPlant1,
  wiltPlant1Bud,
  plant1Gone,
  plant1UnderGone
} = plant1;
var page = require_page_effects();
var {
  infoPage,
  allInfo,
  allInfoChildren,
  initInfo,
  cycleInfo
} = page;
var allInfo2 = document.getElementById("info");
console.log(allInfo2);
var totalStep = 0;
var timer;
var playBtn = document.getElementById("grow_btn");
var pauseBtn = document.getElementById("pause");
var nextBtn = document.getElementById("next");
var reBtn = document.getElementById("restart_btn");
var hSeedBtn = document.getElementById("h_seed_btn");
var vSeedBtn = document.getElementById("v_seed_btn");
var nutriBtn = document.getElementById("nutri_btn");
var singleSeedBtn = document.getElementById("plant1_btn");
var gardenInfoBtn = document.getElementById("info_btn");
var prevDateTime = new Date();
var prevMonth = prevDateTime.getMonth();
var prevDay = prevDateTime.getDate();
var prevHr = prevDateTime.getHours();
var prevMin = prevDateTime.getMinutes();
var prevSec = prevDateTime.getSeconds();
function timePassed(prevDate, currDate) {
  let mSecPassed = currDate - prevDate;
  let daysPassed = Math.round(mSecPassed / (1e3 * 60 * 60 * 24));
  let hoursPassed = Math.round(mSecPassed / (1e3 * 60 * 60));
  let minsPassed = Math.round(mSecPassed / (1e3 * 60));
  let secsPassed = Math.round(mSecPassed / 1e3);
  return {
    daysPassed,
    hoursPassed,
    minsPassed,
    secsPassed,
    mSecPassed
  };
}
function step() {
  let currDateTime = new Date();
  let timeElapsed = timePassed(prevDateTime, currDateTime);
  let { daysPassed, hoursPassed, minsPassed, secsPassed, mSecPassed } = timeElapsed;
  if (minsPassed >= ROOT_GROWTH_RATE) {
    for (let i2 = 0; i2 < soil.length; i2++) {
      if (soil[i2].className.includes("h_root")) {
        growHRoot(i2);
      } else if (soil[i2].className.includes("v_root"))
        growVRoot(i2);
      else if (soil[i2].className.includes("mycor")) {
        growMycor(i2);
      }
      if (soil[i2].className.includes("seed1") || soil[i2].className.includes("ud_plant1")) {
        growPlant1Under(i2);
      }
      if (soil[i2].className.includes("seed1") || soil[i2].className.includes("root1")) {
        growRoot1(i2);
      }
      reduceNutrient(i2);
      reducePlant1Nutri(i2);
      plant1UnderGone(i2);
    }
    for (let k2 = sky.length - WIDTH2 - 1; k2 > 0; k2--) {
      growPlants(k2);
      growPlant1Above(k2);
    }
    for (let j2 = sky.length - WIDTH2; j2 < sky.length; j2++) {
      growBud(j2);
      seed1Bud(j2);
      wiltPlant1Bud(j2);
    }
    for (let l2 = 0; l2 < sky.length - WIDTH2; l2++) {
      wiltFlower(l2);
      wiltPlant(l2);
      plantGone(l2);
      wiltFlower1(l2);
      wiltPlant1(l2);
      plant1Gone(l2);
    }
    prevDateTime = currDateTime;
  }
  for (let k2 = 0; k2 < sky.length; k2++) {
    waterFlow(k2);
  }
  if (waterBtn.className == "toggled") {
    waterOn();
  }
  waterNutriFlow();
  updateNutriRec();
  for (let i2 = 0; i2 < soil.length; i2++) {
    soil[i2].className = soilInfo[i2].state;
    soilNutri[i2].className = soilNutriRec[i2];
    if (mycorInfo.includes(soilInfo[i2].organism)) {
      soil[i2].className = soil[i2].className.concat(" mycor");
    }
  }
  for (let i2 = 0; i2 < sky.length; i2++) {
    let x = coordX(sky[i2]);
    let y = coordY(sky[i2]);
    sky[i2].className = plantInfo[x].state[y];
  }
  console.log(`days: ${daysPassed}, hours: ${hoursPassed}, mins: ${minsPassed}, 
   secs: ${secsPassed}, msecs: ${mSecPassed} `);
}
function restart() {
  localStorage.clear();
  totalStep = 0;
  for (let i2 = 0; i2 < WIDTH2; i2++) {
    soil[i2].className = "soil organic";
    soilInfo[i2].state = "soil organic";
    soilInfo[i2].nutri = Math.floor(Math.random() * (MAX_NUTRI - LOWEST_STARTING_NUTRI) + LOWEST_STARTING_NUTRI);
  }
  for (let i2 = WIDTH2; i2 < soil.length / 2 - WIDTH2; i2++) {
    soil[i2].className = "soil topsoil";
    soilInfo[i2].state = "soil topsoil";
    soilInfo[i2].nutri = Math.floor(Math.random() * (MAX_NUTRI - LOWEST_STARTING_NUTRI) + LOWEST_STARTING_NUTRI);
  }
  for (let i2 = soil.length / 2 - WIDTH2; i2 < soil.length; i2++) {
    soil[i2].className = "soil subsoil";
    soilInfo[i2].state = "soil subsoil";
    soilInfo[i2].nutri = Math.floor(Math.random() * (MAX_NUTRI - LOWEST_STARTING_NUTRI) + LOWEST_STARTING_NUTRI);
  }
  for (let i2 = 0; i2 < sky.length; i2++) {
    let x = coordX(sky[i2]);
    let y = coordY(sky[i2]);
    sky[i2].className = "sky";
    plantInfo[x].state[y] = "sky";
  }
  createMycor();
  for (let i2 = 0; i2 < WIDTH2 * SOIL_HEIGHT2; i2++) {
    soilNutriRec[i2] = "soil-nutri nutri_soil";
    soilNutri[i2].className = "soil-nutri nutri_soil";
    if (soilInfo[i2].nutri < LOW_NUTRI && !soilNutriRec[i2].includes("low-nutri")) {
      soilNutri[i2].className = soilNutri[i2].className.concat(" low-nutri");
      soilNutriRec[i2] = soilNutriRec[i2].concat(" low-nutri");
    }
    if (soilInfo[i2].nutri >= LOW_NUTRI && soilInfo[i2].nutri < LOWEST_STARTING_NUTRI + 2 && !soilNutriRec[i2].includes("med-nutri")) {
      soilNutriRec[i2] = soilNutriRec[i2].concat(" med-nutri");
      soilNutri[i2].className = soilNutri[i2].className.concat(" med-nutri");
    }
    if (soilInfo[i2].nutri > MAX_NUTRI) {
      soilNutriRec[i2] = soilNutriRec[i2].replace("low-nutri", "");
      soilNutriRec[i2] = soilNutriRec[i2].replace("med-nutri", "");
      soilNutri[i2] = soilNutri[i2].replace("low-nutri", "");
      soilNutri[i2] = soilNutri[i2].replace("med-nutri", "");
    }
    if (soilInfo[i2].nutri <= 0 && !soilNutriRec[i2].includes("dead-nutri")) {
      soilNutriRec[i2] = soilNutriRec[i2].concat(" dead-nutri");
      soilNutri[i2].className = soilNutri[i2].className.concat(" dead-nutri");
    }
  }
  allPlants = [];
}
initInfo();
createSky();
createSoil();
loadSoilInfo();
loadPlantInfo();
createMycor();
createSoilNutri();
updateNutriRec();
for (let i2 = 0; i2 < soil.length; i2++) {
  soilNutri[i2].className = soilNutriRec[i2];
}
nutriBtn.addEventListener("click", function() {
  showNutri();
  toggleBtnOnOff(nutriBtn);
});
singleSeedBtn.addEventListener("click", function() {
  soil.forEach((cell) => {
    toggleSeed1(cell);
  });
  toggleBtnOnOff(singleSeedBtn);
});
playBtn.addEventListener("click", function() {
  if (playBtn.className !== "toggled") {
    toggleBtnOnOff(playBtn);
    fadeElem(playBtn, 900, "0.15");
    timer = setInterval(step, 300);
  }
});
reBtn.addEventListener("click", function() {
  toggleBtnOnOff(reBtn);
  clearInterval(timer);
  restart();
});
gardenInfoBtn.addEventListener("click", function() {
  cycleInfo();
});
infoPage.addEventListener("click", function() {
  cycleInfo();
});
//# sourceMappingURL=bundle.js.map
