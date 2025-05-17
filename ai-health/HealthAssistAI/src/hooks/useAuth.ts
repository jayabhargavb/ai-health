import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { login, register, refresh, logout } from '../store/slices/authSlice';
import { AuthRequest, RefreshTokenRequest } from '../types/api.types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, refreshToken, loading, error } = useSelector((state: RootState) => state.auth);

  return {
    user,
    token,
    refreshToken,
    loading,
    error,
    login: (payload: AuthRequest) => dispatch(login(payload)),
    register: (payload: AuthRequest) => dispatch(register(payload)),
    refresh: (payload: RefreshTokenRequest) => dispatch(refresh(payload)),
    logout: () => dispatch(logout()),
  };
};
