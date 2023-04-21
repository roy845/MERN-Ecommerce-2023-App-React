import { ReactComponent as Loader } from "../assets/icons/loader.svg";
import "../styles/loadingButtonStyles.css";

const LoadingButton = ({ onClick, text, loading = false, disabled }) => {
  return (
    <button className="submit-btn" onClick={onClick} disabled={disabled}>
      {!loading ? text : <Loader className="spinner" />}
    </button>
  );
};

export default LoadingButton;
