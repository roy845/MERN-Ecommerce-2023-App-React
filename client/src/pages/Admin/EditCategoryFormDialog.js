import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import toast from "react-hot-toast";
const UPDATE_CATEGORY_URL = "/api/v1/category/update-category";
export default function EditCategoryFormDialog({
  visible,
  setVisible,
  selected,
  setSelected,
  getAllCategory,
}) {
  const [updatedName, setUpdatedName] = useState("");

  const handleClose = () => {
    setVisible(false);
  };

  //update category
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!updatedName) {
      toast.error("category name is required");
      return;
    }

    try {
      const { data } = await axios.put(
        `${UPDATE_CATEGORY_URL}/${selected._id}`,
        {
          name: updatedName,
        }
      );
      if (data?.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <Dialog open={visible} onClose={handleClose}>
        <DialogTitle>Edit</DialogTitle>
        <DialogContent>
          <DialogContentText>{`Edit ${selected.name}`}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Enter new Category"
            type="email"
            fullWidth
            variant="standard"
            onChange={(e) => setUpdatedName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdate} sx={{ color: "blue" }}>
            AGREE
          </Button>
          <Button onClick={handleClose} sx={{ color: "red" }}>
            DISAGREE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
