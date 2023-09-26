import React from "react";
import { Link } from "react-router-dom";
import style from "./Info.module.css"
import logo from '../../img/5211141811341477649_99.jpg'

const Info = () => {
  return (
    <div className={style.info}>
        <div className={style.logo__info}>
      <h1>Информация</h1>
<img src={logo} alt="" />
        </div>
      <div>
        <h3>Не бойтесь вступительного экзамена в Интукод!</h3>
        <p>
          Мы знаем, что слово "экзамен" может вызывать тревогу и страх. Но на
          самом деле, наш вступительный экзамен - это не что иное, как
          возможность показать нам вашу готовность к обучению и ваше стремление
          к развитию.
        </p>
        <p>
          Экзамен не предназначен для того, чтобы "отсеять" кого-то. Он создан
          для того, чтобы убедиться, что вы готовы к интенсивному обучению и
          сможете справиться с нагрузкой. Мы не ожидаем от вас идеальных знаний
          или навыков. Мы хотим видеть вашу мотивацию, усердие и готовность
          учиться.{" "}
        </p>
        <p>
          Не бойтесь ошибиться или не знать что-то. Это нормально. Главное - это
          ваше желание учиться и развиваться. Так что, не откладывайте и
          пробуйте сдать вступительный экзамен. Это может быть началом вашего
          пути в мир IT и новой карьеры! Если у вас есть вопросы или вам нужна
          помощь в подготовке, напишите нашему менеджеру 
          <Link to={"#"}>@intocode_manager</Link>. Мы всегда готовы помочь!
        </p>
      </div>

      <div>
        <h3>Мы внесли изменения в договор об обучении.</h3>
        <p>– Был убран пункт о возврате денежных средств после обучения;</p>
        <ul>
        – Убраны пункты, которые имели только формальный характер:
            <li>о нарушении сроков оплаты студентом</li>
            <li> о предоставлении контактного номера или уведомлении при их изменении</li>
            <li>об отправке чека оплаты на наш e-mail</li>
            <li>о рабочих часах и днях</li>
            <li>о территории, где проходит обучение</li>
        </ul>
        <p>
          Также мы обновили приложение к договору – убрали устаревшие технологии
          и добавили новые. Ознакомиться с договором{" "}
          <Link 
            to={
              "https://docs.google.com/document/d/186gYz4DrFBnRGJQldwX2rBvKtDmBjzst42G8zwr7SO0/edit"
            }
            target={"_blank"}
          >
            можно тут.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Info;
