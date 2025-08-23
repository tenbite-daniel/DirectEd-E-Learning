import { useAuth } from "../hooks/useAuth"

export default function Dashboard() {
  const { user, token } = useAuth();

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <p>Your role: {user?.role}</p>
      <p>JWT: {token}</p>
    </div>
  );
}