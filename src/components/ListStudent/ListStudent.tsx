import React, { useEffect } from "react";
import { useState } from "react";
import style from "./ListStudent.module.css";
import { RiCloseCircleLine } from "react-icons/ri";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { fetchUsers } from "../../features/usersSlice";

const Student = () => {
  const user = useSelector((state: RootState) => state.usersSlice.users);
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("")

  const result = user.filter(item =>  {
return item.login.toLowerCase().includes(search.toLowerCase())
  })
  
  
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);
  console.log(fetchUsers);
  
  return (
    <div className={style.student}>
        <div className={style.student_content}>
          <div className={style.list_student}>
            <div className={style.close_list}>
              <h2>Студенты</h2>
              <div>
                <div className={style.list_content}>
                  <button 
                  
                  className={style.add}>
                    <AiOutlineUsergroupAdd />
                  </button>
                  <input
                    className={style.search_student}
                    placeholder="Search"
                    type="text"
        onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className={style.students}>
           {result.map((item, index) => {
            return(item.isStudent === true ? <div className={style.students_one}>
              <p className={style.student_number}>{search === "" ? index : index + 1}</p>
              <p className={style.student_name}>{item.login}</p>
              <p className={style.student_group}>{item.group}</p>
              </div> : "")
           })}
              </div>
            </div>
          </div>
        </div>
      
  );
};

export default Student;
