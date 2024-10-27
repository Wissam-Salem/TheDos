import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { IconContext } from "react-icons";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import ThemeContext from "./Context/Context.jsx";
import { CustomProvider } from "rsuite";
import "rsuite/styles/index.less";

createRoot(document.getElementById("root")).render(
  <IconContext.Provider value={{ color: "black" }}>
    <ThemeContext>
      <CustomProvider theme="dark">
        <App />
      </CustomProvider>
    </ThemeContext>
  </IconContext.Provider>
);
