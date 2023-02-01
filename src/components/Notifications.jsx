import { Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function Notifications() {
    //This is all placeholder
  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        flexDirection: "column",
        color: "white",
      }}
    >
      <Typography variant="h4" sx={{ paddingTop: "10px" }}>
        Notifications
      </Typography>
    </Box>
  );
}
