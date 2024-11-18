'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import useWebSocket from 'react-use-websocket';

import React from 'react';

export function clamp(input: number, min: number, max: number): number {
  return input < min ? min : input > max ? max : input;
}

export function map(
  current: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number,
): number {
  const mapped: number =
    ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  return clamp(mapped, out_min, out_max);
}

export const Component = ({
  flow,
  height,
  desiredLevel,
  overflow,
  history,
  flowExit,
  error,
  errorTolerance,
}: {
  flow: number;
  desiredLevel: number;
  flowExit: number;
  level: number;
  height: number;
  history: ResultType[];
  overflow: boolean;
  error: number;
  errorTolerance: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    divRef.current?.scrollTo(0, divRef.current?.scrollHeight);
  }, [history]);

  console.log(desiredLevel)

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
              initial={{ translateX: '-50%', translateY: '50%' }}
              animate={{
                rotate: flow * 20,
              }}
              transition={{ type: 'spring' }}
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
            {/* Segundos: {currentTime} */}
          </div>
          <div className="top-[2.25rem] text-black ">
            N. Tanque: {map(height, 0, 100, 2, 22)} cm
          </div>
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
          <motion.div
            className="w-40 bottom-0 absolute  bg-blue-500"
            transition={{ type: 'spring', bounce: 0.25, duration: 10000 }}
            animate={{
              height: `${map(height, 7, 22, 5, 80)}%`,
            }}
          />
          <div
            className={clsx(
              'w-48 left-1/2 z-30 -translate-x-1/2 border-dashed border-top border-2 h-1 bottom- shadow absolute',
              {
                'border-green-600': Math.abs(error) < errorTolerance,
                'border-yellow-400':
                  Math.sign(error) == 1 && !(Math.abs(error) < errorTolerance),
                'border-red-700':
                  Math.sign(error) == -1 && !(Math.abs(error) < errorTolerance),
              },
            )}
            style={{
              bottom: `${map(desiredLevel, 7, 22, 5, 80)}%`,
            }}
          >
            <div className="bg-green-600 absolute left-0 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full" />
            <div className="bg-green-600 absolute right-0 translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full" />
            <span className="left-full  w-16 translate-x-4 -translate-y-1/2 text-zinc-800 font-bold absolute">
              Nivel Deseado {map( Math.round(desiredLevel * 100) / 100, 7, 22, 2, 22)} cm
            </span>
          </div>
          <div className="w-2 bg-gray-500 absolute rounded-br-full rounded-tr-full left-full -bottom-0 h-60" />
          <div className="w-2 h-5 bg-gray-500 absolute left-4 top-full" />
          <div className="w-2 h-5 bg-gray-500 absolute right-4 top-full" />
          {overflow && 
            <motion.div
              initial={{
                translateX: '-50%',
              }}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                ease: 'easeIn',
                times: [0, 0.5, 1],
                repeat: Infinity,
              }}
              className="absolute z-10 text-red-600 top-1/2 left-1/2 -translate-x-1/2 text-4xl  font-black"
            >
              DESBORDE
            </motion.div>
          }

          <div className="w-[20vw] max-w-40 bottom-0 left-full h-4 -translate-x-0 bg-gray-500 absolute">
            <div className="h-5 shadow-lg w-2 top-1/2 -translate-y-1/2 bg-gray-400 left-0 absolute" />
            <div className="absolute left-full">
              <div className="w-4 h-9 shadow-lg rounded-t-sm top-full bg-gray-500 left-1/2 -translate-x-1/2 absolute" />
              <div className="h-2 w-5 shadow-lg left-1/2 -translate-x-1/2 bg-gray-400 top-4 absolute" />
            </div>
            <motion.div
              initial={{ translateX: '-50%', translateY: '50%' }}
              animate={{
                rotate: flowExit * 20,
              }}
              transition={{ type: 'spring' }}
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
      <div
        ref={divRef}
        className="bg-white border-2 divide-y flex flex-col overflow-scroll h-[250px] w-full"
      >
        {history.slice(-20).map((v, i) => (
          <div
            className=" px-2 py-1 text-black grid grid-cols-[30px_1fr] gap-4"
            key={i}
          >
            <div>Log:</div>
            <div>
              Distancia: {v.distancia} cm
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const webSocketUrl = 'wss://sockets.zloteria.com/universidad/send';

type ResultType = {
  desborde: number;
  distancia: number;
  flowInCount: number;
  flowOutCount: number;
  niveldeseado: number;
  porcentaje: number;
};

export const Home = () => {
  const [flow] = useState<number>(6);
  const [flowExit] = useState<number>(7);
  const [level] = useState<number>(20);
  const [desiredLevel, setDesiredLevel] = useState(12);
  const [overflow, setOverflow] = useState<boolean>(false);
  const [height, setHeight] = useState<number>(100);
  const [socketHeight, setSocketHeight] = useState<number>(100);

  const didUnmount = useRef(false);

  const { sendJsonMessage, lastMessage } = useWebSocket(webSocketUrl, {
    shouldReconnect: () => {
      return didUnmount.current === false;
    },
    reconnectAttempts: 5,
    reconnectInterval: 3000,
  });
  const [messageHistory, setMessageHistory] = useState<ResultType[]>([]);

  useEffect(() => {
    return () => {
      didUnmount.current = true;
    };
  }, []);

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const newResult = JSON.parse(lastMessage.data) as {
          desborde: number;
          distancia: number;
          flowInCount: number;
          flowOutCount: number;
          niveldeseado: number;
          porcentaje: number;
        };

        if (newResult.distancia) {
          map(33 - 26, 7, 26, 0, 100);
          const currentHeight = 29 - newResult.distancia;
          setHeight(currentHeight);
        }

        console.log(socketHeight)
        if (newResult.niveldeseado != 29 - newResult.niveldeseado) {
          
          const desiredHeight = 29 - newResult.niveldeseado;
          setSocketHeight(desiredHeight);
        }

        if (typeof newResult.desborde != 'undefined') {
          setOverflow(Boolean(newResult.desborde));
        }

        setMessageHistory((prev) => prev.concat({
         ...newResult,
         distancia: map(Math.round((29 - newResult.distancia) * 100) / 100, 7, 22, 2, 22)
        }));
      } catch (e) {
        console.error(e);
      }
    }
  }, [lastMessage]);

  const handleSendLevel = () => {
    sendJsonMessage({
      nivelDeseado: desiredLevel,
    });
  };

  const errorTolerance = 0.5;
  const mappedDesiredLevel = map(desiredLevel, 0, 100, 7, 22);
  const error = mappedDesiredLevel - height;

  return (
    <div className=" flex justify-center items-center min-h-screen  gap-16  font-[family-t:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <div className="px-4 py-8 mx-auto text-zinc-800">
          <h1 className="text-3xl mx-auto items-center justify-cente font-bold flex flex-col text-center">
            <span>Simulador de Nivelación Automática</span>
            <span> de un Tanque de Agua</span>
          </h1>
        </div>
        <div className="max-w-[1000px] w-full mt-20">
          <div className="h-[550px] relative">
            <Component
              level={level}
              flow={flow}
              error={error}
              errorTolerance={errorTolerance}
              desiredLevel={socketHeight}
              height={height}
              history={messageHistory}
              overflow={overflow}
              flowExit={flowExit}
            />
          </div>
          <div className="flex flex-col gap-2 px-6 py-4 justify-center bg-zinc-700 ">
            <div className="flex items-start flex-col justify-between">
              <div className="flex items-start gap-2">
                <div
                  className={clsx(
                    'w-6 h-6 rounded-full border-2 border-gray-500 shadow-black/50 shadow-inner',
                    {
                      'bg-green-400':
                        Math.abs(error) < errorTolerance && !overflow,
                      'bg-yellow-400':
                        Math.sign(error) == 1 &&
                        Math.abs(error) > errorTolerance &&
                        !overflow,
                      'bg-red-400':
                        (Math.sign(error) == -1 &&
                          Math.abs(error) > errorTolerance) ||
                        overflow,
                    },
                  )}
                />
                <div className="font-mono bg-black text-xs text-nowrap rounded-md px-2 w-32 py-1">
                  {overflow ? (
                    <span>Desborde</span>
                  ) : (
                    <span>
                      {Math.abs(error) < errorTolerance && 'Nivelado'}
                      {Math.sign(error) == 1 &&
                        Math.abs(error) > errorTolerance &&
                        'Falta de Agua'}
                      {Math.sign(error) == -1 &&
                        Math.abs(error) > errorTolerance &&
                        'Exceso de Agua'}
                    </span>
                  )}
                </div>
                <div className="ml-8">Nivel configurado:</div>
                <div className="font-mono bg-black text-xs text-nowrap rounded-md px-2 w-32 py-1">
                  {map(socketHeight, 0, 100, 2, 22) + " cm"}
                </div>
              </div>
              <div className="grid grid-cols-[1fr_8rem] gap-4">
                <div className="mt-2 w-full">
                  <div className="font-bold">Nivel de agua Deseado</div>
                  <div className="flex w-full items-center gap-2">
                    <div className="w-20">2cm</div>
                    <input
                      className="bg-red-200 w-full"
                      type="range"
                      onChange={(v) => {
                        setDesiredLevel(Number(v.target.value) ?? 0);
                      }}
                      min={0}
                      value={desiredLevel}
                      max={100}
                    />
                    <div className="w-20">22cm</div>
                    <div className="bg-black font-mono w-32 rounded-md px-2 py-1">
                      {desiredLevel} %
                    </div>
                  </div>
                </div>
                <div className="w-full flex">
                  <button
                    onClick={() => handleSendLevel()}
                    className={clsx(
                      'px-2 w-full h-fit mt-auto py-1 whitespace-nowrap flex items-center justify-center rounded-md font-bold',
                      'bg-red-600 shadow-black/50   text-yellow-400 ',
                    )}
                  >
                    Enviar Nivel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
