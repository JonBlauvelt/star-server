import { useRef, useState, useCallback } from "react";
import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
} from "@mui/material";
import Cropper from "react-easy-crop";
import getCroppedImg from "./PhotoCropper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { StyledButton } from "../../styles";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import useFeatureFlags from "../../FeatureFlagContextProvider";
import { Candidate } from "@equal-vote/star-vote-shared/domain_model/Candidate";

interface CandidateDialogProps {
  onEditCandidate: (candidate: Candidate) => void;
  candidate: Candidate;
  onSave: () => void;
  open: boolean;
  handleClose: () => void;
  index: number;
}
const CandidateDialog = (props: CandidateDialogProps) => {
  const flags = useFeatureFlags();
  const { onEditCandidate, candidate, onSave, open, handleClose } = props;

  const onApplyEditCandidate = (updateFunc) => {
    const newCandidate = { ...candidate };
    console.log(newCandidate);
    updateFunc(newCandidate);
    onEditCandidate(newCandidate);
  };

  const [candidatePhotoFile, setCandidatePhotoFile] = useState(null);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleOnDrop = (e) => {
    e.preventDefault();
    setCandidatePhotoFile(URL.createObjectURL(e.dataTransfer.files[0]));
  };

  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const onCropChange = (crop) => {
    setCrop(crop);
  };
  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const postImage = async (image) => {
    const url = "/API/images";

    const fileOfBlob = new File([image], "image.jpg", { type: "image/jpeg" });
    const formData = new FormData();
    formData.append("file", fileOfBlob);
    const options = {
      method: "post",
      body: formData,
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    onApplyEditCandidate((candidate) => {
      candidate.photo_filename = data.photo_filename;
    });
    return true;
  };

  const saveImage = async () => {
    const image = await getCroppedImg(candidatePhotoFile, croppedAreaPixels);
    if (await postImage(image)) {
      setCandidatePhotoFile(null);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} scroll={"paper"} keepMounted>
      <DialogTitle> Edit Candidate </DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", alignItems: "center", m: 0, p: 1 }}
          >
            <TextField
              id={"candidate-name"}
              name="new-candidate-name"
              label={"Add Candidate"}
              type="text"
              value={candidate.candidate_name}
              fullWidth
              sx={{
                px: 0,
                boxShadow: 2,
              }}
              onChange={(e) =>
                onApplyEditCandidate((candidate) => {
                  candidate.candidate_name = e.target.value;
                })
              }
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: { sm: "row", xs: "column" },
              justifyContent: "flex-start",
              alignItems: "top",
            }}
          >
            {flags.isSet("CANDIDATE_PHOTOS") && (
              <>
                <Box>
                  {!candidatePhotoFile && (
                    <>
                      <Grid
                        item
                        className={
                          candidate.photo_filename
                            ? "filledPhotoContainer"
                            : "emptyPhotoContainer"
                        }
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          m: 0,
                          p: 1,
                          gap: 1,
                        }}
                      >
                        {/* NOTE: setting width in px is a bad habit, but I change the flex direction to column on smaller screens to account for this */}
                        <Box
                          display={"flex"}
                          flexDirection={"column"}
                          justifyContent={"center"}
                          alignItems={"center"}
                          height={"200px"}
                          minWidth={"200px"}
                          border={"4px dashed rgb(112,112,112)"}
                          sx={{ m: 0 }}
                          style={{ margin: "0 auto 0 auto" }}
                          onDragOver={handleDragOver}
                          onDrop={handleOnDrop}
                        >
                          {candidate.photo_filename && (
                            <img
                              src={candidate.photo_filename}
                              style={{
                                position: "absolute",
                                width: 200,
                                height: 200,
                              }}
                            />
                          )}
                          <Typography
                            variant="h6"
                            component="h6"
                            style={{ marginTop: 0 }}
                          >
                            Candidate Photo
                          </Typography>
                          <Typography
                            variant="h6"
                            component="h6"
                            sx={{ m: 0 }}
                            style={
                              candidate.photo_filename
                                ? { marginTop: "50px" }
                                : {}
                            }
                          >
                            Drag and Drop
                          </Typography>
                          <Typography variant="h6" component="h6" sx={{ m: 0 }}>
                            Or
                          </Typography>
                          <input
                            type="file"
                            onChange={(e) =>
                              setCandidatePhotoFile(
                                URL.createObjectURL(e.target.files[0]),
                              )
                            }
                            hidden
                            ref={inputRef}
                          />
                          {!candidate.photo_filename && (
                            <Button
                              variant="outlined"
                              className="selectPhotoButton"
                              onClick={() => inputRef.current.click()}
                            >
                              <Typography
                                variant="h6"
                                component="h6"
                                sx={{ m: 0 }}
                              >
                                Select File
                              </Typography>
                            </Button>
                          )}
                        </Box>
                        {candidate.photo_filename && (
                          <Button
                            variant="outlined"
                            className="selectPhotoButton"
                            onClick={() => inputRef.current.click()}
                            sx={{ p: 1 }}
                            style={{ margin: "0 auto 0 auto", width: "150px" }}
                          >
                            <Typography
                              variant="h6"
                              component="h6"
                              sx={{ m: 0 }}
                            >
                              Select File
                            </Typography>
                          </Button>
                        )}
                      </Grid>
                    </>
                  )}
                  {candidatePhotoFile && (
                    <Grid item xs={12} sx={{ m: 0, p: 1 }}>
                      <Box position="relative" width={"100%"} height={"300px"}>
                        <Cropper
                          image={candidatePhotoFile}
                          zoom={zoom}
                          crop={crop}
                          onCropChange={onCropChange}
                          onZoomChange={onZoomChange}
                          onCropComplete={onCropComplete}
                          aspect={1}
                        />
                      </Box>
                      <Button variant="outlined" onClick={() => saveImage()}>
                        <Typography variant="h6" component="h6">
                          Save
                        </Typography>
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setCandidatePhotoFile(null)}
                      >
                        <Typography variant="h6" component="h6">
                          Cancel
                        </Typography>
                      </Button>
                    </Grid>
                  )}
                </Box>
              </>
            )}
            <Box flexGrow="1" pl={{ sm: 1, xs: 3 }}>
              <Grid item xs={12} sx={{ m: 0, p: 1 }}>
                <TextField
                  id="long-name"
                  name="long name"
                  label="Full Name"
                  type="text"
                  fullWidth
                  value={candidate.full_name}
                  sx={{
                    m: 0,
                    p: 0,
                    boxShadow: 2,
                  }}
                  onChange={(e) =>
                    onApplyEditCandidate((candidate) => {
                      candidate.full_name = e.target.value;
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sx={{ m: 0, p: 1 }}>
                <TextField
                  id="bio"
                  name="bio"
                  label="Bio"
                  type="text"
                  rows={3}
                  multiline
                  fullWidth
                  value={candidate.bio}
                  sx={{
                    m: 0,
                    p: 0,
                    boxShadow: 2,
                  }}
                  onChange={(e) =>
                    onApplyEditCandidate((candidate) => {
                      candidate.bio = e.target.value;
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sx={{ m: 0, p: 1 }}>
                <TextField
                  id="candidate url"
                  name="candidate url"
                  label="Candidate URL"
                  type="url"
                  fullWidth
                  value={candidate.candidate_url}
                  sx={{
                    m: 0,
                    p: 0,
                    boxShadow: 2,
                  }}
                  onChange={(e) =>
                    onApplyEditCandidate((candidate) => {
                      candidate.candidate_url = e.target.value;
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sx={{ m: 0, p: 1 }}>
                <TextField
                  id="Party"
                  name="Party"
                  label="Party"
                  type="text"
                  fullWidth
                  value={candidate.party}
                  sx={{
                    m: 0,
                    p: 0,
                    boxShadow: 2,
                  }}
                  onChange={(e) =>
                    onApplyEditCandidate((candidate) => {
                      candidate.party = e.target.value;
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sx={{ m: 0, p: 1 }}>
                <TextField
                  id="party url"
                  name="party url"
                  label="Party URL"
                  type="url"
                  fullWidth
                  value={candidate.partyUrl}
                  sx={{
                    m: 0,
                    p: 0,
                    boxShadow: 2,
                  }}
                  onChange={(e) =>
                    onApplyEditCandidate((candidate) => {
                      candidate.partyUrl = e.target.value;
                    })
                  }
                />
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <StyledButton
          type="button"
          variant="contained"
          fullWidth={false}
          onClick={() => onSave()}
        >
          Close
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
};

export const CandidateForm = ({
  onEditCandidate,
  candidate,
  index,
  onDeleteCandidate,
  moveCandidateUp,
  moveCandidateDown,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSave = () => {
    handleClose();
  };

  return (
    <Paper elevation={4} sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          bgcolor: "background.paper",
          borderRadius: 10,
        }}
        alignItems={"center"}
      >
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
            pl: 2,
          }}
        >
          <Typography variant="h4" component="h4" noWrap>
            {candidate.candidate_name}
          </Typography>
        </Box>
        <IconButton aria-label="edit" onClick={moveCandidateUp}>
          <ArrowUpwardIcon />
        </IconButton>
        <IconButton aria-label="edit" onClick={moveCandidateDown}>
          <ArrowDownwardIcon />
        </IconButton>
        <IconButton aria-label="edit" onClick={handleOpen}>
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label="delete"
          color="error"
          onClick={onDeleteCandidate}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
      <CandidateDialog
        onEditCandidate={onEditCandidate}
        candidate={candidate}
        index={index}
        onSave={onSave}
        open={open}
        handleClose={handleClose}
      />
    </Paper>
  );
};

const AddCandidate = ({ onAddNewCandidate }) => {
  const handleEnter = (e) => {
    saveNewCandidate();
    e.preventDefault();
  };
  const saveNewCandidate = () => {
    if (newCandidateName.length > 0) {
      onAddNewCandidate(newCandidateName);
      setNewCandidateName("");
    }
  };

  const [newCandidateName, setNewCandidateName] = useState("");

  return (
    <Box
      sx={{ display: "flex", bgcolor: "background.paper", borderRadius: 10 }}
      alignItems={"center"}
    >
      <TextField
        id={"candidate-name"}
        name="new-candidate-name"
        label={"Add Candidate"}
        type="text"
        value={newCandidateName}
        fullWidth
        sx={{
          px: 0,
          boxShadow: 2,
        }}
        onChange={(e) => setNewCandidateName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleEnter(e);
          }
        }}
      />

      <Button onClick={() => saveNewCandidate()}>
        <Typography variant="h6" component="h6">
          {" "}
          Add{" "}
        </Typography>
      </Button>
    </Box>
  );
};

export default AddCandidate;
