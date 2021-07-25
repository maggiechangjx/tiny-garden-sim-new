module.exports = {
   O_COEFF: 0, // Weights the contribution of the original velocity on the previous step
   A_COEFF: 1.0, // Weights the contribution of the alignment rule (boids go in the same dir)
   C_COEFF: 1.0, // Weights the contribution of the cohesion rule (boids gather in the clumps)
   S_COEFF: 2.0, // Weights the contribution of the separation rule (boids don't want to collide).
   R_COEFF: 0.5, // Weights a small random contribution to the velocity.
}