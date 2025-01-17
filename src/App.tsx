import React, { useState } from "react";
import Table from "./components/Table.tsx";

const App = () => {
  return (
    <div className="App">
      <h1 className="my-4 text-2xl font-bold text-center">
        Hierarchical Table
      </h1>
      <Table />
    </div>
  );
};

export default App;
