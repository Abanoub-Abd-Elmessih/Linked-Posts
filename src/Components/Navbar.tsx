import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GlobalState } from "../lib/store";
import { logout } from "../lib/Slices/AuthSlice";

function Navbar() {
  const dispatch = useDispatch();
  const { token, userData } = useSelector((state: GlobalState) => state.auth);
  const pages = [
    ...(!token
      ? [
          { path: "/login", text: "Login" },
          { path: "/registration", text: "Registration" },
        ]
      : []),
    ...(token ? [
      { path: "/", text: "Home" },
      { path: "/profile", text: "Profile" },
    ] : []),
  ];
  const settings = [
    ...(token
      ? [
          { path: "/login", text: "Logout" },
        ]
      : []),
  ];

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="sticky" className="py-2 md:p-0">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <PostAddIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to={"/"}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Linked Posts
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
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
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map(({ path, text }) => (
                <MenuItem key={text} onClick={handleCloseNavMenu}>
                  <Link to={path}>
                    <Typography sx={{ textAlign: "center" }}>{text}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <PostAddIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to={"/"}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Linked Posts
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map(({ text, path }) => (
              <Link key={text} to={path}>
                <Button
                  key={text}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {text}
                </Button>
              </Link>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {token && userData && (
              <Tooltip title="Open settings">
                <IconButton
                  onClick={handleOpenUserMenu}
                >
                  <Avatar alt={userData?.name} src={userData?.photo} />
                </IconButton>
              </Tooltip>
            )}
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map(({ path, text }) => (
                <MenuItem
                  key={text}
                  onClick={() => {
                    if (text === "Logout") {
                      dispatch(logout());
                      handleCloseUserMenu();
                    } else {
                      handleCloseUserMenu();
                    }
                  }}
                >
                  <Link to={path}>
                    <Typography sx={{ textAlign: "center" }}>{text}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
