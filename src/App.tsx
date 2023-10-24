import "./App.css";
import Header from "./components/Header/Header";
import SignIn from "./components/SignIn/SignIn";
import { Routes, Route } from "react-router-dom";

// import ChatList from "./components/ChatList/ChatList";
import ChatRoom from "./components/ChatRoom/Chat";

import Auth from "./components/Auth/Auth";
import ListStudent from "./components/ListStudent/ListStudent";
import Contact from "./components/Contact/Contact";
import Students from "./components/Students/Students";
import Home from "./components/Home/Home";
import Profil from "./components/Profil/Profil";
import Footer from "./components/Footer/Footer";
import Info from "./components/Info/Info";
import Sandbox from "./components/Sandbox/Sandbox";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";
import Form from "./components/Form/Form";

import Tasks from "./components/Tasks/Tasks";
import Group from "./components/Group/Group";

function App() {
  const token = useSelector((state: RootState) => state.signInSlice.token);
  return (
    <>
      <Header />
      {token ? <Auth /> : null}
      <Routes>
        <Route path={"/Chat"} element={<Profil />} />

        <Route path={"/group"} element={<Group />} />

        <Route path={"/"} element={<Home />} />

        <Route path={"/login"} element={<SignIn />} />
        {/* <Route path="/" element={<ChatList />} /> */}
        <Route path={`/chat/:chatId`} element={<ChatRoom />} />

        <Route path={"/student"} element={<Students />} />
        <Route
          path={"/info"}
          element={
            <>
              <Info />
              <Form />
            </>
          }
        />

        <Route path={"/sandbox"} element={<Sandbox />} />
        <Route path={"/contact"} element={<Contact />} />
        <Route path={"/tasks"} element={<Tasks />} />
        <Route path={"/listStud"} element={<ListStudent />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
