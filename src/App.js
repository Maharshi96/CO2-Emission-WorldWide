
import './App.css';
import MapChart from "./Components/Map";
import React, { useState } from "react";
import MapToolTip from "./Components/MapToolTip";

function App() {

  const [tooltipContent, setTooltipContent] = useState({
    name: "",
    co2: ""
  });

  return (
      <div className = "App">
        <header className = "App-header">
          <MapChart setTooltipContent = { setTooltipContent }/>
          {tooltipContent && <MapToolTip tooltipContent = { tooltipContent }/> }
        </header>
      </div>
  );
}

export default App;
