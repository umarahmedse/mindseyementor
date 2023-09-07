/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { useLoginQuery } from "../../hooks/useLoginCheck";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
const ProtectedRoutes = ({ children }) => {
  const userId = useSelector((state) => state.global.userId);
  const { data, isLoading, isAuthenticated, isFetching } =
    useLoginQuery(userId);
  const navigate = useNavigate();
  useEffect(() => {
    // if (!isAuthenticated) navigate("/login");
    if (!isAuthenticated && !isLoading) navigate("/login");
  }, [isAuthenticated, isLoading, navigate]);
  if (isFetching) {
    return <Loader />;
  }
  if (isAuthenticated) {
    return children;
  }
};

export default ProtectedRoutes;
