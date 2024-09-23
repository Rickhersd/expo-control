"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Label,
  ReferenceLine,
} from "recharts";

const ode = (height: number, flow: number, flowExit: number, tiempo: number) => {
  const accelerationExit = 0.5
  const accelerationEnter = 0.042

  const dhdt = (1 / 2) * (flow * accelerationExit - flowExit * accelerationEnter * Math.sqrt(height));
  height = Math.max(0, height + tiempo * dhdt);
  return height;
};

const Plot = ({
  data,
  tiempo,
  level,
}: {
  data: { t: number; h: number }[];
  tiempo: number;
  level: number;
}) => {
  return (
    <ResponsiveContainer
      className="border-2 border-x-0 border-zinc-500"
      width="100%"
      height="100%"
    >
      <LineChart
        width={500}
        height={200}
        data={data}
        margin={{
          top: 30,
          right: 60,
          left: 20,
          bottom: 30,
        }}
      >
        <XAxis
          unit="s"
          type="number"
          dataKey="t"
          allowDataOverflow
          domain={[
            0 + Math.max(0, Math.abs(20 - Math.max(20, tiempo))),
            Math.max(20, tiempo),
          ]}
        >
          <Label
            value="Tiempo transcurrido"
            angle={0}
            offset={-18}
            position="insideBottom"
          />
        </XAxis>
        <ReferenceLine
          y={level}
          strokeWidth={2}
          stroke="blue"
          label="nivel Deseado"
        />
        <YAxis dataKey="x" domain={[0, 160]}>
          <Label
            value="Nivel del tanque"
            position="insideLeft"
            offset={10}
            angle={90}
          />
        </YAxis>
        <Line
          animationDuration={1000}
          isAnimationActive
          strokeWidth={2}
          dot={false}
          type="monotone"
          dataKey="h"
          stroke="#82ca9d"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const Component = ({
  flow,
  level,
  error,
  mode,
  overflow,
  flowExit,
  handleAutoFixFlow,
  handleAutoFixFlowExit,
  handleSetError,
  handleSetOverflow,
  errorTolerance,
}: {
  flow: number;
  flowExit: number;
  level: number;
  overflow: boolean;
  error: number;
  mode: "AUTO" | "MANUAL";
  errorTolerance: number;
  handleAutoFixFlow: (error: number) => void;
  handleAutoFixFlowExit: (error: number) => void;
  handleSetError: (error: number) => void;
  handleSetOverflow: (h: boolean) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [currentTime, setTime] = useState<number>(0);
  const [height, setHeight] = useState<number>(100);
  const [data, setData] = useState<{ t: number; h: number }[]>([]);

  useAnimationFrame((time, delta) => {
    const newHeight =
      Math.round(ode(height, flow, flowExit, delta / 100) * 1000) / 1000;
    const newTime = Math.floor(time / 1000);

    setHeight(newHeight);

    if(!overflow){
      handleSetOverflow(newHeight > 145);
    }

    if(overflow){
      handleSetOverflow(newHeight > 80);
    }

    if (currentTime < newTime) {
      const newPlot = { h: newHeight, t: newTime };
      const error = Math.round((level - newHeight) * 1000) / 1000;
      setData((prevData) => [...prevData, newPlot]);
      handleSetError(error);
    }

    setTime(Math.floor(time / 1000));
  });

  useEffect(() => {
    if (mode == "MANUAL") return;
    const fix = (-1 * error * Math.pow(errorTolerance, 2.71) / 35);
    handleAutoFixFlow(fix);
  
    if((Math.abs(error) > errorTolerance * 10) || (Math.sign(error) == -1 && flow < 1 && Math.abs(error) > errorTolerance * 10)){
      handleAutoFixFlowExit(Math.sign(error) * Math.sqrt(Math.abs(error)) / 35);
    }

  }, [error, mode, currentTime, errorTolerance]);

  return (
    <>
      <div className="h-[300px] relative">
        <div className="h-20  z-30 w-full  absolute -top-16  ">
          <div className="w-4 rounded-tr-xl -translate-x-1/2 h-full bg-gray-500 left-1/2 -translate-h-1/2 absolute">
            <div className="h-2 w-5 shadow-lg left-1/2 -translate-x-1/2 bg-gray-400 top-4 absolute" />
            <div className="h-2 w-5 shadow-lg left-1/2 -translate-x-1/2 bg-gray-400 bottom-0 absolute" />
            <div className="w-6 h-2 shadow-lg rounded-t-sm top-full bg-gray-500 left-1/2 -translate-x-1/2 absolute" />
          </div>
          
          <div className="w-1/2 h-4 -translate-x-2 top-0 bg-gray-500 absolute">
            <div className="h-5 shadow-lg w-2 top-1/2 -translate-y-1/2 bg-gray-400 right-0 absolute" />
            <div className="h-5 shadow-lg w-2 top-1/2 -translate-y-1/2 bg-gray-400 right-1/3 absolute" />
            <div className="h-5 shadow-lg w-2 top-1/2 -translate-y-1/2 bg-gray-400 left-0 absolute" />
            <div className="h-5 shadow-lg w-2 top-1/2 -translate-y-1/2 bg-gray-400 left-1/3 absolute" />
            <motion.div
              initial={{ translateX: "-50%", translateY: "50%" }}
              animate={{
                rotate: flow * 20,
              }}
              transition={{ type: "spring" }}
              className="w-3 h-3 left-1/2  -top-1/3 bg-red-300 absolute"
            >
              <div className="bg-red-900 rounded-full w-6 h-3 z-70 absolute  left-full ">
                <div className="bg-red-700 rounded-full w-4 h-4 z-70 absolute origin top-1/2 left-full -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              <div className="bg-red-900 rounded-full origin-center  w-3 h-6 z-70 absolute bottom-full">
                <div className="bg-red-700 shadow-2xl rounded-full w-4 h-4 z-70 absolute bottom-full left-1/2 -translate-x-1/2 translate-y-1/2"></div>
              </div>
              <div className="bg-red-900  rounded-full w-6 h-3 z-70 absolute right-full ">
                <div className="bg-red-700 rounded-full w-4 h-4 z-70 absolute top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              <div className="bg-red-900 rounded-full w-3 h-6 z-70 absolute top-full">
                <div className="bg-red-700 shadow-xl rounded-full w-4 h-4 z-70 absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              <div className="bg-red-700 shadow-xl rounded-full w-7 h-7 z-70 absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 ">
                <div className="bg-red-900 shadow-inner rounded-full w-4 h-4 z-70 absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 "></div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="px-2 text-sm absolute">
          <div className="top-[0.25rem] text-black ">
            Segundos: {currentTime}
          </div>
          <div className="top-[2.25rem] text-black ">
            N. Tanque: {height} cm
          </div>
          <div className="top-[4.25rem] text-black ">N. caudal: {flow} l/s</div>
          <div className="top-[6.25rem] text-black ">N. error: {error} cm</div>
        </div>
        <div
          ref={ref}
          className="absolute bg-gray-700 -translate-x-1/2 bottom-5 w-40 h-60 left-1/2"
        >
          <div
            className="h-[300px] bottom-0 z-10 left-1/2 -translate-x-1/2  absolute   bg-blue-500"
            style={{
              width: flow / 0.8,
            }}
          />
          <div className="w-2 bg-gray-500 rounded-tl-full  absolute right-full -bottom-0 h-60"></div>
          <div
            className="w-40 bottom-0 absolute  bg-blue-500"
            style={{
              height: height * 1.6,
            }}
          />
          <div
            className={clsx(
              "w-48 left-1/2 z-30 -translate-x-1/2 border-dashed border-top border-2 h-1 bottom- shadow absolute",
              {
                "border-green-600": Math.abs(error) < errorTolerance,
                "border-yellow-400":
                  Math.sign(error) == 1 && !(Math.abs(error) < errorTolerance),
                "border-red-700":
                  Math.sign(error) == -1 && !(Math.abs(error) < errorTolerance),
              }
            )}
            style={{
              bottom: level * 1.6,
            }}
          >
            <div className="bg-green-600 absolute left-0 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full" />
            <div className="bg-green-600 absolute right-0 translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full" />
            <span className="left-full  w-16 translate-x-4 -translate-y-1/2 text-zinc-800 font-bold absolute">
              Nivel Deseado {level} cm
            </span>
          </div>
          <div className="w-2 bg-gray-500 absolute rounded-br-full rounded-tr-full left-full -bottom-0 h-60" />
          <div className="w-2 h-5 bg-gray-500 absolute left-4 top-full" />
          <div className="w-2 h-5 bg-gray-500 absolute right-4 top-full" />
          {overflow && 
            <div className="absolute text-red-600 top-1/2 left-1/2 -translate-x-1/2 text-4xl  font-bold">DESBORDE</div>
          }

          <div className="w-[20vw] max-w-40 bottom-0 left-full h-4 -translate-x-0 bg-gray-500 absolute">
            {/* <div className="h-5 shadow-lg w-2 top-1/2 -translate-y-1/2 bg-gray-400 right-0 absolute" /> */}
            <div className="h-5 shadow-lg w-2 top-1/2 -translate-y-1/2 bg-gray-400 left-0 absolute" />
            <div className="absolute left-full">
              <div className="w-4 h-9 shadow-lg rounded-t-sm top-full bg-gray-500 left-1/2 -translate-x-1/2 absolute" />
              <div className="h-2 w-5 shadow-lg left-1/2 -translate-x-1/2 bg-gray-400 top-4 absolute" />
              
              {/* <div className="h-2 w-5 shadow-lg left-1/2 -translate-x-1/2 bg-gray-400 bottom-0 absolute" /> */}
            </div>
            <motion.div
              initial={{ translateX: "-50%", translateY: "50%" }}
              animate={{
                rotate: flowExit * 20,
              }}
              transition={{ type: "spring" }}
              className="w-3 h-3 left-3/4  -top-1/3 bg-red-300 absolute"
            >
              <div className="bg-red-900 rounded-full w-4 h-3 z-70 absolute  left-full ">
                <div className="bg-red-700 rounded-full w-4 h-4 z-70 absolute origin top-1/2 left-full -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              <div className="bg-red-900 rounded-full origin-center  w-3 h-4 z-70 absolute bottom-full">
                <div className="bg-red-700 shadow-2xl rounded-full w-4 h-4 z-70 absolute bottom-full left-1/2 -translate-x-1/2 translate-y-1/2"></div>
              </div>
              <div className="bg-red-900  rounded-full w-4 h-3 z-70 absolute right-full ">
                <div className="bg-red-700 rounded-full w-4 h-4 z-70 absolute top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              <div className="bg-red-900 rounded-full w-3 h-4 z-70 absolute top-full">
                <div className="bg-red-700 shadow-xl rounded-full w-4 h-4 z-70 absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              <div className="bg-red-700 shadow-xl rounded-full w-6 h-6 z-70 absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 ">
                <div className="bg-red-900 shadow-inner rounded-full w-3 h-3 z-70 absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 "></div>
              </div>
            </motion.div>
          </div>

          <div className="w-44 bg-gray-500 rounded-b-full absolute -left-2 top-full bottom-0 h-2" />
        </div>
      </div>
      <div className="bg-white h-[250px] w-full">
        <Plot data={data.slice(-21)} level={level} tiempo={currentTime} />
      </div>
    </>
  );
};

const MIN_CAUDAL = 0;
const MAX_CAUDAL = 12;

const clampFunction = (min: number, max: number, num: number) => {
  return Math.min(Math.max(num, min), max);
};

export const Home = () => {
  const [flow, setFlow] = useState<number>(6);
  const [flowExit, setFlowExit] = useState<number>(7);
  const [level, setLevel] = useState<number>(20);
  const [errorTolerance, setErrorTolerance] = useState<number>(1);
  const [overflow, setOverflow] = useState<boolean>(false);
  const [mode, setMode] = useState<"AUTO" | "MANUAL">("MANUAL");
  const [error, setError] = useState<number>(0);

  const handleAutoFixFlow = (error: number) => {
    setFlow((prevError) =>
      clampFunction(
        MIN_CAUDAL,
        MAX_CAUDAL,
        Math.round((prevError - error) * 1000) / 1000
      )
    );
  };

  const handleAutoFixFlowExit = (error: number) => {
    setFlowExit((prevError) =>
      clampFunction(
        MIN_CAUDAL,
        MAX_CAUDAL,
        Math.round((prevError - error) * 1000) / 1000
      )
    );
  };

  const handleSetOverflow = (newOverflow: boolean) => {
    setOverflow(newOverflow);
    if (!overflow && newOverflow){
      setFlow(0);
      setFlowExit(3);
      setMode("MANUAL");
    }
    if (overflow && !newOverflow){
      setFlow(6);
      setFlowExit(7);
    }
  };

  const handleSetError = (error: number) => {
    setError(error);
  };

  return (
    <div className=" flex justify-center items-center min-h-screen  gap-16  font-[family-t:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <div className="px-4 py-8 text-zinc-800">
          <h1 className="text-4xl font-bold">Simulador de Sistema de Nivelacion</h1>
        </div>
        <div className="max-w-[1000px] w-full mt-20">
          <div className="h-[550px] relative">
            <Component
              handleSetOverflow={handleSetOverflow}
              level={level}
              flow={flow}
              overflow={overflow}
              flowExit={flowExit}
              error={error}
              errorTolerance={errorTolerance}
              mode={mode}
              handleAutoFixFlow={handleAutoFixFlow}
              handleAutoFixFlowExit={handleAutoFixFlowExit}
              handleSetError={handleSetError}
            />
          </div>
          <div className="flex flex-col gap-2 px-6 py-4 justify-center bg-zinc-700 ">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={clsx(
                    "w-6 h-6 rounded-full border-2 border-gray-500 shadow-black/50 shadow-inner",
                    {
                      "bg-green-400":
                        Math.abs(error) < errorTolerance && !overflow,
                      "bg-yellow-400":
                        Math.sign(error) == 1 &&
                        !(Math.abs(error) < errorTolerance) &&
                        !overflow,
                      "bg-red-400":
                        (Math.sign(error) == -1 &&
                          !(Math.abs(error) < errorTolerance)) ||
                        overflow,
                    }
                  )}
                />
                <div className="font-mono bg-black text-xs text-nowrap rounded-md px-2 w-32 py-1">
                  {overflow ? (
                    <span>Desborde</span>
                  ) : (
                    <span>
                      {Math.abs(error) < errorTolerance && "Nivelado"}
                      {Math.sign(error) == 1 &&
                        !(Math.abs(error) < errorTolerance) &&
                        "Falta de Agua"}
                      {Math.sign(error) == -1 &&
                        !(Math.abs(error) < errorTolerance) &&
                        "Exceso de Agua"}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-fit flex">
                <button
                  disabled={overflow}
                  onClick={() => setMode("AUTO")}
                  className={clsx(
                    "rounded-sm w-20 flex items-center justify-center px-2 py-1 rounded-l-xl font-bold",
                    mode == "AUTO"
                      ? "bg-green-700 shadow-black/50   shadow-inner text-yellow-400"
                      : "bg-green-600 shadow text-yellow-300"
                  )}
                >
                  Auto
                </button>
                <button
                  disabled={overflow}
                  onClick={() => setMode("MANUAL")}
                  className={clsx(
                    "px-2 w-20 py-1 flex items-center justify-center rounded-r-xl font-bold",
                    mode == "MANUAL"
                      ? "bg-green-700 shadow-black/50  shadow-inner  text-yellow-400 "
                      : "bg-green-600 shadow text-yellow-300"
                  )}
                >
                  Manual
                </button>
              </div>
            </div>
            <div className="mt-2">
              <div className="font-bold">Nivel de agua Deseado</div>
              <div className="flex w-full items-center gap-2">
                <div className="w-20">0cm</div>
                <input
                  className="bg-red-200 w-full"
                  type="range"
                  onChange={(v) => {
                    setLevel(Number(v.target.value) ?? 0);
                  }}
                  min={0}
                  value={level}
                  max={135}
                  step={0.1}
                />
                <div className="w-20">135cm</div>
                <div className="bg-black font-mono w-32 rounded-md px-2 py-1">
                  {level}
                </div>
              </div>
            </div>
            <div>
              <div className="font-bold">Nivel del caudal</div>
              <div className="flex w-full items-center gap-2">
                <div className="w-20">0 l/s</div>
                <input
                  disabled={mode == "AUTO" || overflow}
                  className="bg-red-200 w-full"
                  type="range"
                  onChange={(v) => {
                    setFlow(Number(v.target.value) ?? 0);
                  }}
                  min={MIN_CAUDAL}
                  value={flow}
                  max={MAX_CAUDAL}
                  step={0.1}
                />
                <div className="w-20">12 l/s</div>
                <div className="bg-black px-2 w-32 font-mono rounded-md py-1">
                  {flow}
                </div>
              </div>
            </div>
            <div>
              <div className="font-bold">Nivel de salida</div>
              <div className="flex w-full items-center gap-2">
                <div className="w-20">1</div>
                <input
                  className="bg-red-200 w-full"
                  type="range"
                  disabled={overflow}
                  onChange={(v) => {
                    setFlowExit(Number(v.target.value) ?? 0);
                  }}
                  min={MIN_CAUDAL}
                  value={flowExit}
                  max={MAX_CAUDAL}
                  step={0.1}
                />
                <div className="w-20">12</div>
                <div className="bg-black px-2 w-32 font-mono rounded-md py-1">
                  {flowExit}
                </div>
              </div>
            </div>
            <div>
              <div className="font-bold">Tolerancia al error</div>
              <div className="flex w-full items-center gap-2">
                <div className="w-20">0.5</div>
                <input
                  className="bg-red-200 w-full"
                  type="range"
                  onChange={(v) => {
                    setErrorTolerance(Number(v.target.value) ?? 0);
                  }}
                  min={0.5}
                  value={errorTolerance}
                  max={2}
                  step={0.1}
                />
                <div className="w-20">2</div>
                <div className="bg-black px-2 w-32 font-mono rounded-md py-1">
                  {errorTolerance}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
