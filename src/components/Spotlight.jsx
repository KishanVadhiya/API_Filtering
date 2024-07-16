import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Pagination, Box, FormControl, InputLabel, Select, MenuItem, Slider, Typography } from '@mui/material';
import ProductCard from './ProductCard';

const UnsplashAccessKey = 'aVhwloBHIg3J6I1FchuFQt-rr1kwoHJR-lpfzPYBjnI';

const Spotlight = () => {
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [rating, setRating] = useState(0);
  const [sorting, setSorting] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    company: '',
    price: [0, 5000],
    availability: '',
  });

  const updateURL = () => {
    let productURL = 'https://json-server-c67opnddza-el.a.run.app';
    if (filters.company) productURL += `/companies/${filters.company}`;
    if (filters.category) productURL += `/categories/${filters.category}`;

    productURL += '/products';
    if (filters.price[0] !== 0) productURL += `?minPrice=${filters.price[0]}`;

    if (filters.price[1] !== 5000) {
      if (productURL.includes('?')) productURL += `&maxPrice=${filters.price[1]}`;
      else productURL += `?maxPrice=${filters.price[1]}`;
    }
    if (filters.availability) {
      if (productURL.includes('?')) productURL += `&availability=${filters.availability}`;
      else productURL += `?availability=${filters.availability}`;
    }

    console.log("\nCurrent API URL -",productURL,"\n");

    return productURL;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(updateURL());
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };

    const fetchImages = async () => {
      try {
        const imageResponse = await axios.get('https://api.unsplash.com/search/photos', {
          headers: {
            Authorization: `Client-ID ${UnsplashAccessKey}`,
          },
          params: {
            query:'electronics',
            per_page: itemsPerPage,
          },
        });
        setImages(imageResponse.data.results);
      } catch (error) {
        console.error('Error fetching images', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesResponse = await axios.get('https://json-server-c67opnddza-el.a.run.app/categories');
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    const fetchCompanies = async () => {
      try {
        const companiesResponse = await axios.get('https://json-server-c67opnddza-el.a.run.app/companies');
        setCompanies(companiesResponse.data);
      } catch (error) {
        console.error('Error fetching companies', error);
      }
    };

    fetchProducts();
    fetchImages();
    fetchCategories();
    fetchCompanies();
  }, [filters, currentPage]);

  useEffect(() => {
    let sortedProducts = [...products];

    if (rating > 0) {
      sortedProducts = sortedProducts.filter(product => product.rating >= rating);
    }

    switch (sorting) {
      case 'atoz':
        sortedProducts.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case 'ztoa':
        sortedProducts.sort((a, b) => b.productName.localeCompare(a.productName));
        break;
      case 'ratings':
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        sortedProducts.sort((a, b) => b.discount - a.discount);
        break;
      case 'price-asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setProducts(sortedProducts);
  }, [rating, sorting]);

  const handleSorting = (event) => {
    setSorting(event.target.value);
    setCurrentPage(1);
  };

  const handleRatingChange = (event) => {
    setRating(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value,
    });
    setCurrentPage(1);
  };

  const handleSliderChange = (event, newValue, name) => {
    setFilters({
      ...filters,
      [name]: newValue,
    });
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const mergedData = products.map((product, index) => ({
    ...product,
    imgURL: images[index % images.length]?.urls?.small || 'defaultImageURL',
  }));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mergedData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Spotlight</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Company</InputLabel>
              <Select
                name="company"
                value={filters.company}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.name}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Availability</InputLabel>
              <Select
                name="availability"
                value={filters.availability}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography gutterBottom>Price Range</Typography>
            <Slider
              value={filters.price}
              onChange={(event, newValue) => handleSliderChange(event, newValue, 'price')}
              valueLabelDisplay="auto"
              min={0}
              max={5000}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Rating</InputLabel>
              <Select
                name="rating"
                value={rating}
                onChange={handleRatingChange}
              >
                <MenuItem value={0}>All</MenuItem>
                <MenuItem value={1}>1 or more</MenuItem>
                <MenuItem value={2}>2 or more</MenuItem>
                <MenuItem value={3}>3 or more</MenuItem>
                <MenuItem value={4}>4 or more</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                name="sort"
                value={sorting}
                onChange={handleSorting}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="atoz">A to Z</MenuItem>
                <MenuItem value="ztoa">Z to A</MenuItem>
                <MenuItem value="ratings">Ratings</MenuItem>
                <MenuItem value="discount">Discount</MenuItem>
                <MenuItem value="price-asc">Price - Increasing Order</MenuItem>
                <MenuItem value="price-desc">Price - Decreasing Order</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {currentItems.map(product => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <ProductCard
                imgURL={product.imgURL}
                availability={product.availability}
                category={product.category}
                company={product.company}
                discount={product.discount}
                id={product.id}
                price={product.price}
                productName={product.productName}
                rating={product.rating}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(products.length / itemsPerPage)}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default Spotlight;
