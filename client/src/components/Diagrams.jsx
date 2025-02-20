import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

const Diagrams = () => {
  const [x, setX] = useState(10); // State to track x value
  const chartRef = useRef(null);

  // Interval to increment x value
  useEffect(() => {
    const interval = setInterval(() => {
      setX((prevX) => prevX + 1); // Increment x value every 500ms
    }, 500);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Define the chart with dynamic x value
  const chart = `
  pie showData
    title PetterTech's content
    "Windows" : 130
    "Azure" : 28
    "PowerShell" : ${x}
`;

  // Use useEffect to re-render the diagram when x changes
  useEffect(() => {
    if (chartRef.current) {
      mermaid.contentLoaded(); // Re-render the chart when x value changes
      mermaid.run(); // Re-run the mermaid rendering
    }
  }, [x]); // Run this effect every time x changes

  return (
    <div className="w-full m-8">
      <div className="mermaid" ref={chartRef}>
        {chart} {/* Dynamically render the chart with the updated x value */}
      </div>
    </div>
  );
};

export default Diagrams;

// import { useEffect, useRef, useState } from 'react';
// import mermaid from 'mermaid';

// const Diagrams = () => {
//   // const Diagrams = ({ chart }) => {
//   let x = 10;

//   const interval = setInterval(() => {
//     x++;
//   }, 500);

//   const chart = `
//   pie showData
//     title PetterTech's content
//     "Windows" : 130
//     "Azure" : 28
//     "PowerShell" : ${x}
// `;

//   const [key, setKey] = useState(0); // Force re-render key
//   const chartRef = useRef(null);

//   useEffect(() => {
//     mermaid.initialize({ startOnLoad: false });

//     if (chartRef.current) {
//       chartRef.current.innerHTML = ''; // Clear old content
//       setKey((prevKey) => prevKey + 1); // Change key to force remount
//     }
//     return () => clearInterval(interval);
//   }, [chart, x]);

//   useEffect(() => {
//     if (chartRef.current) {
//       chartRef.current.innerHTML = chart; // Inject the new chart text
//       mermaid.run(); // Re-render the graph
//     }
//   }, [key]); // Re-run when key changes

//   return (
//     <div className="w-full m-8">
//       <div className="mermaid" ref={chartRef} key={key} />;
//     </div>
//   );
// };

// export default Diagrams;
