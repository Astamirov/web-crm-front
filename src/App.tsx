import "./App.css";
import Header from "./components/Header/Header";
import SignIn from "./components/SignIn/SignIn";
import { Routes, Route } from "react-router-dom";

import Contact from "./components/Contact/Contact";
import Students from "./components/Students/Students";
import Footer from './components/Footer/Footer';

import Info from "./components/Info/Info";
import Sandbox from "./components/Sandbox/Sandbox";

function App() {
  return (
    <>
    <Header />
      <Routes>

        <Route path={"/login"} element={<SignIn />} />
        <Route path={"/student"} element={<Students/>} />
        <Route path={"/info"} element={<Info />} />
        <Route path={"/sandbox"} element={<Sandbox />} />
        <Route path={"/contact"} element={<Contact />} />
      </Routes>
    </>
  );
}

export default App;
