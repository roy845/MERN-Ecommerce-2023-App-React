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
const DELETE_PRODUCT_URL = "/api/v1/product/delete-product/";

export default function DeleteProductConfirmationDialog({
  open,
  setOpen,
  id,
  product,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  //delete product
  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(`${DELETE_PRODUCT_URL}${id}`);
      toast.success("Product deleted successfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Delete product Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Are you sure you want to delete ${product.name}`}
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
