import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Property } from '../types/propertyTypes';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  const imageCount = 8;
  const imageIndex = (property.property_id % imageCount) + 1;
  const imageSrc = `/images/houses/house-${imageIndex}.jpg`;

  return (
    <Card
      onClick={onClick}
      sx={{
        width: 270,
        height: 360,
        borderRadius: 3,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease',
        mx: 'auto',
        boxShadow: 3,
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 6,
        },
      }}
    >
      <Box
        component="img"
        src={imageSrc}
        alt={property.name}
        sx={{
          height: 200,
          width: '100%',
          objectFit: 'cover',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {property.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {property.location}
        </Typography>
        <Box mt={2}>
          <Typography variant="body2">
            ${property.base_nightly_rate}/night
          </Typography>
          <Typography variant="body2">
            {property.bedrooms} bd, {property.bathrooms} ba
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
