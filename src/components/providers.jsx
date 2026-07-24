"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "@/store/store";
import { checkAuth } from "@/store/auth-slice";
import { Toaster } from "@/components/ui/toaster";

function AuthBootstrap({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return children;
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthBootstrap>
        {children}
        <Toaster />
      </AuthBootstrap>
    </Provider>
  );
}
