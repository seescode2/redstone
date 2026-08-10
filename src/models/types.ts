export type Direction='north'|'east'|'south'|'west';
export type ComponentType='solidBlock'|'redstoneDust'|'redstoneTorch'|'lever'|'button'|'repeater'|'lamp'|'piston';
type Directional={direction:Direction};
export type Component=
 | {type:'solidBlock';powered:boolean}
 | {type:'redstoneDust';signal:number}
 | ({type:'redstoneTorch';lit:boolean;signal:number}&Directional)
 | ({type:'lever';active:boolean}&Directional)
 | {type:'button';active:boolean;duration:number}
 | ({type:'repeater';delay:1|2|3|4;inputSignal:number;outputSignal:number;pending?:boolean}&Directional)
 | {type:'lamp';powered:boolean}
 | ({type:'piston';powered:boolean;extended:boolean}&Directional);
export interface Cell{x:number;y:number;baseBlock?:{type:'solid';powered:boolean};component?:Component}
export interface Board{width:number;height:number;cells:Record<string,Cell>}
export const key=(x:number,y:number)=>`${x},${y}`;
