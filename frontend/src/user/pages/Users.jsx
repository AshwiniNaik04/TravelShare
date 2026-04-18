import { useEffect, useState } from "react";

import UsersList from "../components/UsersList";

const Users = () => {

  const [loadedUsers, setLoadedUsers] =
    useState([]);

  useEffect(() => {

    const fetchUsers =
      async () => {

        try {

          const response =
            await fetch(
              "http://localhost:5000/api/users"
            );

          const responseData =
            await response.json();

          setLoadedUsers(
            responseData.users
          );

        } catch (err) {

          console.log(err);

        }

      };

    fetchUsers();

  }, []);

  return (

    <UsersList
      items={loadedUsers}
    />

  );

};

export default Users;