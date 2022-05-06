import "./App.scss";
import TextEditor from "./components/TextEditor";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import SendToEmail from "./components/SendToEmail";
import "./components/LogButtons.scss";
import "./components/SendToEmail.scss";
import EmailIcon from "@mui/icons-material/Email";
import EmailPreview from "./components/EmailPreview";

function App() {
  const roomID = localStorage.getItem("previousRoomURL");
  return (
    <div>
      <BrowserRouter>
        <div className="top-container">
          <div className="send-email-message">
            {/* remove link on click, maybe empty the element JS-style? */}
            <Link to={"/email"} state={"test"}>
              send progress to email
            </Link>
            <EmailIcon
              style={{ fontSize: "17px", color: "rgb(26, 135, 236)" }}
            />
          </div>
          <div className="Log-buttons">
            {/* add "Send Email" icon here, where user can either type email, or simply log in with google for email to be filled in automatically */}
            <LoginButton />
            <LogoutButton />
          </div>
        </div>
        <Routes>
          <Route
            path="/"
            //create new client instance and redirect there everytime I visit localhost:3000 or homepage
            element={<Navigate to={`/documents/${uuidV4()}`} />}
          ></Route>
          <Route path="/documents/:id" element={<TextEditor />}></Route>
          <Route path="/email" element={<EmailPreview />}></Route>
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
