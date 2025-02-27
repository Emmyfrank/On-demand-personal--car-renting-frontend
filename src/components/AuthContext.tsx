import React, { createContext, useContext, useEffect, useState } from "react";
export const endPoint = import.meta.env.VITE_BACKEND_ADDRESS;

export const INITIAL_USER = {
  _id: "",
  fullname: "",
  email: "",
  password: "",
  imageUrl: "",
  role: "",
  businessId: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsLoading: () => {},
  setIsAuthenticated: () => {},
  businessId: "",
  setBusinessId: () => {},
  loading: false,
  setLoading: () => {},
  isApproved: false,
  setIsApproved: () => {},
};
interface IUser {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  imageUrl: string;
  role: string;
  businessId: string;
}

interface IContextState {
  user: IUser;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  businessId: string;
  setBusinessId: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isApproved: boolean | undefined;
  setIsApproved: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

const AuthContext = createContext<IContextState>(INITIAL_STATE);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [businessId, setBusinessId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isApproved, setIsApproved] = useState<boolean>();

  const token = localStorage.getItem("rental_token");

  const getSessionUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${endPoint}/auth/user/get_session_user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.user) {
        setUser({
          _id: data.user._id,
          fullname: data.user.fullname,
          email: data.user.email,
          password: data.user.password,
          imageUrl: data.user.imageUrl,
          role: data.user.role,
          businessId: data.user.businessId,
        });
        setIsAuthenticated(true);
      } else {
        setUser(INITIAL_USER);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const businessWithData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${endPoint}/root/business/get/${user._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setBusinessId(data.business._id);
      setIsApproved(data.business.isApproved);
      console.log(data.business);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getSessionUser();
    }
  }, []);

  useEffect(() => {
    if (user.role === "business") {
      businessWithData();
    }
  }, [user.role]);

  console.log("isApproved", isApproved);

  const value = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated,
    setIsAuthenticated,
    businessId,
    setBusinessId,
    loading,
    setLoading,
    isApproved,
    setIsApproved,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useUserContext = () => useContext(AuthContext);
