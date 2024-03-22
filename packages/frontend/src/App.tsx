import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeContextProvider } from "./theme";
import Header from "./components/Header";
import Login from "./components/Login";
import CreateElectionTemplates from "./components/ElectionForm/CreateElectionTemplates";
import Election from "./components/Election/Election";
import Sandbox from "./components/Sandbox";
import LandingPage from "./components/LandingPage";
import { Box, CssBaseline } from "@mui/material";
import { SnackbarContextProvider } from "./components/SnackbarContext";
import Footer from "./components/Footer";
import { ConfirmDialogProvider } from "./components/ConfirmationDialogProvider";
import About from "./components/About";
import { AuthSessionContextProvider } from "./components/AuthSessionContextProvider";
import ElectionInvitations from "./components/Elections/ElectionInvitations";
import ElectionsYouManage from "./components/Elections/ElectionsYouManage";
import ElectionsYouVotedIn from "./components/Elections/ElectionsYouVotedIn";
import OpenElections from "./components/Elections/OpenElections";
import { FeatureFlagContextProvider } from "./components/FeatureFlagContextProvider";

const App = () => {
  return (
    <Router>
      <FeatureFlagContextProvider>
        <ThemeContextProvider>
          <AuthSessionContextProvider>
            <ConfirmDialogProvider>
              <SnackbarContextProvider>
                <CssBaseline />
                <Box display="flex" flexDirection="column" minHeight={"100vh"}>
                  <Header />
                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/About" element={<About />} />
                      <Route
                        path="/ElectionInvitations"
                        element={<ElectionInvitations />}
                      />
                      <Route
                        path="/ElectionsYouManage"
                        element={<ElectionsYouManage />}
                      />
                      <Route
                        path="/ElectionsYouVotedIn"
                        element={<ElectionsYouVotedIn />}
                      />
                      <Route
                        path="/OpenElections"
                        element={<OpenElections />}
                      />
                      <Route path="/Login" element={<Login />} />
                      <Route
                        path="/CreateElection"
                        element={<CreateElectionTemplates />}
                      />
                      {/*Keeping old path for legacy reasons, although we can probably remove it once the domain moves from dev.star.vote*/}
                      <Route path="/Election/:id/*" element={<Election />} />
                      <Route path="/:id/*" element={<Election />} />
                      <Route path="/Sandbox" element={<Sandbox />} />
                    </Routes>
                  </Box>
                  <Footer />
                </Box>
              </SnackbarContextProvider>
            </ConfirmDialogProvider>
          </AuthSessionContextProvider>
        </ThemeContextProvider>
      </FeatureFlagContextProvider>
    </Router>
  );
};

export default App;
