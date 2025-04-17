import { useQuery } from "@tanstack/react-query";
import { Typography, Paper } from "@mui/material";
import { getStatistics } from "../api/mockApi";

const Statistics: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ["statistics"],
    queryFn: getStatistics,
  });

  return (
    <Paper sx={{ padding: "20px", marginTop: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Statistics
      </Typography>
      {stats ? (
        <Typography variant="h6" gutterBottom>
          Total Books: {stats.totalBooks}, Top Author: {stats.topAuthor}, Top Year: {stats.topYear}
        </Typography>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Paper>
  );
};

export default Statistics;