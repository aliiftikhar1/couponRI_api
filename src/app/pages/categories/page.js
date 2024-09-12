'use client';
import React, { useState, useEffect } from "react";
import { Grid, Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import CustomerRootLayout from "../../../app/user/layout";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/category');
        const result = await response.json();
        setCategories(result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    const category = parseInt(categoryId);
    router.push(`/pages/onecategory/${category}`);
  };

  return (
    <CustomerRootLayout>
      <div className="bg-white w-full min-h-screen">
        <Box sx={{ padding: { xs: 2, sm: 3 } }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom align="center" sx={{ padding: { xs: 1, sm: 2 } }}>
            Choose a Category for Promo Code
          </Typography>
          <Typography variant="body1" gutterBottom align="center" sx={{ padding: { xs: 1, sm: 2 } }}>
            50% off (Sitewide) Aug 2024
          </Typography>
          <Grid container spacing={2} sx={{ padding: { xs: 1, sm: 4 }, justifyContent: 'center' }}>
            {categories.map((category, key) => (
              <Grid item xs={6} sm={4} md={3} lg={2.5} xl={2} key={key}> {/* Adjusted grid sizes for larger screens */}
                <Card
                  onClick={() => handleCategoryClick(category.id)}
                  sx={{
                    cursor: "pointer",
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out',
                    borderRadius: '12px',
                    border: '2px solid transparent',
                    margin: '5px',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                      borderColor: '#1e40af',
                    },
                  }}
                >
                  <Box sx={{ paddingTop: '100%', position: 'relative', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
                    <CardMedia
                      component="img"
                      alt={category.category_name}
                      image={`https://coupnri.m3xtrader.com/uploads/${category.category_image}`}
                      title={category.category_name}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ textAlign: 'center', padding: '8px' }}>
                    <Typography variant="body1" component="div" sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {category.category_name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    </CustomerRootLayout>
  );
};

export default CategoryPage;
