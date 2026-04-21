import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser, registerUser } from '../store/slices/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);
  return {
    user, token, loading, error,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.user_metadata?.role === 'admin' || user?.role === 'admin',
    isProfessor: user?.user_metadata?.role === 'professor',
    isClubAdmin: user?.user_metadata?.role === 'clubAdmin',
    login: (creds) => dispatch(loginUser(creds)),
    register: (data) => dispatch(registerUser(data)),
    logout: () => dispatch(logoutUser()),
  };
};

export default useAuth;
