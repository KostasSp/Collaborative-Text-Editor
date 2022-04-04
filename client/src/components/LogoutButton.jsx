import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@material-ui/core";

const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <div>
      <Button onClick={() => logout()}>Logout</Button>
    </div>
  );
};

export default LogoutButton;
