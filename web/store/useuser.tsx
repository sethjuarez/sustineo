import { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { WEB_ENDPOINT } from "store/endpoint";

export interface User {
  key: string;
  name: string;
  email: string;
  avatar?: string;
}

const availableUsers: { [key: string]: string } = {
  "asha-sharma": "/images/people/asha-sharma.jpg",
  "louise-han": "/images/people/louise-han.jpg",
  "marco-casalaina": "/images/people/marco-casalaina.jpg",
  "seth-juarez": "/images/people/seth-juarez.jpg",
  "yina-arenas": "/images/people/yina-arenas.jpg",
  "zia-mansoor": "/images/people/zia-mansoor.jpg",
  "amanda-foster": "/images/people/amanda-foster.jpg",
};

const defaultUser: User = {
  key: "seth-juarez",
  name: "Seth Juarez",
  email: "seth.juarez@microsoft.com",
  avatar: "/images/people/seth-juarez.jpg",
};

/**
 * Extract user information from MSAL account
 */
const getUserFromAccount = (account: any): User => {
  const name = account.name || account.username || "Unknown User";
  const email = account.username || account.email || "";
  const nameKey = name.toLowerCase().replace(/\s/g, "-");
  const userAvatar = availableUsers[nameKey];
  
  return {
    key: nameKey,
    name: name,
    email: email,
    avatar: userAvatar,
  };
};

/**
 * React hook for fetching and managing user data with MSAL authentication
 */
export const useUser = () => {
  const { instance, accounts } = useMsal();
  const [user, setUser] = useState<User>({
    key: "",
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        // For localhost development, use default user
        if (WEB_ENDPOINT.startsWith("http://localhost")) {
          setUser(defaultUser);
          setLoading(false);
          return;
        }

        // Check if user is authenticated with MSAL
        if (accounts.length > 0) {
          const account = accounts[0];
          const userData = getUserFromAccount(account);
          setUser(userData);
        } else {
          // Not authenticated, use default user or trigger login
          setUser(defaultUser);
        }
      } catch (err) {
        setError(err as Error);
        // on error, set user to default user
        setUser(defaultUser);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [accounts, instance]);

  return { user, loading, error } as const;
};

