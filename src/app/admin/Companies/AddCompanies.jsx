"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Toolbar,
  Button,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Box,
  Typography,
  TextField,
  IconButton,
  Grid,
  Backdrop,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import JoditEditor from "jodit-react";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import axios from "axios";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";

const AddCompanies = () => {
  const editor = useRef(null);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false); // For Edit Dialog
  const [editingCompany, setEditingCompany] = useState(null);
  const [model, setModel] = useState(false); // For Add Dialog
  const [snackbarSubmit, setSnackbarSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteSuccessSnackbar, setDeleteSuccessSnackbar] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    id: null,
  });

  // Fetch categories, companies, and offers
  const fetchCategoriesCompaniesAndOffers = async () => {
    try {
      const [categoriesResponse, companiesResponse, offersResponse] = await Promise.all([
        fetch(`/api/category`),
        fetch(`/api/company`),
        fetch(`/api/offers`),
      ]);

      if (!categoriesResponse.ok || !companiesResponse.ok || !offersResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const categoriesData = await categoriesResponse.json();
      const companiesData = await companiesResponse.json();
      const offersData = await offersResponse.json();

      // Convert category IDs to strings for consistency
      const processedCategoriesData = categoriesData.map((category) => ({
        ...category,
        id: category.id.toString(),
      }));

      // Process companies' comp_category into array of strings
      const processedCompaniesData = companiesData.map((company) => ({
        ...company,
        comp_category: company.comp_category
          ? company.comp_category.split(",").map((cat) => cat.trim())
          : [],
      }));

      setCategories(processedCategoriesData);
      setCompanies(processedCompaniesData);
      setOffers(offersData);
    } catch (error) {
      setError("Error fetching data: " + error.message);
      toast.error("Error fetching data.");
    }
  };

  useEffect(() => {
    fetchCategoriesCompaniesAndOffers();
  }, []);

  // Count offers for a company
  const countOffersForCompany = (companyId) => {
    return offers.filter((offer) => offer.comp_id === companyId).length;
  };

  // Count expired offers for a company
  const countExpiredOffersForCompany = (companyId) => {
    const currentDate = new Date();
    return offers.filter((offer) => offer.comp_id === companyId && new Date(offer.expiry_date) < currentDate).length;
  };

  // Handle Delete
  const handleDelete = (row) => {
    if (row && row.id) {
      setDeleteConfirmation({ open: true, id: row.id });
    } else {
      console.error("Invalid Company for deletion");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`/api/company/${deleteConfirmation.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeleteSuccessSnackbar(true);
        setTimeout(() => {
          setDeleteSuccessSnackbar(false);
        }, 5000);

        const updatedCompanies = companies.filter(
          (company) => company.id !== deleteConfirmation.id
        );
        setCompanies(updatedCompanies);
        toast.success("Company successfully deleted!");
      } else {
        console.error("Failed to delete company");
        toast.error("Failed to delete the company.");
      }
    } catch (error) {
      console.error("Error deleting company:", error.message);
      toast.error("Error deleting the company.");
    } finally {
      setDeleteConfirmation({ open: false, id: null });
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ open: false, id: null });
  };

  // Handle Close Add Dialog
  const modelClose = () => {
    setModel(false);
    setFormData({
      id: "",
      com_title: "",
      comp_logo: null,
      comp_category: [],
      comp_description: "",
      comp_phone: "",
      comp_email: "",
      comp_website: "",
      comp_rating: "",
      com_details: "",
      company_details: "",
      other_details: "",
      meta_title: "",
      meta_description: "",
      meta_focusKeyword: "",
      web_slug: "",
      comp_webtitle: "",
      comp_status: "Featured", // Reset comp_status
    });
  };

  // Form Data State
  const [formData, setFormData] = useState({
    id: "",
    com_title: "",
    comp_logo: null,
    comp_category: [],
    comp_description: "",
    comp_phone: "",
    comp_email: "",
    comp_website: "",
    comp_rating: "",
    com_details: "",
    company_details: "",
    other_details: "",
    meta_title: "",
    meta_description: "",
    meta_focusKeyword: "",
    web_slug: "",
    comp_webtitle: "",
    comp_status: "Featured", // Add comp_status
  });

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "comp_category") {
      const selectedValues = Array.isArray(value)
        ? value
        : typeof value === "string"
        ? value.split(",")
        : [value];
      if (editingCompany) {
        setEditingCompany({
          ...editingCompany,
          [name]: selectedValues,
        });
      } else {
        setFormData({
          ...formData,
          [name]: selectedValues,
        });
      }
    } else {
      if (editingCompany) {
        setEditingCompany({
          ...editingCompany,
          [name]: value,
        });
      } else {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    }
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (editingCompany) {
        setEditingCompany({
          ...editingCompany,
          comp_logo: file,
        });
      } else {
        setFormData({
          ...formData,
          comp_logo: file,
        });
      }
    }
  };

  // Upload Image to External API
  const uploadImageToExternalAPI = async (imageBase64) => {
    try {
      const response = await fetch(
        "https://m3xtrader.com/coupon/uploadImage.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: imageBase64 }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload image");
      }
      console.log("Image Url is: ", result.image_url);

      return result.image_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Image upload failed");
    }
  };

  // Convert File to Base64
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

  // Handle Form Submission for Adding Company
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.com_title ||
      !formData.comp_logo ||
      formData.comp_category.length === 0
    ) {
      setSnackbarSubmit(true);
      setTimeout(() => {
        setSnackbarSubmit(false);
      }, 5000);
      setLoading(false);
      return;
    }

    try {
      const imageBase64 = await convertToBase64(formData.comp_logo);
      const uploadedImageUrl = await uploadImageToExternalAPI(imageBase64);

      const companyToSubmit = {
        ...formData,
        comp_logo: uploadedImageUrl,
        comp_category: formData.comp_category.join(","),
        meta_focusKeyword: formData.meta_focusKeyword,
        web_slug: formData.web_slug,
        comp_details: formData.company_details,
        comp_other_details: formData.other_details,
      };
      console.log("Company to Submit ", companyToSubmit);

      await axios.post(`/api/company`, companyToSubmit);
      toast.success("Company has been added successfully!");
      modelClose();
      fetchCategoriesCompaniesAndOffers();
    } catch (error) {
      console.error("Error occurred during submission", error);
      toast.error("Error adding the company.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Form Submission for Editing Company
  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedImageUrl = editingCompany.comp_logo;

      if (editingCompany.comp_logo instanceof File) {
        const imageBase64 = await convertToBase64(editingCompany.comp_logo);
        uploadedImageUrl = await uploadImageToExternalAPI(imageBase64);
      }

      const companyToUpdate = {
        ...editingCompany,
        comp_logo: uploadedImageUrl,
        comp_category: editingCompany.comp_category.join(","),
        meta_focusKeyword: editingCompany.meta_focusKeyword,
        web_slug: editingCompany.web_slug,
        comp_details: editingCompany.company_details,
        comp_other_details: editingCompany.other_details,
      };
      console.log("Company to Update ", companyToUpdate);

      await axios.put(`/api/company/${editingCompany.id}`, companyToUpdate);
      toast.success("Company has been updated successfully!");
      handleClose();
      fetchCategoriesCompaniesAndOffers();
    } catch (error) {
      console.error("Error occurred while updating the data:", error);
      toast.error("Failed to update the company.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Opening Edit Dialog
  const handleOpen = (company) => {
    setEditingCompany({
      ...company,
      company_details: company.comp_details,
      comp_category: company.comp_category,
      other_details: company.comp_other_details,
      meta_title: company.meta_title || "",
      meta_description: company.meta_description || "",
      meta_focusKeyword: company.meta_focusKeyword || "",
      web_slug: company.web_slug || "",
      comp_webtitle: company.comp_webtitle || "",
      comp_status: company.comp_status || "Featured", // Set comp_status in editingCompany
    });
    setOpen(true);
  };

  // Handle Closing Edit Dialog
  const handleClose = () => {
    setOpen(false);
    setEditingCompany(null);
  };

  // Define Table Columns
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Company Name",
        accessor: "com_title",
      },
      {
        Header: "Category",
        accessor: "comp_category",
        Cell: ({ value }) => {
          if (!value || value.length === 0) return "No categories";
          const categoryNames = value.map((categoryId) => {
            const category = categories.find((c) => c.id === categoryId);
            return category ? category.category_name : "Unknown";
          });
          return categoryNames.join(", ");
        },
      },
      {
        Header: "Logo",
        accessor: "comp_logo",
        Cell: ({ value }) => (
          <img
            src={`https://m3xtrader.com/coupon/uploads/${value.trim()}`}
            alt="Company Logo"
            style={{ maxWidth: "50px", maxHeight: "50px" }}
          />
        ),
      },
      {
        Header: "Number of Offers", // Display number of offers
        accessor: "num_offers",
        Cell: ({ row }) => {
          const offersCount = countOffersForCompany(row.original.id);
          return offersCount ? offersCount : "No offers";
        },
      },
      {
        Header: "Expired Offers", // Display expired offers
        accessor: "num_expired_offers",
        Cell: ({ row }) => {
          const expiredOffersCount = countExpiredOffersForCompany(row.original.id);
          return expiredOffersCount ? expiredOffersCount : "No expired offers";
        },
      },
      {
        Header: "Affiliate Link",
        accessor: "comp_affiliateLink",
      },
      {
        Header: "Status", // Display status
        accessor: "comp_status",
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
            <MdDeleteForever
              onClick={() => handleDelete(row.original)}
              style={{
                fontSize: "26px",
                color: "#b03f37",
                cursor: "pointer",
              }}
            />
          </div>
        ),
      },
    ],
    [categories, offers]
  );

  // Initialize React Table
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
      data: companies,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { pageIndex, pageSize, globalFilter } = state;

  return (
    <Box sx={{ padding: 3 }}>
      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Toolbar with Search and Add Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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
          ADD New
        </Button>
      </Box>

      {/* Companies Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
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
                    {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
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
            {/* Display message when no companies are found */}
            {page.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No companies found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: "All", value: companies.length || 1 }]}
        colSpan={5}
        count={companies.length}
        rowsPerPage={pageSize}
        page={pageIndex}
        showLastButton
        showFirstButton
        onPageChange={(event, newPage) => gotoPage(newPage)}
        onRowsPerPageChange={(event) => setPageSize(Number(event.target.value))}
      />

      {/* Add Company Dialog */}
      <Dialog
        open={model}
        onClose={modelClose}
        maxWidth="md"
        fullWidth
        aria-labelledby="add-company-title"
        aria-describedby="add-company-description"
      >
        <DialogTitle>
          <Typography variant="h6">New Company</Typography>
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
              {/* Company Name */}
              <Grid item xs={12}>
                <TextField
                  label="Company Name"
                  name="com_title"
                  value={formData.com_title}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>

              {/* Category Selection */}
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    multiple
                    name="comp_category"
                    value={formData.comp_category}
                    onChange={handleInputChange}
                    label="Category"
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <em>Select Category</em>;
                      }
                      return categories
                        .filter((category) => selected.includes(category.id))
                        .map((category) => category.category_name)
                        .join(", ");
                    }}
                  >
                    <MenuItem disabled value="">
                      <em>Select Category</em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.category_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Status Selection */}
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="comp_status"
                    value={formData.comp_status}
                    onChange={handleInputChange}
                    label="Status"
                  >
                    <MenuItem value="Featured">Featured</MenuItem>
                    <MenuItem value="Trending">Trending</MenuItem>
                    <MenuItem value="Top Rated">Top Rated</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="comp_description"
                  value={formData.comp_description}
                  fullWidth
                  onChange={handleInputChange}
                  variant="outlined"
                  multiline
                  rows={3}
                  required
                />
              </Grid>

              {/* Phone Number */}
              <Grid item xs={12}>
                <TextField
                  label="Phone Number"
                  name="comp_phone"
                  value={formData.comp_phone}
                  fullWidth
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="comp_email"
                  value={formData.comp_email}
                  fullWidth
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>

              {/* Website */}
              <Grid item xs={12}>
                <TextField
                  label="Website"
                  name="comp_website"
                  value={formData.comp_website}
                  fullWidth
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>

              {/* Rating */}
              <Grid item xs={12}>
                <TextField
                  label="Rating"
                  name="comp_rating"
                  value={formData.comp_rating}
                  fullWidth
                  onChange={handleInputChange}
                  variant="outlined"
                  type="number"
                  inputProps={{ min: 0, max: 5, step: 0.1 }}
                />
              </Grid>

              {/* Meta Title */}
              <Grid item xs={12}>
                <TextField
                  label="Meta Title"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              {/* Meta Description */}
              <Grid item xs={12}>
                <TextField
                  label="Meta Description"
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={3}
                />
              </Grid>

              {/* Slug */}
              <Grid item xs={12}>
                <TextField
                  label="Slug"
                  name="web_slug"
                  value={formData.web_slug}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              {/* Meta Keyword */}
              <Grid item xs={12}>
                <TextField
                  label="Meta Keyword"
                  name="meta_focusKeyword"
                  value={formData.meta_focusKeyword}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              {/* Web Title */}
              <Grid item xs={12}>
                <TextField
                  label="Web Title"
                  name="comp_webtitle"
                  value={formData.comp_webtitle}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              {/* Company Details */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Company Details
                </Typography>
                <JoditEditor
                  ref={editor}
                  value={formData.company_details}
                  tabIndex={1}
                  onBlur={(newContent) =>
                    setFormData({
                      ...formData,
                      company_details: newContent,
                    })
                  }
                  onChange={(newContent) =>
                    setFormData({
                      ...formData,
                      company_details: newContent,
                    })
                  }
                />
              </Grid>

              {/* Other Details */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Other Details
                </Typography>
                <JoditEditor
                  ref={editor}
                  value={formData.other_details}
                  tabIndex={1}
                  onBlur={(newContent) =>
                    setFormData({
                      ...formData,
                      other_details: newContent,
                    })
                  }
                  onChange={(newContent) =>
                    setFormData({
                      ...formData,
                      other_details: newContent,
                    })
                  }
                />
              </Grid>

              {/* Upload Image */}
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  Upload Image:
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  name="imgurl"
                  onChange={handleImageChange}
                  style={{ display: "block", marginTop: "10px" }}
                  required
                />
                {formData.comp_logo && (
                  <img
                    src={URL.createObjectURL(formData.comp_logo)}
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
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: "#E3B505",
                  color: "black",
                  ":hover": {
                    backgroundColor: "#d3a004",
                  },
                }}
              >
                {loading ? "Loading..." : "Save"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Company Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        aria-labelledby="edit-company-title"
        aria-describedby="edit-company-description"
      >
        <DialogTitle>
          <Typography variant="h6">Edit Company Data</Typography>
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
          {editingCompany && (
            <form onSubmit={handleEdit}>
              <Grid container spacing={2}>
                {/* Company Name */}
                <Grid item xs={12}>
                  <TextField
                    label="Company Name"
                    name="com_title"
                    value={editingCompany.com_title}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    required
                  />
                </Grid>

                {/* Category Selection */}
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      multiple
                      name="comp_category"
                      value={editingCompany.comp_category}
                      onChange={handleInputChange}
                      label="Category"
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return <em>Select Category</em>;
                        }
                        return categories
                          .filter((category) =>
                            selected.includes(category.id)
                          )
                          .map((category) => category.category_name)
                          .join(", ");
                      }}
                    >
                      <MenuItem disabled value="">
                        <em>Select Category</em>
                      </MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.category_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Status Selection */}
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="comp_status"
                      value={editingCompany.comp_status}
                      onChange={handleInputChange}
                      label="Status"
                    >
                      <MenuItem value="Featured">Featured</MenuItem>
                      <MenuItem value="Trending">Trending</MenuItem>
                      <MenuItem value="Top Rated">Top Rated</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    name="comp_description"
                    value={editingCompany.comp_description}
                    fullWidth
                    onChange={handleInputChange}
                    variant="outlined"
                    multiline
                    rows={3}
                    required
                  />
                </Grid>

                {/* Phone Number */}
                <Grid item xs={12}>
                  <TextField
                    label="Phone Number"
                    name="comp_phone"
                    value={editingCompany.comp_phone}
                    fullWidth
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="comp_email"
                    value={editingCompany.comp_email}
                    fullWidth
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>

                {/* Website */}
                <Grid item xs={12}>
                  <TextField
                    label="Website"
                    name="comp_website"
                    value={editingCompany.comp_website}
                    fullWidth
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>

                {/* Rating */}
                <Grid item xs={12}>
                  <TextField
                    label="Rating"
                    name="comp_rating"
                    value={editingCompany.comp_rating}
                    fullWidth
                    onChange={handleInputChange}
                    variant="outlined"
                    type="number"
                    inputProps={{ min: 0, max: 5, step: 0.1 }}
                  />
                </Grid>

                {/* Meta Title */}
                <Grid item xs={12}>
                  <TextField
                    label="Meta Title"
                    name="meta_title"
                    value={editingCompany.meta_title}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                {/* Meta Description */}
                <Grid item xs={12}>
                  <TextField
                    label="Meta Description"
                    name="meta_description"
                    value={editingCompany.meta_description}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={3}
                  />
                </Grid>

                {/* Slug */}
                <Grid item xs={12}>
                  <TextField
                    label="Slug"
                    name="web_slug"
                    value={editingCompany.web_slug}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                {/* Meta Keyword */}
                <Grid item xs={12}>
                  <TextField
                    label="Meta Keyword"
                    name="meta_focusKeyword"
                    value={editingCompany.meta_focusKeyword}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                {/* Web Title */}
                <Grid item xs={12}>
                  <TextField
                    label="Web Title"
                    name="comp_webtitle"
                    value={editingCompany.comp_webtitle}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                {/* Company Details */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Company Details
                  </Typography>
                  <JoditEditor
                    ref={editor}
                    value={editingCompany.company_details}
                    tabIndex={1}
                    onBlur={(newContent) =>
                      setEditingCompany({
                        ...editingCompany,
                        company_details: newContent,
                      })
                    }
                    onChange={(newContent) =>
                      setEditingCompany({
                        ...editingCompany,
                        company_details: newContent,
                      })
                    }
                  />
                </Grid>

                {/* Other Details */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Other Details
                  </Typography>
                  <JoditEditor
                    ref={editor}
                    value={editingCompany.other_details}
                    tabIndex={1}
                    onBlur={(newContent) =>
                      setEditingCompany({
                        ...editingCompany,
                        other_details: newContent,
                      })
                    }
                    onChange={(newContent) =>
                      setEditingCompany({
                        ...editingCompany,
                        other_details: newContent,
                      })
                    }
                  />
                </Grid>

                {/* Upload Image */}
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Upload Image:
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    name="imgurl"
                    onChange={handleImageChange}
                    style={{ display: "block", marginTop: "10px" }}
                  />
                  {editingCompany.comp_logo && (
                    <img
                      src={
                        editingCompany.comp_logo instanceof File
                          ? URL.createObjectURL(editingCompany.comp_logo)
                          : `https://m3xtrader.com/coupon/uploads/${editingCompany.comp_logo}`
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
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    backgroundColor: "#E3B505",
                    color: "black",
                    ":hover": {
                      backgroundColor: "#d3a004",
                    },
                    width: "100%",
                  }}
                >
                  {loading ? "Loading..." : "Save"}
                </Button>
              </DialogActions>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbars */}
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
        <Alert severity="warning">Company successfully deleted!</Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
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
              Are you sure you want to delete the company with ID{" "}
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

export default AddCompanies;
