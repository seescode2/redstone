import{expect,it}from'vitest';import{emptyBoard,makeComponent}from'../engine/Engine';import{lessons}from'./lessons';import{allLampsPowered,componentExists,maxComponentCount}from'./validators';
it('evaluates reusable lesson conditions',()=>{const b=emptyBoard();b.cells['1,1']={x:1,y:1,component:{...makeComponent('lamp'),powered:true}} as never;expect(allLampsPowered(b).passed).toBe(true);expect(componentExists('lamp')(b).passed).toBe(true);expect(maxComponentCount('repeater',0)(b).passed).toBe(true)});

it('provides thirty lessons with example solutions',()=>{expect(lessons).toHaveLength(30);expect(lessons.every(l=>Object.keys(l.solution.cells).length>0)).toBe(true)});
