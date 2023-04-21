import React from "react";
import EditCategoryFormDialog from "./EditCategoryFormDialog";
import DeleteCategoryConfirmationDialog from "./DeleteCategoryConfirmationDialog";

const CatogryTable = ({
  categories,
  setVisible,
  setUpdatedName,
  selected,
  setSelected,
  handleDelete,
  handleEdit,
  visible,
  getAllCategory,
  visibleDeleteCategoryDialog,
  setVisibleDeleteCategoryDialog,
}) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {categories?.map((c) => (
          <>
            <tr>
              <td key={c._id}>{c.name}</td>
              <td>
                <button
                  className="btn btn-primary ms-2"
                  onClick={() => {
                    setVisible(true);
                    setSelected(c);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger ms-2"
                  onClick={() => {
                    setVisibleDeleteCategoryDialog(true);
                    setSelected(c);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
            {visible && (
              <EditCategoryFormDialog
                visible={visible}
                setVisible={setVisible}
                selected={selected}
                setSelected={setSelected}
                getAllCategory={getAllCategory}
              />
            )}

            {visibleDeleteCategoryDialog && (
              <DeleteCategoryConfirmationDialog
                visibleDeleteCategoryDialog={visibleDeleteCategoryDialog}
                setVisibleDeleteCategoryDialog={setVisibleDeleteCategoryDialog}
                selected={selected}
                getAllCategory={getAllCategory}
              />
            )}
          </>
        ))}
      </tbody>
    </table>
  );
};

export default CatogryTable;
