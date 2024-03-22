import React, { useEffect } from "react";
import Results from "./Results";
import Box from "@mui/material/Box";
import { Paper, Typography } from "@mui/material";
import { DetailExpanderGroup } from "../../util";
import { useGetResults } from "../../../hooks/useAPI";
import useElection from "../../ElectionContextProvider";

const ViewElectionResults = () => {
  const { election } = useElection();

  const {
    data,
    isPending,
    makeRequest: getResults,
  } = useGetResults(election.election_id);
  useEffect(() => {
    getResults();
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ width: "100%", textAlign: "center" }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: "1200px",
          m: 2,
          p: 2,
          backgroundColor: "brand.white",
          marginBottom: 2,
          "@media print": { boxShadow: "none" },
        }}
      >
        <Typography variant="h3" component="h3" sx={{ marginBottom: 4 }}>
          {election.state === "closed"
            ? "OFFICIAL RESULTS"
            : "PRELIMINARY RESULTS"}
        </Typography>
        <Typography variant="h4" component="h4">
          Election Name:
          <br />
          {election.title}
        </Typography>
        {isPending && <div> Loading Election... </div>}

        <DetailExpanderGroup defaultSelectedIndex={-1} allowMultiple>
          {data?.results.map((result, race_index) => (
            <Results
              key={`results-${race_index}`}
              title={`Race ${race_index + 1}: ${election.races[race_index].title}`}
              raceIndex={race_index}
              race={election.races[race_index]}
              result={result}
            />
          ))}
        </DetailExpanderGroup>
      </Paper>
    </Box>
  );
};
export default ViewElectionResults;
