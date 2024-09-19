"use client"

import { useAnimationFrame } from "framer-motion"
import { useRef, useState } from "react"

const ode = (h:number, flow: number, tiempo: number) => {
  const dhdt = 1/2 * (flow-Math.sqrt(h));
  h = Math.max(0, h + ( tiempo * dhdt))
  return h
}


function Component({flow}:{ flow: number}) {
  const ref = useRef<HTMLDivElement>(null)
  const [time, setTiem] = useState<number>(0);
  const [height, setHeight] = useState<number>(4);
  
  
  useAnimationFrame((time, delta) => {
    setHeight(ode(height, flow, delta / 100))
    setTiem(Math.floor(time / 1000))
  })

  return (
    <div className="h-[200px] relative">
      <div className="h-20 w-20 left-1/2 -translate-x-1/2  absolute -top-16 z-10 " >
        <div className="w-8 h-full bg-gray-500 left-1/2 -translate-x-1/2 absolute"></div>
        <div className="w-12 h-3 bottom-0 bg-gray-500 left-1/2 -translate-x-1/2 absolute"></div>
        <div className="w-20 h-8 top-0 bg-gray-500 left-1/5 -translate-x-1/2 absolute"></div>
      </div>
       <div className="h-full left-1/2 -translate-x-1/2  absolute top-0  bg-blue-600" style={{
          width: flow / 1.2
    }} />
       <div className="top-4 right-4 absolute">Segundos: {time}</div>
  <div ref={ref} className="absolute  -translate-x-1/2 bottom-0 left-1/2" >
 
    <div className="w-4 bg-black absolute -left-4 bottom-0 h-40"></div>
    <div className="w-40  bg-blue-600" style={{
      height: height
    }}>
    </div>
    <div className="w-4 bg-black absolute -right-4 bottom-0 h-40"></div>
  </div>
  </div>
  )
}


export default function Home() {
  const [flow, setFlow] = useState<number>(8)

  return (
    <div className=" flex justify-center items-center min-h-screen px-4 py-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col mb-20 row-start-2 items-center sm:items-start">
        <h1 className="text-5xl  font-bold">Exposicion de Funciones Multivariables</h1>
        <div className="max-w-[1000px] w-full mt-40  h-[200px] bg-red-400">
          <div className="h-[200px] relative">
            <Component flow={flow} />
          </div>
          <div className="border-zinc-200 flex items-center gap-2 py-2 justify-center bg-zinc-500 border-solid border">
            <div>0</div>
            <input className="bg-red-200 w-[300px]" type="range" onChange={v => {
              setFlow(Number(v.target.value) ?? 0)
            }} min={0} value={flow} max={12} step={0.2}/>
            <div>12</div>
          </div>
        </div>
      </main>
    </div>
  );
}
