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
import { useTable, useGlobalFilter, useSortBy, usePagination } from "react-table";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import { useRouter } from "next/navigation";

const AddCompanies = () => {
  const editor = useRef(null);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
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
      } else {
        console.error("Failed to delete company");
      }
    } catch (error) {
      console.error("Error deleting company:", error.message);
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
      com_title: "",
      comp_logo: "",
      comp_category: "",
      comp_description: "",
      comp_phone: "",
      comp_email: "",
      comp_website: "",
      comp_rating: "",
      com_details: "",
      comp_details: "",
      comp_other_details: "",
      meta_title: "",
      meta_description: "",
      meta_focusKeyword: "",
      web_slug: "",
      comp_affiliateLink: "",
    });
  };

  const [formData, setFormData] = useState({
    id: "",
    com_title: "",
    comp_logo: "",
    comp_category: "",
    comp_description: "",
    comp_phone: "",
    comp_email: "",
    comp_website: "",
    comp_rating: "",
    com_details: "",
    comp_details: "",
    comp_other_details: "",
    meta_title: "",
    meta_description: "",
    meta_focusKeyword: "",
    web_slug: "",
    comp_affiliateLink: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    setLoading(true);

    if (!formData.com_title || !formData.comp_logo || !formData.comp_category) {
      setSnackbarSubmit(true);
      setTimeout(() => {
        setSnackbarSubmit(false);
      }, 5000);
      setLoad(false);
      setLoading(false);
      return;
    }

    try {
      const imageBase64 = await convertToBase64(formData.comp_logo);
      const uploadedImageUrl = await uploadImageToExternalAPI(imageBase64);

      const companyToSubmit = {
        ...formData,
        comp_logo: uploadedImageUrl,
      };

      await axios.post(`/api/company`, companyToSubmit);
      toast.success("Company has been added successfully!");
      setLoad(false);
      setLoading(false);
      modelClose();
      fetchData();
    } catch (error) {
      console.error("Error occurred during submission", error);
      setLoad(false);
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoad(true);
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
      };

      await axios.put(`/api/company/${editingCompany.id}`, companyToUpdate);
      toast.success("Company has been updated successfully!");
      setLoad(false);
      setLoading(false);
      handleClose();
      fetchData();
    } catch (error) {
      console.error("Error occurred while updating the data:", error);
      toast.error("Failed to update the company");
      setLoad(false);
      setLoading(false);
    }
  };

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

  const handleOpen = (company) => {
    setEditingCompany({
      id: company.id,
      com_title: company.com_title,
      comp_logo: company.comp_logo,
      comp_category: company.comp_category,
      comp_description: company.comp_description,
      comp_phone: company.comp_phone,
      comp_email: company.comp_email,
      comp_website: company.comp_website,
      comp_rating: company.comp_rating,
      comp_details: company.comp_details || "",
      comp_other_details: company.comp_other_details || "",
      meta_title: company.meta_title || "",
      meta_description: company.meta_description || "",
      meta_focusKeyword: company.meta_focusKeyword || "",
      web_slug: company.web_slug || "",
      comp_affiliateLink: company.comp_affiliateLink || "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCompany(null);
  };
  const fetchData = async () => {
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

      // Compute the number of offers per company
      const offersByCompany = {};
      const expiredOffersByCompany = {};
      const currentDate = new Date();

      offersData.forEach((offer) => {
        const comp_id = offer.comp_id;
        const expiryDate = new Date(offer.offer_expiry);

        // Count total offers
        if (offersByCompany[comp_id]) {
          offersByCompany[comp_id]++;
        } else {
          offersByCompany[comp_id] = 1;
        }

        // Count expired offers
        if (expiryDate < currentDate) {
          if (expiredOffersByCompany[comp_id]) {
            expiredOffersByCompany[comp_id]++;
          } else {
            expiredOffersByCompany[comp_id] = 1;
          }
        }
      });

      // Add num_offers and num_expired_offers fields to each company
      const companiesWithOffers = companiesData.map((company) => ({
        ...company,
        num_offers: offersByCompany[company.id] || 0,
        num_expired_offers: expiredOffersByCompany[company.id] || 0,
      }));

      setCategories(categoriesData);
      setCompanies(companiesWithOffers);
      setOffers(offersData);
    } catch (error) {
      setError("Error fetching data: " + error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const router = useRouter();
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    // Decode JWT token to get user role
    const token = Cookies.get("token");
    if (!token) {
      alert("Login to see the dashboard!");
      router.push("/admin");
    } else {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role);
      console.log("User Role:", decodedToken.role);
    }
  }, [router]);

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
          const category = categories.find((c) => c.id === value);
          return category ? category.category_name : "Unknown";
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
        Header: "Offers",
        accessor: "num_offers",
      },
      {
        Header: "Affiliate Link",
        accessor: "comp_affiliateLink",
        Cell: ({ value }) => (
          <a href={value} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        ),
      },
      {
        Header: "Expired Coupons",
        accessor: "num_expired_offers",
      },
      {
        Header: "Website",
        accessor: "comp_website",
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
            {/* Conditionally render the delete button based on userRole */}
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
    [categories, userRole]
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
    nextPage,
    previousPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data: companies,
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
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

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
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: "All", value: companies.length }]}
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
        maxWidth="xl"
        fullWidth
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
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
              {/* Existing form fields */}
              <Grid item xs={12}>
                <TextField
                  label="Company Name"
                  name="com_title"
                  value={formData.com_title}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="comp_category"
                    value={formData.comp_category}
                    onChange={handleInputChange}
                    label="Category"
                  >
                    <MenuItem value="">
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
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="comp_description"
                  value={formData.comp_description}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone Number"
                  name="comp_phone"
                  value={formData.comp_phone}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="comp_email"
                  value={formData.comp_email}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Website"
                  name="comp_website"
                  value={formData.comp_website}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Rating"
                  name="comp_rating"
                  value={formData.comp_rating}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
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
              <Grid item xs={12}>
                <h3 style={{ marginBottom: "10px", color: "#333" }}>Company Details</h3>
                <JoditEditor
                  ref={editor}
                  value={formData.comp_details}
                  tabIndex={1}
                  onBlur={(newContent) =>
                    setFormData({
                      ...formData,
                      comp_details: newContent,
                    })
                  }
                  onChange={(newContent) =>
                    setFormData({
                      ...formData,
                      comp_details: newContent,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} style={{ marginTop: "20px" }}>
                <h3 style={{ marginBottom: "10px", color: "#333" }}>Other Details</h3>
                <JoditEditor
                  ref={editor}
                  value={formData.comp_other_details}
                  tabIndex={1}
                  onBlur={(newContent) =>
                    setFormData({
                      ...formData,
                      comp_other_details: newContent,
                    })
                  }
                  onChange={(newContent) =>
                    setFormData({
                      ...formData,
                      comp_other_details: newContent,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Affiliate Link"
                  name="comp_affiliateLink"
                  value={formData.comp_affiliateLink}
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
                  name="imgurl"
                  onChange={handleImageChange}
                  style={{ display: "block", marginTop: "10px" }}
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

      {/* Edit Company Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xl"
        fullWidth
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogTitle>
          <Typography variant="h6">Edit Company Data</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 10,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {editingCompany && (
            <form className="mt-2">
              <Grid container spacing={2}>
                {/* Existing form fields */}
                <Grid item xs={12}>
                  <TextField
                    label="Company Name"
                    name="com_title"
                    value={editingCompany.com_title}
                    fullWidth
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        com_title: e.target.value,
                      })
                    }
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="comp_category"
                      value={editingCompany.comp_category}
                      onChange={(e) =>
                        setEditingCompany({
                          ...editingCompany,
                          comp_category: e.target.value,
                        })
                      }
                      label="Category"
                    >
                      <MenuItem value="">
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
                {/* Other form fields */}
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    name="comp_description"
                    value={editingCompany.comp_description}
                    fullWidth
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        comp_description: e.target.value,
                      })
                    }
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone Number"
                    name="comp_phone"
                    value={editingCompany.comp_phone}
                    fullWidth
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        comp_phone: e.target.value,
                      })
                    }
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="comp_email"
                    value={editingCompany.comp_email}
                    fullWidth
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        comp_email: e.target.value,
                      })
                    }
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Website"
                    name="comp_website"
                    value={editingCompany.comp_website}
                    fullWidth
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        comp_website: e.target.value,
                      })
                    }
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Rating"
                    name="comp_rating"
                    value={editingCompany.comp_rating}
                    fullWidth
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        comp_rating: e.target.value,
                      })
                    }
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Meta Title"
                    name="meta_title"
                    value={editingCompany.meta_title}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        meta_title: e.target.value,
                      })
                    }
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Meta Description"
                    name="meta_description"
                    value={editingCompany.meta_description}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        meta_description: e.target.value,
                      })
                    }
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Slug"
                    name="web_slug"
                    value={editingCompany.web_slug}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        web_slug: e.target.value,
                      })
                    }
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Meta Keyword"
                    name="meta_focusKeyword"
                    value={editingCompany.meta_focusKeyword}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        meta_focusKeyword: e.target.value,
                      })
                    }
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <h3 style={{ marginBottom: "10px", color: "#333" }}>
                    Company Details
                  </h3>
                  <JoditEditor
                    ref={editor}
                    value={editingCompany.comp_details}
                    tabIndex={1}
                    onBlur={(newContent) =>
                      setEditingCompany({
                        ...editingCompany,
                        comp_details: newContent,
                      })
                    }
                    onChange={(newContent) =>
                      setEditingCompany({
                        ...editingCompany,
                        comp_details: newContent,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} style={{ marginTop: "20px" }}>
                  <h3 style={{ marginBottom: "10px", color: "#333" }}>
                    Other Details
                  </h3>
                  <JoditEditor
                    ref={editor}
                    value={editingCompany.comp_other_details}
                    tabIndex={1}
                    onBlur={(newContent) =>
                      setEditingCompany({
                        ...editingCompany,
                        comp_other_details: newContent,
                      })
                    }
                    onChange={(newContent) =>
                      setEditingCompany({
                        ...editingCompany,
                        comp_other_details: newContent,
                      })
                    }
                  />
                </Grid>
                {/* Affiliate Link Field */}
                <Grid item xs={12}>
                  <TextField
                    label="Affiliate Link"
                    name="comp_affiliateLink"
                    value={editingCompany.comp_affiliateLink}
                    onChange={(e) =>
                      setEditingCompany({
                        ...editingCompany,
                        comp_affiliateLink: e.target.value,
                      })
                    }
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                {/* Rest of the form fields */}
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
        <Alert severity="success">Company saved successfully!</Alert>
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
        <Alert severity="warning">Company successfully deleted!</Alert>
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
