import style from "./Auth.module.css";
import { Link } from "react-router-dom";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";

const Auth = () => {

const userOne = useSelector((state: RootState) => state.usersSlice.oneUser);
const chats = useSelector((state: RootState) => state.chat.chats);




const getChatIdForUser = (userId) => {
  const chat = chats.find((chat) => chat.participants.includes(userId));
  return chat ? chat._id : null;
};


const userId = userOne ? userOne._id : null;
const chatId = userId ? getChatIdForUser(userId) : null;


// useEffect(dispatch())

  const admin = useSelector((state: RootState) => state.usersSlice.oneUser);


  return (
    <div className={style.out_header}>
      <div className={style.out_content}>
        <nav className={style.out_nav}>
          <ul className={style.out_ul}>
            <li>
            <Link className={style.out_a} to={`/chat/${chatId}`}>
              Чат
            </Link>
          </li>
            <li>
              <Link to={"/Tasks"} className={style.out_a}>
                Таски
              </Link>
            </li>
            <li>
              <Link to={"/group"} className={style.out_a}>
                Группа
              </Link>
            </li>
            <li>
               {admin.isAdmin === true ? <Link to={"/listStud"} className={style.out_a}>
                Студенты
              </Link> : null}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Auth;
