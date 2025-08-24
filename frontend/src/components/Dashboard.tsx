import { useAuth } from "../hooks/useAuth"

export default function Dashboard() {
  const { user, token } = useAuth();

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <p>Your role is : {user?.role}</p>
      <p>JWT_token: {token}</p>
    </div>
  );
}