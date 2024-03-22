import { Box, Typography } from "@mui/material";
import React from "react";

export default function LandingPageTestimonials({ testimonials }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        clip: "unset",
        width: "100%",
        p: { xs: 2 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1300px",
          margin: "auto",
        }}
      >
        <Typography variant="h4" sx={{ textAlign: "left" }}>
          Testimonials
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "2rem",
          p: { xs: 4 },
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {testimonials.map((testimonial) => (
          <Box
            key={testimonial.url}
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                backgroundImage: `url(${testimonial.url})`,
                backgroundSize: "cover",
                borderRadius: "100%",
                width: "10rem",
                height: "10rem",
                margin: "auto",
              }}
            />
            <Typography variant="h5" sx={{ textAlign: "center" }}>
              <i>
                &ldquo;{testimonial.quote}&rdquo;
                <br />-{testimonial.name}
              </i>
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
