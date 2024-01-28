import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
// import Team from "./scenes/team";
// import Contacts from "./scenes/contacts";
// import Invoices from "./scenes/invoices";
// import Form from "./scenes/form";
// import Calendar from "./scenes/calendar/calendar";
// import FAQ from "./scenes/faq";
import Bar from "./scenes/bar";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import UserProfilePage from "./scenes/pending";
// import Geography from "./scenes/geography";
import Enter from "./enter";
import { AuthContextProvider } from "./components/AuthCheck";
import Protected from "./components/Protected";
import Account from "./scenes/account";
import Settings from "./scenes/settings";

function App() {
    const [theme, colorMode] = useMode();

    return(
      < AuthContextProvider >
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline /> {/* reset css */}
                <div className="app">
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <Routes>
                      <Route path="/" element={<Enter />} />
                      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
                      {/* <Route path="/calendar" element={<Protected><Calendar /></Protected>} /> */}
                      <Route path="/bar" element={<Protected><Bar /></Protected>} />
                      <Route path="/pie" element={<Protected><Pie /></Protected>} />
                      <Route path="/line" element={<Protected><Line /></Protected>} />
                      <Route path="/pending" element={<Protected><UserProfilePage /></Protected>} />
                      <Route path="/account" element={<Protected><Account /></Protected>} />
                      <Route path="/settings" element={<Protected><Settings /></Protected>} />
                    </Routes>
                  </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
        </AuthContextProvider>
    );
}

export default App;
