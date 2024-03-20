import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useGetElection } from "../../hooks/useAPI";

const formatter = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});

export default function FeaturedElection({ electionId }) {
  const navigate = useNavigate();
  const { data, makeRequest: fetchElections } = useGetElection(electionId);

  useEffect(() => {
    fetchElections();
  }, []);

  return (
    <Card
      className="featuredElection"
      onClick={() => navigate(`/${electionId}`)}
      elevation={8}
      sx={{
        width: "100%",
        maxWidth: "20rem",
        display: "flex",
        flexDirection: "column",
        flexShrink: "0",
      }}
    >
      <CardActionArea sx={{ p: { xs: 2, md: 2 } }}>
        <CardContent>
          <Typography variant="h5">
            {data == null ? "null" : data.election.title}
          </Typography>
          <Typography sx={{ textAlign: "right", color: "#808080" }}>
            {data == null
              ? "null"
              : formatter.format(
                  data.election.races.map((race) => race.voting_method),
                )}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
