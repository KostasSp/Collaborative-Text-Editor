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
            <LoginButton />
            <LogoutButton />
          </div>
        </div>
        <Routes>
          <Route
            path="/"
            //creates new client instance and redirects there everytime user visits homepage
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
