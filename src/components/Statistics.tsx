import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "../api/mockApi";
import { Typography, Paper, Box } from "@mui/material";

const Statistics: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["statistics"],
    queryFn: getStatistics,
  });

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Paper sx={{ padding: "20px", marginTop: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Library Statistics
      </Typography>
      <Box>
        <Typography variant="body1">Total Books: {stats?.totalBooks}</Typography>
        <Typography variant="body1">Popular Author: {stats?.popularAuthor}</Typography>
        <Typography variant="body1">Popular Publication Year: {stats?.popularYear}</Typography>
      </Box>
    </Paper>
  );
};

export default Statistics;