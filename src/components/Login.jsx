import { LoadingButton } from "@mui/lab";
import { createTheme, ThemeProvider } from "@mui/material";
import { Box } from "@mui/system";
import { motion } from "framer-motion";

export default function Login({ loading, hidden, loginHandler }) {
  const theme = createTheme({
    status: {
      danger: "#e53e3e",
    },
    palette: {
      primary: {
        main: "#3e9dfc",
        darker: "#1f1f1f",
      },
      neutral: {
        main: "#64748B",
        contrastText: "#fff",
      },
    },
  });
  const visible = {opacity: 1, y: 0, transition:{duration:0.5}};
  
  const variantText = {
    hidden: {
      opacity: 0,
      y: 10
    },
    visible: {
      opacity: 1,
      y: 0,
    }
  };
  if (hidden) {
    return <></>;
  }
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(180deg, rgba(31,31,31,1) 9%, rgba(0,73,147,1) 52%, rgba(65,0,121,1) 100%)",
          zIndex: 10,
        }}
      >
          <Box
            initial='hidden'
            animate='visible'
            variants={{hidden: {opacity: 0, y: -20}, visible}}
            component={motion.div}
            transition={{ duration: .5 }}
            className='title'
            sx={{
              position: 'absolute',
              top:'30%',
              fontFamily: 'Pacifico',
              letterSpacing: '',
              padding: "3rem",
              color: "transparent",
              fontWeight: "bold",
              fontSize: 72,
            }}
          >
            PicFlo
          </Box>
          <Box
            initial='hidden'
            animate='visible'
            variants={{hidden: {opacity: 0, y: -20}, visible}}
            component={motion.div}
            transition={{ duration: .5 }}
            className='title2'
            sx={{
              position: 'absolute',
              top:'30%',
              fontFamily: 'Pacifico',
              letterSpacing: '',
              padding: "3rem",
              color: "",
              fontWeight: "bold",
              fontSize: 72,
            }}
          >
            PicFlo
          </Box>
        <LoadingButton
          initial='hidden'
          animate='visible'
          component={motion.button}
          variants={variantText}
          transition={{ duration: .5, delay:0.3 }}
          color="primary"
          onClick={loginHandler}
          variant="outlined"
          loading={loading}
          sx={{
            position: 'absolute',
          top:'60%',}}
        >
          Sign-In with Google™
        </LoadingButton>
      </Box>
    </ThemeProvider>
  );
}
