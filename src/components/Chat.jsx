import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function Chat(props) {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        flexDirection: "column",
        color: "white",
      }}
    >
      <Typography variant="h4" sx={{ paddingTop: "10px", paddingBottom: '8px'  }}>
        Chat
      </Typography>
      <Divider variant="fullWidth" />
    </Box>
  );
}
