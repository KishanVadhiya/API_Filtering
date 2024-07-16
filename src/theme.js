// theme.js

import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#4b49ac', // Your primary color
    },
    secondary: {
      main: '#98bdff', // Your secondary color
    },
    // You can also set up other palette options such as error, warning, info, etc.
  },
  typography: {
    // Define your typography styles here
    fontFamily: 'Roboto, Arial, sans-serif',
    // You can customize other typography options such as fontSize, fontWeight, etc.
  },
  // Add other customizations here such as spacing, breakpoints, etc.
});

export default theme;
