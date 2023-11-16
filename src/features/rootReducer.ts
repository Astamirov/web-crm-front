import { combineReducers } from "redux";
import signInSlice from "./signInSlace";
import usersSlice from "./usersSlice";
import chatsSlice from "./chatsSlice";
import messagesSlice from "./messagesSlice";
import cardSlicer from "./cardSlicer";


const rootReducer = combineReducers({
  signInSlice: signInSlice,
  usersSlice: usersSlice,
  chat: chatsSlice,
  messages: messagesSlice,
  cardSlicer: cardSlicer,
});

export default rootReducer;
  