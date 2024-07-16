import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

export default function ProductCard({imgURL,availability,category,company,discount,id,price,productName,rating}) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={imgURL}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {productName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            id: {id}
            <br />
            company: {company}
            <br />
            price: {price}
            <br />
            category: {category}
            <br />
            availability:{availability}
            <br />
            rating: {rating}
            <br />
            discount: {discount}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

