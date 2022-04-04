import "./App.css";
import TextEditor from "./components/TextEditor";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import SendToEmail from "./components/SendToEmail";
import "./components/LogButtons.scss";
import "./components/SendToEmail.scss";
import EmailIcon from "@mui/icons-material/Email";

//random reminder: add "box" after "github" to any github repository url to run it on the browser

function App() {
  const roomID = localStorage.getItem("previousRoomURL");
  return (
    <div>
      <div className="top-container">
        <div className="send-email">
          <SendToEmail />
          <EmailIcon />
        </div>
        <div className="Log-buttons">
          {/* add "Send Email" icon here, where user can either type email, or simply log in with google for email to be filled in automatically */}
          <LoginButton />
          <LogoutButton />
        </div>
      </div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            //create new client instance and redirect there everytime I visit localhost:3000 or homepage
            element={<Navigate to={`/documents/${uuidV4()}`} />}
          ></Route>
          <Route path="/documents/:id" element={<TextEditor />}></Route>
          <Route
            path="/CallbackComponent"
            element={<Navigate to={`/documents/${roomID}`} />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
