import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
const DELETE_CATEGORY_URL = "/api/v1/category/delete-category";

export default function DeleteCategoryConfirmationDialog({
  open,
  setOpen,
  selected,
  getAllCategory,
  visibleDeleteCategoryDialog,
  setVisibleDeleteCategoryDialog,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  //delete category
  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        `${DELETE_CATEGORY_URL}/${selected._id}`
      );
      if (data?.success) {
        toast.success(`category is deleted`);
        setVisibleDeleteCategoryDialog(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleClose = () => {
    setVisibleDeleteCategoryDialog(false);
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={visibleDeleteCategoryDialog}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Delete category Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Are you sure you want to delete ${selected.name}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} sx={{ color: "red" }}>
            Disagree
          </Button>
          <Button onClick={handleDelete} autoFocus sx={{ color: "blue" }}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
