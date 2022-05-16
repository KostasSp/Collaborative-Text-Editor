import "./App.scss";
import TextEditor from "./components/text-editor/TextEditor";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import LoginButton from "./components/log-buttons/LoginButton";
import LogoutButton from "./components/log-buttons/LogoutButton";
import "./components/log-buttons/LogButtons.scss";
import "./components/send-email/SendToEmail.scss";
import EmailIcon from "@mui/icons-material/Email";
import EmailPreview from "./components/email-preview/EmailPreview";

function App() {
  const roomID = localStorage.getItem("previousRoomURL");
  return (
    <div>
      <BrowserRouter>
        <div className="top-container">
          <div className="send-email-link">
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
            element={<Navigate to={`/documents/${uuid()}`} />}
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
