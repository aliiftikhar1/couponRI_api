"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Backdrop,
  CircularProgress,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Toolbar,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useTable, useGlobalFilter, useSortBy, usePagination } from "react-table";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import axios from "axios";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import { useRouter } from "next/navigation";


const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const AddBlogs = () => {
  const editor = useRef(null);
  const [blogs, setBlogs] = useState([]);
  const [blogCategories, setBlogCategories] = useState([]); // For holding fetched blog categories
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [model, setModel] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSubmit, setSnackbarSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [deleteSuccessSnackbar, setDeleteSuccessSnackbar] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    id: null,
  });

  const handleDelete = (row) => {
    if (row && row.id) {
      setDeleteConfirmation({ open: true, id: row.id });
    } else {
      console.error("Invalid Blog for deletion");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/api/blog/${deleteConfirmation.id}`);
      setDeleteSuccessSnackbar(true);
      setTimeout(() => {
        setDeleteSuccessSnackbar(false);
      }, 5000);

      const updatedBlogs = blogs.filter((blog) => blog.id !== deleteConfirmation.id);
      setBlogs(updatedBlogs);
    } catch (error) {
      console.error("Error deleting blog:", error.message);
    } finally {
      setDeleteConfirmation({ open: false, id: null });
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ open: false, id: null });
  };

  const modelClose = () => {
    setModel(false);
    setFormData({
      id: "",
      title: "",
      description: "",
      image: "",
      category: [],
      meta_title: "",
      meta_description: "",
      meta_focusKeyword: "",
      web_slug: "",
    });
  };

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    image: "",
    category: [], // Now an array for multiple categories
    meta_title: "",
    meta_description: "",
    meta_focusKeyword: "",
    web_slug: "",
  });
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (editingBlog) {
      setEditingBlog({
        ...editingBlog,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const uploadImageToExternalAPI = async (imageBase64) => {
    try {
      const response = await fetch("https://m3xtrader.com/coupon/uploadImage.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageBase64 }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload image");
      }

      return result.image_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    setLoading(true); // Show loading overlay

    if (
      !formData.title ||
      !formData.description ||
      !formData.image ||
      formData.category.length === 0 || // Check for empty categories
      !formData.meta_title ||
      !formData.meta_description ||
      !formData.meta_focusKeyword ||
      !formData.web_slug
    ) {
      setSnackbarSubmit(true);
      setTimeout(() => {
        setSnackbarSubmit(false);
      }, 5000);
      setLoad(false);
      setLoading(false); // Hide loading overlay
      return;
    }

    try {
      const imageBase64 = await convertToBase64(formData.image);
      const uploadedImageUrl = await uploadImageToExternalAPI(imageBase64);

      // Convert category array to comma-separated string
      const blogToSubmit = {
        ...formData,
        image: uploadedImageUrl,
        category: formData.category.join(", "), // Convert categories to a comma-separated string
      };

      await axios.post(`/api/blog`, blogToSubmit);
      toast.success("Blog has been added successfully!");
      setLoad(false);
      setLoading(false); // Hide loading overlay
      modelClose();
      
      window.location.reload();
    } catch (error) {
      console.error("Error occurred during submission", error);
      setLoad(false);
      setLoading(false); // Hide loading overlay
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoad(true);
    setLoading(true); // Show loading overlay

    try {
      let uploadedImageUrl = editingBlog.image;

      if (editingBlog.image instanceof File) {
        const imageBase64 = await convertToBase64(editingBlog.image);
        uploadedImageUrl = await uploadImageToExternalAPI(imageBase64);
      }

      // Convert category array to comma-separated string
      const blogToUpdate = {
        ...editingBlog,
        image: uploadedImageUrl,
        category: editingBlog.category.join(", "), // Convert categories to a comma-separated string
      };

      await axios.put(`/api/blog/${editingBlog.id}`, blogToUpdate);

      toast.success("Blog has been updated successfully!");
      setLoad(false);
      setLoading(false); // Hide loading overlay
      handleClose();
      fetchBlogs();
    } catch (error) {
      console.error("Error occurred while updating the data:", error);
      toast.error("Failed to update the blog");
      setLoad(false);
      setLoading(false); // Hide loading overlay
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!(file instanceof Blob)) {
        reject(new Error("Provided value is not a file or blob"));
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (editingBlog) {
        setEditingBlog({
          ...editingBlog,
          image: file,
        });
      } else {
        setFormData({
          ...formData,
          image: file,
        });
      }
    }
  };

  const handleOpen = (blog) => {
    setEditingBlog(blog);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBlog(null);
  };

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`/api/blog`);
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      setError("Error fetching blogs: " + error.message);
    }
  };

  const router = useRouter();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      alert("Login to see the dashboard!");
      router.push("/admin");
    } else {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role);
    }
  }, [router]);

  useEffect(() => {
    const fetchBlogCategories = async () => {
      try {
        const response = await fetch(`/api/blogcategory`);
        if (!response.ok) {
          throw new Error("Failed to fetch blog categories");
        }
        const categories = await response.json();
        setBlogCategories(categories);
      } catch (error) {
        console.error("Error fetching blog categories:", error);
      }
    };

    fetchBlogs();
    fetchBlogCategories();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value }) => {
          return (
            <div
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "normal",
              }}
            >
              {value}
            </div>
          );
        },
      },
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ value }) => {
          return (
            <img
              src={`https://m3xtrader.com/coupon/uploads/${value.trim()}`}
              alt="Blog Image"
              style={{ maxWidth: "50px", maxHeight: "50px" }}
            />
          );
        },
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: ({ value }) => {
          if (!value) {
            return "Unknown";
          }
      
          // Split the comma-separated string into an array
          const categoriesArray = value.split(",").map((cat) => cat.trim());
      
          // Find matching titles in the blogCategories list
          const categoryTitles = categoriesArray
            .map((category) => {
              const foundCategory = blogCategories.find((cat) => cat.title === category);
              return foundCategory ? foundCategory.title : "Unknown";
            })
            .filter((title) => title !== "Unknown") // Optionally, filter out unknown categories
            .join(", "); // Join them back into a string
      
          return categoryTitles || "Unknown";
        },
      },
      
      {
        Header: "Action",
        accessor: "updateButton",
        Cell: ({ row }) => (
          <div className="flex gap-6">
            <FaUserEdit
              onClick={() => handleOpen(row.original)}
              style={{
                fontSize: "26px",
                color: "#006a5c",
                paddingRight: "6px",
                cursor: "pointer",
              }}
            />
            {userRole !== "sub admin" && (
              <MdDeleteForever
                onClick={() => handleDelete(row.original)}
                style={{ fontSize: "26px", color: "#b03f37", cursor: "pointer" }}
              />
            )}
          </div>
        ),
      },
    ],
    [blogCategories, userRole]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    gotoPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data: blogs,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { pageIndex, pageSize, globalFilter } = state;

  return (
    <Box sx={{ padding: 3 }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading} // Show backdrop when loading is true
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Toolbar>
          <TextField
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value || undefined)}
            placeholder="Search"
            variant="outlined"
            size="small"
          />
        </Toolbar>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModel(true)}
          sx={{
            backgroundColor: "#E3B505",
            color: "black",
            ":hover": {
              backgroundColor: "#d3a004",
            },
          }}
        >
          ADD New Blog
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column) => (
                  <TableCell
                    key={column.id}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    sx={{
                      fontWeight: "bold",
                      color: "#333",
                      borderBottom: "2px solid #E3B505",
                    }}
                  >
                    {column.render("Header")}
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <TableRow key={row.id} {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
            {page.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No blogs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: "All", value: blogs.length }]}
        colSpan={5}
        count={blogs.length}
        rowsPerPage={pageSize}
        page={pageIndex}
        showLastButton
        showFirstButton
        onPageChange={(event, newPage) => gotoPage(newPage)}
        onRowsPerPageChange={(event) => setPageSize(Number(event.target.value))}
      />

      {/* Add Blog Dialog */}
      <Dialog
        open={model}
        onClose={modelClose}
        maxWidth="xl"
        fullWidth
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableEnforceFocus
      >
        <DialogTitle>
          <Typography variant="h6">New Blog</Typography>
          <IconButton
            aria-label="close"
            onClick={modelClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <JoditEditor
                  ref={editor}
                  value={formData.description}
                  tabIndex={1}
                  onBlur={(newContent) =>
                    setFormData({
                      ...formData,
                      description: newContent,
                    })
                  }
                  onChange={() => {}}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Categories</InputLabel>
                  <Select
                    name="category"
                    multiple
                    value={Array.isArray(formData.category) ? formData.category : []}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        category: e.target.value, // Ensure it's an array
                      });
                    }}
                    label="Categories"
                    renderValue={(selected) => {
                      if (Array.isArray(selected)) {
                        return selected.join(", ");
                      }
                      return ""; // Fallback for empty or invalid selection
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Categories</em>
                    </MenuItem>
                    {blogCategories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.title}>
                        {cat.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Meta Title"
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Meta Description"
                  type="text"
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Meta Keyword"
                  type="text"
                  name="meta_focusKeyword"
                  value={formData.meta_focusKeyword}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Slug"
                  type="text"
                  name="web_slug"
                  value={formData.web_slug}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  Upload Image:
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleImageChange}
                  style={{ display: "block", marginTop: "10px" }}
                />
                {formData.image && (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Uploaded"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      marginTop: "10px",
                    }}
                  />
                )}
              </Grid>
            </Grid>
            <DialogActions>
              <Button
                type="submit"
                disabled={load}
                variant="contained"
                sx={{
                  backgroundColor: "#E3B505",
                  color: "black",
                  ":hover": {
                    backgroundColor: "#d3a004",
                  },
                }}
              >
                {`${load ? "Loading...." : "Save"}`}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Blog Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xl"
        fullWidth
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableEnforceFocus
      >
        <DialogTitle>
          <Typography variant="h6">Edit Blog</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {editingBlog && (
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Title"
                    name="title"
                    value={editingBlog.title}
                    fullWidth
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <JoditEditor
                    ref={editor}
                    value={editingBlog.description}
                    tabIndex={1}
                    onBlur={(newContent) =>
                      setEditingBlog({
                        ...editingBlog,
                        description: newContent,
                      })
                    }
                    onChange={() => {}}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Categories</InputLabel>
                    <Select
                      name="category"
                      multiple
                      value={Array.isArray(editingBlog?.category) ? editingBlog.category : []}
                      onChange={(e) => {
                        setEditingBlog({
                          ...editingBlog,
                          category: e.target.value, // Ensure it's an array
                        });
                      }}
                      label="Categories"
                      renderValue={(selected) => {
                        if (Array.isArray(selected)) {
                          return selected.join(", ");
                        }
                        return ""; // Fallback for empty or invalid selection
                      }}
                    >
                      <MenuItem value="">
                        <em>Select Categories</em>
                      </MenuItem>
                      {blogCategories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.title}>
                          {cat.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Meta Title"
                    type="text"
                    name="meta_title"
                    value={editingBlog.meta_title}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Meta Description"
                    type="text"
                    name="meta_description"
                    value={editingBlog.meta_description}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Meta Keyword"
                    type="text"
                    name="meta_focusKeyword"
                    value={editingBlog.meta_focusKeyword}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Slug"
                    type="text"
                    name="web_slug"
                    value={editingBlog.web_slug}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Upload Image:
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleImageChange}
                    style={{ display: "block", marginTop: "10px" }}
                  />
                  {editingBlog.image && (
                    <img
                      src={
                        editingBlog.image instanceof File
                          ? URL.createObjectURL(editingBlog.image)
                          : `https://m3xtrader.com/coupon/uploads/${editingBlog.image}`
                      }
                      alt="Uploaded"
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                        marginTop: "10px",
                      }}
                    />
                  )}
                </Grid>
              </Grid>
              <DialogActions>
                <Button
                  variant="contained"
                  onClick={handleEdit}
                  disabled={loading}
                  sx={{
                    backgroundColor: "#E3B505",
                    color: "black",
                    ":hover": {
                      backgroundColor: "#d3a004",
                    },
                    mt: 2,
                    width: "100%",
                  }}
                >
                  {`${loading ? "Loading...." : "Save"}`}
                </Button>
              </DialogActions>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">Blog saved successfully!</Alert>
      </Snackbar>
      <Snackbar
        open={snackbarSubmit}
        autoHideDuration={5000}
        onClose={() => setSnackbarSubmit(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error">Please fill in all the required fields.</Alert>
      </Snackbar>
      <Snackbar
        open={deleteSuccessSnackbar}
        autoHideDuration={5000}
        onClose={() => setDeleteSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="warning">Blog successfully deleted!</Alert>
      </Snackbar>

      <Dialog
        open={deleteConfirmation.open}
        onClose={handleCancelDelete}
        aria-labelledby="delete-confirmation-title"
        aria-describedby="delete-confirmation-description"
      >
        <DialogTitle id="delete-confirmation-title">
          <Typography variant="h6">Confirm Deletion</Typography>
        </DialogTitle>
        <DialogContent>
          {deleteConfirmation.id && (
            <Typography variant="body1">
              Are you sure you want to delete the blog with ID{" "}
              {deleteConfirmation.id}?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddBlogs;
