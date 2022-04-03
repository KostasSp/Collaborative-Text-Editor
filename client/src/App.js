import "./App.css";
import TextEditor from "./components/TextEditor";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";

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
        {/* when user clicks one of the log buttons, then return to previous ID (keep track of ID before log 
          buttons pressed) */}
        <LoginButton />
        <LogoutButton />
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
