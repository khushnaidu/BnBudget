import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '../styles/swiperOverrides.css';

import PropertyCard from '../components/PropertyCard';
import PropertyDetailModal from '../components/PropertyDetailModal';
import { Property } from '../types/propertyTypes';

const PropertyDashboard: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const ownerId = localStorage.getItem('ownerId');

  useEffect(() => {
    if (!ownerId) {
      setError('Missing owner ID');
      setLoading(false);
      return;
    }

    const fetchProperties = async () => {
      try {
        const res = await fetch(`/api/properties?owner_id=${ownerId}`, {
          headers: { 'Cache-Control': 'no-cache' },
        });

        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        setProperties(data);
      } catch (err) {
        setError('Failed to fetch properties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [ownerId]);

  const handleCardClick = async (propertyId: number) => {
    try {
      const res = await fetch(`/api/property/${propertyId}/details`);
      if (!res.ok) throw new Error('Failed to fetch details');
      const data = await res.json();
      setSelectedDetails(data);
      setModalOpen(true);
    } catch (err) {
      console.error('❌ Error fetching property details:', err);
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        My Properties
      </Typography>

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && properties.length === 0 && (
        <Typography>No properties found.</Typography>
      )}

      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        centeredSlides
        loop
        spaceBetween={30}
        slidesPerView={3}
        speed={1200}
        breakpoints={{
          0: { slidesPerView: 1 },
          600: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        style={{ padding: '40px 0' }}
      >
        {properties.map((p) => (
          <SwiperSlide key={p.property_id} className="swiper-slide-custom">
            <PropertyCard
              property={p}
              onClick={() => handleCardClick(p.property_id)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <PropertyDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={selectedDetails}
      />
    </Container>
  );
};

export default PropertyDashboard;
