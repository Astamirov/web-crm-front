import { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSignIn } from "../../features/signInSlace";
import { AppDispatch, RootState } from "../../app/store";
import style from "./SignIn.module.css";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";

const SignIn = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [blur, setBlur] = useState(false);
  const [btn, setBtn] = useState(false);
  const token = useSelector((state: RootState) => state.signInSlice.token);
  const error = useSelector((state: RootState) => state.signInSlice.error) as
    | string
    | null;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  console.log(error);

  const handleSingUp = (e: FormEvent) => {
    e.preventDefault();
    dispatch(
      authSignIn({
        _id: "",
        login,
        password,
        isAdmin: false,
        isMentor: false,
        isStudent: false,
        result: 0,
        group: "",
      })
    );
  };

  if (token) {
    navigate("/");
  }

  const handleSetName = (e: ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
  };

  const handleSetPass = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const hendleBlur = () => {
    setBlur(true);
  };

  return (
    <div className={style.login}>
      <div className={style.container}>
        <div className={style.form__signup}>
          <Link className={style.home__btn} to="/">
            <button className={style.home__img}>
              <AiOutlineHome />
            </button>
          </Link>
          <h1 className={style.h1}>Авторизация</h1>
          <form onSubmit={handleSingUp}>
            {error ? <div className={style.err_log}>{error}</div> : null}
            <input
              placeholder="name"
              onBlur={hendleBlur}
              className={blur && !login ? style.input__errr : style.inputt}
              onChange={handleSetName}
              value={login}
              type="text"
              name=""
              id=""
            />
            <input
              placeholder="password"
              onBlur={hendleBlur}
              className={blur && !password ? style.input__err : style.input}
              onChange={handleSetPass}
              value={password}
              type="password"
            />
            <button
              onClick={() => setBtn(!btn)}
              type="submit"
              className={style.button}
            >
              Авторизоваться
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
