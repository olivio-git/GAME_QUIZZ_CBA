import axios from "axios";
import { responseSuccess } from "./responseSuccess";
import toast, { Toaster } from "react-hot-toast";

const ERRORS_CODE = {
  ERR_CONNECTION_ALERT: (err) => {
    return (
      err == "ERR_CONNECTION_REFUSED" ? "Error dont have connection" : err, "!"
    );
  },
};
//category
export const fetchPostCategory = async (props) => {
  return await axios.post("/category/", { name_category: props });
};
export const fetchDeleteCategory = async (props) => {
  return await axios.delete(`/category/${props}`);
};
export const fetchGetCategory = async (fn) => {
  const response = await axios.get("/category/");
  fn(response.data.data);
};
//questions
export const fetchPostQuestion = async (props) => {
  return await axios.post("/questions/", props);
};
export const fetchGetQuestions = async (fn, id) => {
  const response = await axios.get(`/questions/byid/${id}`);
  fn(response.data.data);
};
export const fetchDeleteQuestion = async (props, id) => {
  return await axios.delete(`/questions/${props}?iduser=${id}`);
};
export const fetchDeleteQuestions = async (id) => {
  return await axios.delete(`/questions/${id}`);
};
export const FetchAllQuestionsBd = async (fn) => {
  const response = await axios.get("questions/as");
  console.log(response);
  fn(response.data.data);
};
//
export const fetchPostGame = async (obj) => {
  return await axios.post("/game/", obj);
};

export const fetchPostGameSaveEnd = async (obj) => {
  return await axios.post("/game/save/end", obj);
};

export const fetchGetGameSaveEnd = async (fn) => {
    console.log("peticion");
  const response = await axios.get("/game/questions");
    console.log(response.data.data);

  fn(response.data.data);
};

export const fetchPostFile = async (file) => {  
  return await axios.post("/questions/upload", file);
}