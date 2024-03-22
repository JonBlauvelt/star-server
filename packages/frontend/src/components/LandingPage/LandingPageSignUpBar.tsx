import { Box, Button, Typography } from "@mui/material";
import React from "react";
import useAuthSession from "../AuthSessionContextProvider";
import { useThemeSelector } from "../../theme";

export default function LandingPageSignUpBar() {
  const authSession = useAuthSession();
  const themeSelector = useThemeSelector();
  return (
    <Box
      sx={{
        background:
          themeSelector.mode === "darkMode" ? "brand.gray5" : "brand.gray1",
        clip: "unset",
        width: "100%",
        p: { xs: 2 },
      }}
    >
      <Box
        sx={{
          width: "50%",
          maxWidth: "650px",
          minWidth: "250px",
          margin: "auto",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ textAlign: "left" }}>
          Sign up to create your first election (It&apos;s Free!)
        </Typography>
        {/*I just copied styled button but removed the full width*/}
        <Button
          variant="contained"
          sx={{
            p: 1,
            m: 0,
            boxShadow: 2,
            backgroundColor: "primary.main",
            fontWeight: "bold",
            fontSize: 18,
          }}
          onClick={() => authSession.openLogin()}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
}
