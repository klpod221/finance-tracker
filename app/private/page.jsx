"use client";

import { useEffect, useState } from "react";
import { logout, getUser } from "./actions";

export default function PrivatePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const user = await getUser();
      setUser(user);
    }
    fetchUser();
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <p>Hello {user.email}</p>
      <p>Welcome to the private page</p>
      <button onClick={logout}>
        <span aria-hidden="true">🔒</span>
        Log out
      </button>
    </>
  );
}
