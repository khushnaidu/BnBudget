import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export interface Property {
  id: number;
  name: string;
  [key: string]: any;
}

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
        setProperties(res.data);
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
