import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import AppHeader from "./Components/AppHeader";
import LeftNav from "./Components/LeftNav";
import ChatHeader from "./Components/ChatHeader";
import ChatBody from "./Components/ChatBody";
import { LanguageProvider } from "./utilities/LanguageContext";
import LandingPage from "./Components/LandingPage";
import { useCookies } from "react-cookie";
import { ALLOW_LANDING_PAGE } from "./utilities/constants";
import { TranscriptProvider } from "./utilities/TranscriptContext";
import AdminLogin from "./Components/AdminLogin";
import AdminDashboard from "./Components/AdminDashboard";
import ManageDocuments from "./Components/ManageDocuments";
import AdminApp from "./Components/AdminMain";
import AdminAnalytics from "./Components/AdminAnalytics";
import "leaflet/dist/leaflet.css";
import RequireAdminAuth from "./utilities/RequireAdminAuth";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

function MainApp() {
  const theme = useTheme();
  // Detect mobile screen (xs/sm)
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); 
  // Determine if left nav should be shown (default to hidden on mobile)
  const [showLeftNav, setLeftNav] = useState(!isMobile);

  return (
    <Grid 
      container 
      direction="column" 
      className="appHideScroll"
      sx={{ 
        height: "100dvh", 
        width: "100%",        
        overflow: "hidden",    
        margin: 0,
        padding: 0
      }}
    >
      {/* 1. TOP HEADER (OSU Logo) */}
      <Grid 
        item 
        sx={{ 
          flex: "0 0 auto", 
          width: "100%",
          // FIX 1: Negative margin to forcefully pull the logo left on mobile
          marginLeft: { xs: "-16px", md: 0 }, 
          // Compensate width so it doesn't leave a gap on the right
          width: { xs: "calc(100% + 32px)", md: "100%" },
          
          // FIX 2: Override internal MUI padding to ensure flush fit
          '& .MuiToolbar-root': {
             paddingLeft: { xs: 0, md: "24px" },
             paddingRight: { xs: 0, md: "24px" }
          },
          '& .MuiContainer-root': {
             paddingLeft: { xs: 0, md: "24px" },
             paddingRight: { xs: 0, md: "24px" }
          }
        }}
      >
        <AppHeader showSwitch={false} />
      </Grid>

      {/* 2. MAIN CONTENT ROW */}
      <Grid 
        item 
        container 
        direction="row" 
        alignItems="stretch" 
        sx={{ 
          flex: "1 1 auto",   
          overflow: "hidden", 
          height: "auto"      
        }}
      >
        
        {/* LEFT NAV - Hidden on Mobile */}
        { !isMobile && (
            <Grid 
              item 
              sx={{ 
                width: showLeftNav ? "25%" : "50px",
                backgroundColor: (theme) => theme.palette.background.chatLeftPanel,
                transition: "width 0.3s ease",
                overflow: "hidden"
              }}
            >
              <LeftNav showLeftNav={showLeftNav} setLeftNav={setLeftNav} />
            </Grid>
        )}

        {/* CHAT AREA */}
        <Grid
          item
          sx={{
            flex: 1, 
            display: "flex",
            flexDirection: "column",
            backgroundColor: (theme) => theme.palette.background.chatBody,
            padding: 0, 
            height: "100%",
            overflow: "hidden",
            position: "relative"
          }}
        >
          {/* Chat Header (Blueberry AI Assistant) */}
          <Grid item sx={{ 
            flex: "0 0 auto", 
            px: 0, 
            width: "100%",
            // FIX 3: Added consistent spacing for BOTH Mobile and Desktop
            paddingTop: "1.5rem" 
          }}>
            <ChatHeader />
          </Grid>

          {/* Chat Messages Area */}
          <Grid
            item
            sx={{
              flex: "1 1 auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              overflow: "hidden",
              width: "100%"
            }}
          >
             <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                <ChatBody />
             </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

// TitleUpdater component to handle dynamic title based on the route
function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    let title = "Blueberry Chat Assistant"; // Default title

    // Check if the path starts with "/admin"
    if (location.pathname.startsWith("/admin")) {
      title = "Blueberry Bot Admin Portal"; // Set title for any admin page
    }

    document.title = title; // Set the document title
  }, [location.pathname]); // Re-run on path change

  return null; // This component does not render anything to the DOM
}

function App() {
  const [cookies] = useCookies(["language"]);
  const languageSet = Boolean(cookies.language);
  const [locationPermission, setLocationPermission] = useState(null); // Track permission status

  return (
    <LanguageProvider>
      <TranscriptProvider>
        <ThemeProvider theme={theme}>
          <Router>
          <TitleUpdater /> 
            <Routes>
              <Route path="/" element={<MainApp />} />
              <Route path="/admin" element={<AdminApp />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route
    path="/admin-dashboard"
    element={
      <RequireAdminAuth>
        <AdminDashboard />
      </RequireAdminAuth>
    }
  />
  <Route
    path="/admin-documents"
    element={
      <RequireAdminAuth>
        <ManageDocuments />
      </RequireAdminAuth>
    }
  />
  <Route
    path="/admin-analytics"
    element={
      <RequireAdminAuth>
        <AdminAnalytics />
      </RequireAdminAuth>
    }
  />
            </Routes>
          </Router>
        </ThemeProvider>
      </TranscriptProvider>
    </LanguageProvider>
  );
}

export default App;
