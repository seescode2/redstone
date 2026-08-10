import type {Board,ComponentType} from '../models/types';
export interface Result{label:string;passed:boolean}
export const components=(b:Board)=>Object.values(b.cells).flatMap(c=>c.component?[c.component]:[]);
export const lampIsPowered=(x:number,y:number)=>(b:Board):Result=>({label:`Lamp at (${x}, ${y}) is powered`,passed:b.cells[`${x},${y}`]?.component?.type==='lamp'&&b.cells[`${x},${y}`].component.powered});
export const componentExists=(type:ComponentType)=>(b:Board):Result=>({label:`Contains ${type}`,passed:components(b).some(c=>c.type===type)});
export const maxComponentCount=(type:ComponentType,count:number)=>(b:Board):Result=>({label:`Uses at most ${count} ${type}`,passed:components(b).filter(c=>c.type===type).length<=count});
export const boardContainsNo=(type:ComponentType)=>(b:Board):Result=>maxComponentCount(type,0)(b);
export const allLampsPowered=(b:Board):Result=>{const lamps=components(b).filter(c=>c.type==='lamp');return{label:'All lamps are powered',passed:lamps.length>0&&lamps.every(l=>l.type==='lamp'&&l.powered)}};
