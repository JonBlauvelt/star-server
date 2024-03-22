import React from "react";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import {
  Checkbox,
  FormGroup,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Tooltip,
} from "@mui/material";
import { Election } from "@equal-vote/star-vote-shared/domain_model/Election";
import { StyledButton } from "../styles";

type SettingsProps = {
  election: Election;
  applyElectionUpdate: (f: (e: Election) => void) => void;
  getStyle: any;
  setPageNumber: (f: (p: number) => void) => void;
};

export default function Settings({
  election,
  applyElectionUpdate,
  setPageNumber,
}: SettingsProps) {
  const updateVoterAccess = (voter_access) => {
    applyElectionUpdate((election) => {
      election.settings.voter_access = voter_access;
      if (voter_access === "open") {
        election.settings.voter_authentication.voter_id = false;
        election.settings.invitation = undefined;
      }
    });
  };

  const validatePage = () => {
    // Placeholder function
    return true;
  };

  return (
    <>
      <Grid item xs={11} sx={{ m: 0, p: 1 }}>
        <Typography gutterBottom variant="h4" component="h4">
          Election Settings
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ m: 0, my: 1, p: 1 }}>
        <FormControl component="fieldset" variant="standard">
          <FormLabel id="voter-access">Voter Access</FormLabel>
          <FormHelperText>
            Who do you want to have access to your election?
          </FormHelperText>
          <RadioGroup
            aria-labelledby="voter-access-radio-group"
            name="voter-access-radio-buttons-group"
            value={election.settings.voter_access}
            onChange={(e) => updateVoterAccess(e.target.value)}
          >
            <FormControlLabel
              value="open"
              control={<Radio />}
              label="Open"
              sx={{ mb: 0, pb: 0 }}
            />
            <FormHelperText sx={{ pl: 4, mt: -1 }}>
              Open to authenticated voters
            </FormHelperText>
            <FormControlLabel
              value="closed"
              control={<Radio />}
              label="Closed"
            />
            <FormHelperText sx={{ pl: 4, mt: -1 }}>
              Restricted to a predefined list of voters
            </FormHelperText>
            <Tooltip title="Voters must first register to cast a provisional ballot and credentialer must approve each voter">
              <FormControlLabel
                value="registration"
                control={<Radio />}
                label="Registration"
              />
            </Tooltip>
            <FormHelperText sx={{ pl: 4, mt: -1 }}>
              Registered and approved
            </FormHelperText>
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ m: 0, my: 1, p: 1 }}>
        <FormControl component="fieldset" variant="standard">
          <FormLabel component="legend">Voter Authentication</FormLabel>
          <FormHelperText>
            How do you want to authenticate your voters?
          </FormHelperText>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  id="ip-address"
                  name="IP Address"
                  checked={election.settings.voter_authentication?.ip_address}
                  onChange={(e) =>
                    applyElectionUpdate((election) => {
                      election.settings.voter_authentication.ip_address =
                        e.target.checked;
                    })
                  }
                />
              }
              label="IP Address"
            />
            <FormHelperText sx={{ pl: 4, mt: -1 }}>
              Limits to one vote per IP address
            </FormHelperText>
            <FormControlLabel
              control={
                <Checkbox
                  id="email"
                  name="Email"
                  checked={election.settings.voter_authentication?.email}
                  onChange={(e) =>
                    applyElectionUpdate((election) => {
                      election.settings.voter_authentication.email =
                        e.target.checked;
                    })
                  }
                />
              }
              label="Email"
            />
            <FormHelperText sx={{ pl: 4, mt: -1 }}>
              Voters must be logged in with a validated email address
            </FormHelperText>
            <FormControlLabel
              disabled={election.settings.voter_access === "open"}
              control={
                <Checkbox
                  id="voter-id"
                  name="Voter ID"
                  checked={election.settings.voter_authentication?.voter_id}
                  onChange={(e) =>
                    applyElectionUpdate((election) => {
                      election.settings.voter_authentication.voter_id =
                        e.target.checked;
                    })
                  }
                />
              }
              label="Voter ID"
            />
            <FormHelperText sx={{ pl: 4, mt: -1 }}>
              Voters must enter a voter ID code provided to them by election
              host
            </FormHelperText>
          </FormGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ m: 0, my: 1, p: 1 }}>
        <FormControl component="fieldset" variant="standard">
          <FormLabel component="legend">Miscellaneous Settings</FormLabel>
          <FormGroup>
            <FormControlLabel
              disabled
              control={
                <Checkbox
                  id="ballot-updates"
                  name="Ballot Updates"
                  checked={election.settings.ballot_updates}
                  onChange={(e) =>
                    applyElectionUpdate((election) => {
                      election.settings.ballot_updates = e.target.checked;
                    })
                  }
                />
              }
              label="Ballot Updates"
            />
            <FormHelperText sx={{ pl: 4, mt: -1 }}>
              Allow voters to update their ballots while election is still open
              (currently not supported)
            </FormHelperText>
            <FormControlLabel
              control={
                <Checkbox
                  id="public-results"
                  name="Public Results"
                  checked={election.settings.public_results}
                  onChange={(e) =>
                    applyElectionUpdate((election) => {
                      election.settings.public_results = e.target.checked;
                    })
                  }
                />
              }
              label="Public Results"
            />
            <FormHelperText sx={{ pl: 4, mt: -1 }}>
              Allow voters to view preliminary results. (Administrators can make
              results public at any time.)
            </FormHelperText>
            <FormControlLabel
              disabled={election.settings.voter_access !== "closed"}
              control={
                <Checkbox
                  id="invitation"
                  name="Invitation"
                  checked={election.settings.invitation !== undefined}
                  onChange={(e) =>
                    applyElectionUpdate((election) => {
                      election.settings.invitation = e.target.checked
                        ? "email"
                        : undefined;
                    })
                  }
                />
              }
              label="Email Invitations"
            />
            <FormHelperText sx={{ pl: 4, mt: -1 }}>
              If email addresses are provided, voters will be invited once
              election is open.
            </FormHelperText>
          </FormGroup>
        </FormControl>
      </Grid>
      <Grid item xs={3} sx={{ m: 0, p: 1, pt: 2 }}>
        <StyledButton
          type="button"
          variant="contained"
          width="100%"
          onClick={() => {
            if (validatePage()) {
              setPageNumber((pageNumber) => pageNumber - 1);
            }
          }}
        >
          Back
        </StyledButton>
      </Grid>
      <Grid item xs={6}></Grid>
      <Grid item xs={3} sx={{ m: 0, p: 1, pt: 2 }}>
        <StyledButton
          type="button"
          variant="contained"
          fullWidth
          onClick={() => {
            if (validatePage()) {
              setPageNumber((pageNumber) => pageNumber + 1);
            }
          }}
        >
          Next
        </StyledButton>
      </Grid>
    </>
  );
}
