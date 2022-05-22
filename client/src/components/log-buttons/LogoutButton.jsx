import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@material-ui/core";

const LogoutButton = () => {
  return (
    <div>
      <Button style={{ textTransform: "none" }}>Logout</Button>
    </div>
  );
};

export default LogoutButton;
