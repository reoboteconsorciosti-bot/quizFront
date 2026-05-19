import React from "react";
import ReactDOM from "react-dom/client";
import { QuizApp } from "./components/quiz/QuizApp";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QuizApp />
  </React.StrictMode>
);
