import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Property } from '../types/propertyTypes'; // ✅ unified type

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const fetchProperties = async () => {
      try {
        const res = await axios.get('http://54.219.120.154:5000/api/properties', {
          params: { owner_id: user.id },
        });
        const normalized = res.data.map((p: any) => ({
            ...p,
            propertyId: p.property_id,        // camelCase for new components
            property_id: p.property_id        // preserve for legacy use (expenses)
          }));
          
          setProperties(normalized);
          
      } catch (err) {
        setError('Failed to fetch properties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user?.id]);

  return { properties, loading, error };
};
