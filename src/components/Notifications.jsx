import { ThemeProvider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { theme } from "../theme/theme";

export default function Notifications(props) {
  //This is all placeholder
  return (
    <ThemeProvider theme={props.theme}>
      <Box
        sx={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" sx={{ paddingTop: "10px", paddingBottom: "10px" }}>
          Notifications
        </Typography>
      </Box>
    </ThemeProvider>
  );
}
