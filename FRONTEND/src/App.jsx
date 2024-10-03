import { useContext, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import NotFound from "./components/404";
import DashboardPage from "./components/DashboardPage";
import DashboardLayout from "./layouts/DashboardLayout";
import HomeLayout from "./layouts/HomeLayout";
import GameInProgress from "./components/GameInProgress";
import GameStart from "./components/GameStart";
import { Toaster } from "react-hot-toast";
import DataContext from "./context/dataContext";
import {
  FetchAllQuestionsBd,
  fetchGetCategory,
  fetchGetGameSaveEnd,
} from "./utils/fetchBackend";
import History from "./components/History";
import ModalUploadQuestions from "./components/ModalUpload/modalUpload";

const code = true;

function App() {
  const { addGameQuestions, addCategorys, addDataQuestions } =
    useContext(DataContext);
  const ProtectedRoutes = ({ children }) => {
    if (code) {
      return children;
    } else {
      return <Navigate to="/" />;
    }
  };
  const handleQuest = async () => {
    await FetchAllQuestionsBd(addDataQuestions);
  };
  useEffect(() => {
    handleQuest();
    fetchGetGameSaveEnd(addGameQuestions);
    fetchGetCategory(addCategorys);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/gameprogress/:id" element={<GameInProgress />} />
        </Route>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <DashboardLayout />
            </ProtectedRoutes>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="/history" element={<History />} />
        <Route path="/upload" element={<ModalUploadQuestions />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },

          // Default options for specific types
          success: {
            duration: 1500,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </>
  );
}

export default App;
