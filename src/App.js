import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlantList from "./Components/PlantList";
import AddPlant from "./Components/AddPlant";
import PlantDetails from "./Components/PlantDetails";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PlantList />} />
          <Route path="/add-plant" element={<AddPlant />} />
          <Route path="/plant/:id" element={<PlantDetails />} />
        </Routes>
      </BrowserRouter>
      {/* test */}
    </div>
  );
}

export default App;
