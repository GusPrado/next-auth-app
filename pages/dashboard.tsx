import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return <h2>Dashboard {user.email}</h2>;
}
