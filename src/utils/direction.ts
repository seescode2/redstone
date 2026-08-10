import type {Direction} from '../models/types';
const dirs:Direction[]=['north','east','south','west'];
export const rotateClockwise=(d:Direction)=>dirs[(dirs.indexOf(d)+1)%4];
export const rotateCounterClockwise=(d:Direction)=>dirs[(dirs.indexOf(d)+3)%4];
export const oppositeDirection=(d:Direction)=>dirs[(dirs.indexOf(d)+2)%4];
export const getNeighborCoordinate=(x:number,y:number,d:Direction)=>d==='north'?{x,y:y-1}:d==='south'?{x,y:y+1}:d==='east'?{x:x+1,y}:{x:x-1,y};
export const directions=dirs;
