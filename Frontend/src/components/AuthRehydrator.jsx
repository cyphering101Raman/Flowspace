import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../features/authStore';
import axiosInstance from '../utils/axiosInstace';

const AuthRehydrator = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const rehydrateUser = async () => {
      try {
        const response = await axiosInstance.get('/auth/check');
        
        if (response.data.success && response.data.data) {
          dispatch(login(response.data.data));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        // console.error('User rehydration failed:', error);
        dispatch(logout());
      }
    };

    if (!isAuthenticated) {
      rehydrateUser();
    }
  }, [dispatch, isAuthenticated]);

  return children;
};

export default AuthRehydrator;
