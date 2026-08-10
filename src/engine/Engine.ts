import {key,type Board,type Cell,type Component,type Direction} from '../models/types';
import {directions,getNeighborCoordinate,oppositeDirection} from '../utils/direction';
export interface ScheduledEvent{executeAtTick:number;cellId:string;eventType:'buttonOff'|'repeater';value:boolean}
export const clampSignal=(n:number)=>Math.max(0,Math.min(15,Math.round(n)));
export const strongestSignal=(inputs:number[])=>clampSignal(Math.max(0,...inputs));
export class Engine{
 board:Board; tickNumber=0; scheduled:ScheduledEvent[]=[]; recalculations=0; unstable=false;
 constructor(board:Board){this.board=structuredClone(board);this.settle()}
 private cell(x:number,y:number){return this.board.cells[key(x,y)]}
 private acceptsFrom(c:Component,from:Direction){return c.type!=='repeater'||oppositeDirection(c.direction)===from}
 private output(c:Component,toward:Direction){
  if(c.type==='lever'||c.type==='button')return c.active?15:0;
  if(c.type==='redstoneTorch')return c.signal;
  if(c.type==='redstoneDust')return Math.max(c.signal-1,0);
  if(c.type==='repeater')return c.direction===toward?c.outputSignal:0;
  if(c.type==='solidBlock')return c.powered?15:0;
  return 0;
 }
 private inputs(cell:Cell){return directions.map(d=>{const p=getNeighborCoordinate(cell.x,cell.y,d),n=this.cell(p.x,p.y)?.component;return n&&this.acceptsFrom(cell.component!,d)?this.output(n,oppositeDirection(d)):0})}
 private calculate(cell:Cell):Component{
  const c=cell.component!, inputs=this.inputs(cell), max=strongestSignal(inputs);
  switch(c.type){
   case'redstoneDust':return {...c,signal:max};
   case'lamp':return {...c,powered:max>0};
   case'piston':return {...c,powered:max>0,extended:max>0};
   case'solidBlock':return {...c,powered:max>0};
   case'redstoneTorch':{const p=getNeighborCoordinate(cell.x,cell.y,oppositeDirection(c.direction));const support=this.cell(p.x,p.y)?.component;const input=support?this.output(support,c.direction):0;return {...c,lit:input===0,signal:input===0?15:0}}
   case'repeater':{const input=max, target=input>0;if((c.outputSignal>0)!==target&&!c.pending){this.scheduled.push({executeAtTick:this.tickNumber+c.delay,cellId:key(cell.x,cell.y),eventType:'repeater',value:target});return {...c,inputSignal:input,pending:true}}return {...c,inputSignal:input}}
   default:return c;
  }
 }
 settle(){this.unstable=false;for(let pass=0;pass<100;pass++){let changed=false;for(const cell of Object.values(this.board.cells)){if(!cell.component)continue;const next=this.calculate(cell);if(JSON.stringify(next)!==JSON.stringify(cell.component)){cell.component=next;changed=true;this.recalculations++}}if(!changed)return}this.unstable=true}
 tick(){this.tickNumber++;const due=this.scheduled.filter(e=>e.executeAtTick<=this.tickNumber);this.scheduled=this.scheduled.filter(e=>e.executeAtTick>this.tickNumber);for(const e of due){const c=this.board.cells[e.cellId]?.component;if(e.eventType==='buttonOff'&&c?.type==='button')c.active=false;if(e.eventType==='repeater'&&c?.type==='repeater'){c.outputSignal=e.value?15:0;c.pending=false}}this.settle()}
 interact(x:number,y:number){const c=this.cell(x,y)?.component;if(c?.type==='lever')c.active=!c.active;if(c?.type==='button'){c.active=true;this.scheduled=this.scheduled.filter(e=>!(e.cellId===key(x,y)&&e.eventType==='buttonOff'));this.scheduled.push({executeAtTick:this.tickNumber+c.duration,cellId:key(x,y),eventType:'buttonOff',value:false})}this.settle()}
}
export const emptyBoard=(width=20,height=12):Board=>({width,height,cells:{}});
export const makeComponent=(type:import('../models/types').ComponentType):Component=>({solidBlock:{type:'solidBlock',powered:false},redstoneDust:{type:'redstoneDust',signal:0},redstoneTorch:{type:'redstoneTorch',direction:'east',lit:true,signal:15},lever:{type:'lever',direction:'east',active:false},button:{type:'button',active:false,duration:3},repeater:{type:'repeater',direction:'east',delay:1,inputSignal:0,outputSignal:0},lamp:{type:'lamp',powered:false},piston:{type:'piston',direction:'east',powered:false,extended:false}}[type] as Component);
