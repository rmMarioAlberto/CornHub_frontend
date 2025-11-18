// src/hooks/useUsers.js
import { useState, useEffect } from 'react';
import { getAllUsers } from '../api/users';

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllUsers();

      let usersArray = [];

      if (Array.isArray(response)) {
        usersArray = response;
      } else if (response?.users && Array.isArray(response.users)) {
        usersArray = response.users;
      } else if (response?.data?.users && Array.isArray(response.data.users)) {
        usersArray = response.data.users;
      }

      setUsers(usersArray);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      setError('No se pudieron cargar los usuarios');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refresh: fetchUsers };
};

export default useUsers;