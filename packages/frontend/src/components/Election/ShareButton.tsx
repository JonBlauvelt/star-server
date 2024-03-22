import React, { useState } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import RedditIcon from "@mui/icons-material/Reddit";
import LinkIcon from "@mui/icons-material/Link";
import { Menu } from "@mui/material";
import { StyledButton } from "../styles";
import useSnackbar from "../SnackbarContext";

export default function ShareButton({ url }) {
  const { setSnack } = useSnackbar();
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleShare = (e) => {
    e.preventDefault();

    const ahref = url;
    const encodedAhref = encodeURIComponent(ahref);
    let link;

    switch (e.currentTarget.id) {
      case "facebook":
        link = `https://www.facebook.com/sharer/sharer.php?u=${ahref}`;
        open(link);
        break;

      case "twitter":
        link = `https://twitter.com/intent/tweet?url=${encodedAhref}`;
        open(link);
        break;

      case "reddit":
        link = `https://www.reddit.com/submit?url=${encodedAhref}`;
        open(link);
        break;

      case "copy":
        navigator.clipboard.writeText(ahref);
        setSnack({
          message: "Link Copied!",
          severity: "success",
          open: true,
          autoHideDuration: 6000,
        });
        break;

      default:
        break;
    }
  };

  const open = (socialLink) => {
    window.open(socialLink, "_blank");
  };

  return (
    <>
      <StyledButton
        type="button"
        variant="contained"
        fullwidth
        onClick={handleOpenNavMenu}
      >
        Share
      </StyledButton>
      <Fade timeout={350}>
        <Paper>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
          >
            <ListItem button id="facebook" onClick={handleShare}>
              <ListItemIcon>
                <FacebookIcon />
              </ListItemIcon>
              <ListItemText primary="Facebook" />
            </ListItem>
            <ListItem button id="twitter" onClick={handleShare}>
              <ListItemIcon>
                <TwitterIcon />
              </ListItemIcon>
              <ListItemText primary="Twitter" />
            </ListItem>
            <ListItem button id="reddit" onClick={handleShare}>
              <ListItemIcon>
                <RedditIcon />
              </ListItemIcon>
              <ListItemText primary="Reddit" />
            </ListItem>
            <ListItem button id="copy" onClick={handleShare}>
              <ListItemIcon>
                <LinkIcon />
              </ListItemIcon>
              <ListItemText primary="Copy Link" />
            </ListItem>
          </Menu>
        </Paper>
      </Fade>
    </>
  );
}
