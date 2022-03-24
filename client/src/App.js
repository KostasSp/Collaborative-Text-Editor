import "./App.css";
import TextEditor from "./TextEditor";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

//random reminder: add "box" after "github" to any github repository url to run it on the browser

function App() {
  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "10px",
          paddingRight: "50px",
        }}
      >
        Log in
      </div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            //create new client instance and redirect there everytime I visit localhost:3000 or homepage
            element={<Navigate to={`/documents/${uuidV4()}`} />}
          ></Route>
          <Route path="/documents/:id" element={<TextEditor />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
