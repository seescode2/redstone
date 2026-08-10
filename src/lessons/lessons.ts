import {emptyBoard,makeComponent} from '../engine/Engine';import {key,type Board,type ComponentType} from '../models/types';import {allLampsPowered,componentExists,maxComponentCount,type Result} from './validators';
export interface Lesson{id:string;title:string;description:string;objective:string;constraints:string[];allowed:ComponentType[];board:Board;tests:((b:Board)=>Result)[]}
const all:ComponentType[]=['solidBlock','redstoneDust','redstoneTorch','lever','button','repeater','lamp','piston'];
const board=(pieces:[number,number,ComponentType][])=>{const b=emptyBoard();for(const [x,y,t]of pieces)b.cells[key(x,y)]={x,y,component:makeComponent(t)};return b};
const definitions:[string,string,string,ComponentType[],[number,number,ComponentType][],string[]][]=[
['Powering a Lamp','A lever is a persistent source of strength 15.','Place a lever beside the lamp and switch it on.',['lever','lamp'],[[10,5,'lamp']],['Use the provided lamp.']],
['Redstone Dust','Dust carries power and loses one level per tile.','Connect the source to the lamp.',['lever','redstoneDust','lamp'],[[3,5,'lever'],[10,5,'lamp']],['Use dust to bridge the gap.']],
['Signal Strength','Every dust step exposes a lower strength.','Build a longer powered dust line.',['lever','redstoneDust','lamp'],[[2,5,'lever'],[14,5,'lamp']],['Watch the numbers decrease.']],
['Signal Decay','A strength of 15 cannot travel forever: 15 → … → 1 → 0.','Find why this long path fails, then restore it.',['lever','redstoneDust','repeater','lamp'],[[1,5,'lever'],[19,5,'lamp']],['Use no more than 1 repeater.']],
['Repeaters','A repeater regenerates any valid input to 15 after a delay.','Bridge the long run with one repeater.',['lever','redstoneDust','repeater','lamp'],[[1,5,'lever'],[19,5,'lamp']],['Use no more than 1 repeater.']],
['Direction','Repeaters read only from behind and output only forward.','Rotate the repeater toward the lamp.',['lever','redstoneDust','repeater','lamp'],[[5,5,'lever'],[7,5,'repeater'],[10,5,'lamp']],['Select it and press R.']],
['Redstone Torch','A torch reads the block behind it and emits the inverse.','Make the lamp on while the lever is off.',['lever','redstoneTorch','lamp','solidBlock'],[[6,5,'lever'],[7,5,'redstoneTorch'],[9,5,'lamp']],['Torch input uses the cell behind its arrow.']],
['Basic NOT Logic','NOT flips a Boolean input: 0→1 and 1→0.','Demonstrate an inverted output.',['lever','redstoneTorch','redstoneDust','lamp'],[],['Truth table: OFF → ON; ON → OFF.']],
['OR Logic','OR is true when either A or B is true.','Let either lever activate one lamp.',['lever','redstoneDust','lamp'],[[10,5,'lamp']],['Use two levers.']],
['Simple Timing','Repeaters make state changes visible across simulation ticks.','Set a delay and step until the lamp changes.',['lever','redstoneDust','repeater','lamp'],[[5,5,'lever'],[7,5,'repeater'],[10,5,'lamp']],['Set repeater delay above 1.']]
];
export const lessons:Lesson[]=definitions.map((d,i)=>({id:String(i+1),title:d[0],description:d[1],objective:d[2],allowed:d[3],board:board(d[4]),constraints:d[5],tests:[allLampsPowered,componentExists('lever'),maxComponentCount('repeater',i===3||i===4?1:20)]}));export const allComponents=all;
