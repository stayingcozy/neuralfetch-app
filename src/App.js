import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Bar from "./scenes/bar";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import Enter from "./enter";
import { AuthContextProvider } from "./components/AuthCheck";
import Protected from "./components/Protected";
import Account from "./scenes/account";
import Settings from "./scenes/settings";
import Subscription from "./scenes/subscription";
import UserCheckout from './scenes/shop';

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
                      <Route path="/bar" element={<Protected><Bar /></Protected>} />
                      <Route path="/pie" element={<Protected><Pie /></Protected>} />
                      <Route path="/line" element={<Protected><Line /></Protected>} />
                      <Route path="/account" element={<Protected><Account /></Protected>} />
                      <Route path="/settings" element={<Protected><Settings /></Protected>} />
                      <Route path="/subscription" element={<Protected><Subscription /></Protected>} />
                      <Route path="/shop" element={<Protected><UserCheckout /></Protected>} />
                    </Routes>
                  </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
        </AuthContextProvider>
    );
}

export default App;
