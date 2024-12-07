import { Fab } from "@mui/material";
import { useEffect, useState } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useLocation } from "react-router-dom";

const ScrollToTopButton = () => {
  const [backToTopBtn, setBackToTopBtn] = useState(false);

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);


  useEffect(() => {
    const handleScroll = () => {
      setBackToTopBtn(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {backToTopBtn && (
        <Fab
          color="primary"
          aria-label="scroll to top"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <ArrowUpwardIcon />
        </Fab>
      )}
    </>
  );
};

export default ScrollToTopButton;
