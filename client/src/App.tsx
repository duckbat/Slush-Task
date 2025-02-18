import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Posts } from "./pages/Post";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Upload } from "./pages/Upload";
import { SinglePost } from "./pages/Single";
import { ErrorPage } from "./pages/Error";
import { EditPost } from "./pages/Edit";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/post/:id" element={<SinglePost />} />
        <Route path="/post/edit/:id" element={<EditPost />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
