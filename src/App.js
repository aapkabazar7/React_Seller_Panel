import { BrowserRouter as Router } from "react-router-dom";
import MiniDrawer from "./NewComponents/HomePage/HomePage";
import LeftPanel from "./leftPanel";
import Login from "./NewComponents/HomePage/Login/Login";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: "#F3F9F7", width: "100%", height: "100%" }}>
        {/* <LeftPanel /> */}
        {
          localStorage.getItem("token") === null ?
            <Login /> :
            <>
              <MiniDrawer />
            </>
        }
        <ToastContainer stacked />
      </div>
    </Router>
  );
}

export default App;
