# Simulador de Sistema de Nivelaxcion

El proyecto que se presenta a continuacion es un sistema de control aplicado a un tanque de agua en donde se busca controlar el nivel del agua del tanque. Es una app desarrollada en React, que permite regular los niveles de entrada y de salida de un tanque de agua, asi como activar un modo de auto regulacion en donde el mismo tanque busca ajustarse para hallar el equilibrio.

El equilibro consiste en que la misma cantidad de agua que sale, es la misma que la entra, impidiendo que el agua suba o baje.

## Funcioamiento del tanque

El tanque basicamente toma el nivel actual de tanque y cuanta agua deberia entrar y deberia salir para ir calcular la diferencia en funcion del tiempo. Es decir. 

Si pasan 2 segundos, la formula responde cuanto tiene de mas o tiene menos el tanque en esos dos segundos.

Para ello, una ecuacion que calcula esto es la siguiente

![Alt text](./img/Screenshot%202024-09-23%20at%203.10.49 PM.png)

k1a1 es la cantidad de agua que entra por la aceleracion del agua de entrada.

k22a2 es la cantidad de agua que sale por la aceleracion del agua de salida

Raiz de 2gh es la cantidad de raiz cuadrada del nivel del tanque por la gravedad.

La formula anterior resta lo que entra con lo que sale, dando una diferencia, pero la cantidad de agua que sale va en funcion de la altura. Es decir, mientras que la cantidad de agua que entra es constante, el agua que sale aunque podria ser un valor fijo se vera afectada por la altura.

A mayor cantidad de agua, aumenta ligeramente la cantidad de agua que sale.

Esta ecuacion diferencial esta representada en el codigo de la siguiente forma. Unicamente no se esta considerando la 2 * gravedad en la version actual para regular el comportamient o la velocidad del tanque.

```typescript

const ode = (height: number, flow: number, flowExit: number, tiempo: number) => {
    const accelerationExit = 0.5
    const accelerationEnter = 0.042

    const dhdt = (1 / 2) * (flow * accelerationExit - flowExit * accelerationEnter * Math.sqrt(height));
    height = Math.max(0, height + tiempo * dhdt);
    return height;
};

```


## Herramientas de desarrollo

El proyecto usa React y Next js, y esta desplegado en Vercel.

- **React**: Es un framework/libreria que se utiliza para la creacion de interfaces graficas en la web. Esta libreria permite crear aplicaciones y reutilizar codigo de una forma mas sencilla antes que usar lo que se conoce como Vanilla Javascript (Programacion en Javascript sin herramientas)

- **Next JS**: Es un framework de React que se utiliza para solucionar muchos problemas de React respecto al SEO de paginas web. Ademas de eso, agrega muchas modulos nuevos que facilitan la creacion de paginas interactivas. Cabe recalcar que aunque el proyecto use Next JS, el hecho de usar esta herramienta fue unicamente para poder generar la plantilla del proyecto y subirla rapidamente a Vercel.

-  **Vercel**: Es un servicio de alojamiento en internent el cual permite subir paginas de forma rapida y gratuita cuando los proyectos estan en desarrollo. Ademas de eso, tambien los desarrolladores de multiples herramientas de desarrollo como NextJs, Turbopack y el design system de geist.

Ademas de las herramientas mencionadas anteriormente, para facilitar el desarrollo del proyecto y no reinventar la rueda, se usaron tres librerias propias de React para poder correr el proyecto, typescript y un framework de css.. 


- **Tailwind**: es un framework par estilizar rapido. Para los que tengan conocimientos en css, si quieres ponerle a un div los bordes redondos, un ancho y alto de 20 px y un color rojo se haria asi

```html
    <div class="my-div">

    <style>
        .my-div{
            background-color: red;
            width: 20px;
            height: 20px;
            border-radius: 12px;
        }
    </style>

```

en react con tailwind seria asi:


```jsx
    <div className="bg-red-200 w-5 h-5 rounded-xl" />
```

En lugar de declarar una clase con estilos, habran mil clases ya hechas ( con el tiempo se aprenden ) que representan estilos de css. Por ejmplo, el w-5, signigica width de 20 px. w-6 significa 24px, w-7 son 28px y w-8 son 32px.

Esto facilita mucho el trabajo. 

En el caso de las llaves de paso, se puede ver como se usa unicamte tailwind para estilizarlas y posicionarlas:


``` tsx

// el motion div es de otra libreria que se explicara a continuacion
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
```

- **Typescript**: Es el mismo javscript, pero con nuevas funcionalidades relacionadas al tipado de datos. Por ejemplo, si tienes una variable declara como un number, luego no podras guardar dentro de ella un string. Esto es una practica que siempre se deberia de realizar y por la cual nunca me ha terminado de gustar python xd.

```typescript

// En la funcion diferencial, cada parametro esta tipado. solo pueden ingresar numeros
const ode = (height: number, flow: number, flowExit: number, tiempo: number) => {
    const accelerationExit = 0.5
    const accelerationEnter = 0.042

    const dhdt = (1 / 2) * (flow * accelerationExit - flowExit * accelerationEnter * Math.sqrt(height));
    height = Math.max(0, height + tiempo * dhdt);
    return height;
};



```



- **Framer motion**: Es una libreria de React para el manejo de animaciones, con esta se programo la animacion de llaves de paso, y ademas, se utilizo una funcion especial de esta libreria para calcular la ecuacion diferencial de la altura del tanque.  [Framer Motion](https://www.framer.com/motion/). En la documentacion oficial hay muchos ejemplos interactivos de como usarla, pero de igual forma, a continuacion se explica en donde se hace el calculo de la ecuacion diferencial.

```tsx

// Ecuacion diferencial.
const ode = (height: number, flow: number, flowExit: number, tiempo: number) => {
    const accelerationExit = 0.5
    const accelerationEnter = 0.042

    const dhdt = (1 / 2) * (flow * accelerationExit - flowExit * accelerationEnter * Math.sqrt(height));
    height = Math.max(0, h + tiempo * dhdt);
    return height;
};

// Este framegmento de codigo usa una funcion de framer motion llamada useAnimationFrame. Esta funcion de Framer Motion usa una api interna que tienen los navegadores que permiten ejecutar codigo en cada frame o renderizado. Si una pantalla se renderiza 30-60 veces por segundo, esta funcion calcula la altura unas 30 0 60 veces por segundo.  

// el Time es el tiempo que ha ocurrido desde que se inica e ejecutar la funcion
// el delta es la diferencia expresada en milisegundos de cuando fue la ultima vez que se ejecuto la funcion. Si un frame se ejecuto en el milisegundo 1000 y el siguiente en el 1030. el delta es 30.

useAnimationFrame((time, delta) => {
    
    // Se aplica la ecuacion diferencial. 
    // - Se le pasa la altura actual del tanque. 
    // - El nivel de salida del agua en el caudal inferioir flowExit.
    // - El nivel de entrada del aguae en el caudal superior.
    // - El delta es el tiempo. Se ajusto entre 100, porque al ser milisegundos, tener 1 segundo representado como 1000 afecta considerablemente a la velocidad del tanque.
    // El Math.round( resultdo * round ) / 1000 es para solo mostrar los tres ultimos decimales de la altura. Esto se repite en varias partes para ajustar los montos decimales.
    const newHeight =
      Math.round(ode(height, flow, flowExit, delta / 100) * 1000) / 1000;
    const newTime = Math.floor(time / 1000);

    // Luego de calcualar la nueva altura, se le dice al sistema que esta es la nueva altura
    setHeight(newHeight);

     // Esto verifica si existe Desborde. Si no hay Desborde, se verifica si el agua es mayor a 145 centimetros. Si lo sobrepasa, se activa el desborde
    if(!overflow){
      handleSetOverflow(newHeight > 145);
    }

    // Caso contrario, esto verifica si existe Desborde. Si existe Desborde, se verifica si el agua es mayor a 80 centimentros, caso contrario se desactiva el modo de desborde. Ocurre que en el modo de desborde, el tanque se vacia lentamente, es por ello que pasado unos segundod, el bajara por debajo de 80 para desactivar esta medida preventiva.
    if(overflow){
      handleSetOverflow(newHeight > 80);
    }

    // Esto cacula el error y la grafica, el currentTime es el tiempo que ha pasado actualmente en segundos. Y el newTime, es el nuevo tiempo en un nuevo frame. Si han pasado 40 segundos y actualmente son 41, esto se calcula. 

    if (currentTime < newTime) {
        // En la grafica se necesita un arreglo de pares como si fueran de un plano cartesiano. h seria Y y t seria X. A medida que pasa el tiempo, la grafica va redibujando la grafica con los nuevos pares.
      const newPlot = { h: newHeight, t: newTime };

      //Esto calcula el error, es unicamente el nivel deseado - la nueva altura. Si tu quieres que el nivel sea 90 y esta en 20 el nivel. El error es de 70. 
      // Nuevamente el math around es para reondear. Si el monto es 3.1351231, daria 3.135
      const error = Math.round((level - newHeight) * 1000) / 1000;
      /// se agregan los datos anterioir y se agrega el nuevo.
      setData((prevData) => [...prevData, newPlot]);
      handleSetError(error);
    }

    // Se establece el tiempo. Se divide entre mil para convertirlo a segundso y el floor es para no mostrar decimales.
    setTime(Math.floor(time / 1000));
  });
```

Asimismo, framer motion tambien esta en el giro de las llaves de paso. Esta libreria tiene una componente motion, que usando puntos. pueden renderizar cualquier componente de react. En este caso es un div. Y con ciertas propiedades se puede manipular el componente

```tsx

<motion.div
    initial={{ translateX: "-50%", translateY: "50%" }}

    // Aqui se anima
    animate={{
        rotate: flow * 20,
    }}

    // Este es el tipo de animacion. Es para que vaya fluida,
    transition={{ type: "spring" }}
    className="w-3 h-3 left-3/4  -top-1/3 bg-red-300 absolute"
    >

    {/* resto de la perilla Perilla */}
</motion.div>


```

- **Recharts**: Es una libreria de React para construir graficos, con esta se programo la grafica que muestra el nivel del tanque. [Recharts](https://recharts.org/en-US/)

En el codigo, seria esta parte: 

```tsx

// se importan los componentes de reacharts. Cada uno de estos cumple una funcionalidad dentro del grafico.
import {
  LineChart, // Este es el grafico en si, la base
  Line, // Esta es la linea que muestra el nivel de la altura. Se dibuja en base a los datos que uno le pasa
  XAxis, // Este es el eje X que muestra el tiempo en segundos
  YAxis, // Este es el eje y Que muestra el la altura
  ResponsiveContainer, // Este componente es una utilidad de la libreria que permite que el grafia se vea bien en telefonos y escritorios
  Label, // Estos son las labels.
  ReferenceLine, // Esta es la linea que muestra el nivel deseado
} from "recharts";

// Asi se renderiza el componente:
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
        {/* Esta parte de domain es el tiempo, como el grafico solo muestra intervalos de 20 segundos, se debe cambiar el dominio costantemente para que no se muestre el grafico del segundo 0 al segundo 400. Si llega a 20, le siguiente dominio es [1, 21], luego [2, 22], luego [3, 23] y asi, para no romper el grafico  */}
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
```

- **clsx**: Esta es una libreria pequeña que se puede econtrar en varias parte de la app. No es una libreria en si, es solo una funcion que me gusta estilizar. 

``` tsx

// Se usa en partes asi, para mostrar los colores de la luz del tablero de control.
     <div
        className={clsx(
            // Aqui le paso estilos directos que siempre se aplican
        "w-6 h-6 rounded-full border-2 border-gray-500 shadow-black/50 shadow-inner",
        
        // Aqui lo hago con un objeto, es como un dict en python de key: value. En el value hay una condicion, si es True se renderiza el estilo que es la Key.
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


``` 


## fuentes de informacion

En los siguientes videos encontre la informacion en la cual me base para desarrollar el simulardor. En el primer video, hay un ejemplo como crear el simulador utilizando matlab. Entonces de aqui me base para escribirlo en Typescript en la primera version del simulador.

#### Simulación interactiva de un tanque de líquido: detalle código classdef Matlab

[![Alt text](./img/Screenshot%202024-09-23%20at%203.00.46 PM.png)](https://www.youtube.com/watch?v=_jxcedJ5C2Y?si=YZVT1ckVLmXBN1QDD)

Sin embargo, el tanque solo tenia el caudal superior. Es por ello que usando el siguiente video, tome una formula un poco mas desarrollada que considera el otro caudal y adapte el primer tanque para que tuvera el segundo caudal.


####  1.1 😎 Modelado Lineal de un TANQUE DE NIVEL 🚿 [Parte 1]

[![Alt text](./img/Screenshot%202024-09-23%20at%203.02.23 PM.png)](https://www.youtube.com/watch?v=_jxcedJ5C2Y?si=YZVT1ckVLmXBN1QDD)

Tras implementar el segundo caudal, vinieron los problemas del desborde o de como autonivelar si se cerraba en su totalidad el tanque.