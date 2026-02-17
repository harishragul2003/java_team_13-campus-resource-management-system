import { useEffect } from "react";
import { BASE_URL } from "../services/api";

function Users() {

  useEffect(() => {
    fetch(`${BASE_URL}/users`)
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }, []);

  return <h2>Users Page</h2>;
}

export default Users;
