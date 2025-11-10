// src/hooks/useUsers.js
import { useState, useEffect } from 'react';
import useAuth from './useAuth';
import { createUser, getAllUsers } from '../api/users';

const useUsers = () => {
  const { auth } = useAuth();
  const token = auth?.accessToken;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAllUsers(token);
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (userData) => {
    setLoading(true);
    try {
      await createUser(userData, token);
      await fetchUsers();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  return { users, loading, error, addUser, refresh: fetchUsers };
};

export default useUsers;