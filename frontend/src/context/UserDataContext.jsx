import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create context
export const UserDataContext = createContext();

// Provider component
const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null); // Can be admin or user
  const [role, setRole] = useState(null); // 'admin' | 'user' | null
  const [loading, setLoading] = useState(true); // Optional: For loading states
  const [menuOpen, setMenuOpen] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [reloginMsg, setReLoginMsg] = useState(null);

  let serverUrl = "https://ctms-project.vercel.app";

  useEffect(() => {
    async function fetchUserData() {
      try {
        const result = await axios.get(serverUrl + "/api/auth/userdata", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(result.data);

        const role = result.data.role;

        const { admin, user } = result.data;

        setRole(role);

        setUserData(role === "admin" ? admin : user);

        // if (result.response.data.error == "jwt expired") {
        //   console.log("asdasda");
        // }
      } catch (err) {
        console.log(err);
        // const msg = err;
        setReLoginMsg(err?.response?.data?.error);

        console.error("Error fetching user data:", err.message);
        setUserData(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  return (
    <UserDataContext.Provider
      value={{
        userData,
        setUserData,
        role,
        setRole,
        loading,
        menuOpen,
        setMenuOpen,
        serverUrl,
        editProfile,
        setEditProfile,
        reloginMsg,
        setReLoginMsg,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export { UserDataProvider };
