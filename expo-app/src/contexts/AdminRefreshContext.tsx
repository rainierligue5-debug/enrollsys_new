import React, { createContext, useContext, useMemo, useState } from 'react';

type AdminRefreshContextType = {
  refreshTick: number;
  bump: () => void;
};

const AdminRefreshContext = createContext<AdminRefreshContextType | undefined>(
  undefined
);

export const AdminRefreshProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [refreshTick, setRefreshTick] = useState(0);

  const bump = () => {
    setRefreshTick((t) => t + 1);
  };

  const value = useMemo(() => ({ refreshTick, bump }), [refreshTick]);

  return (
    <AdminRefreshContext.Provider value={value}>
      {children}
    </AdminRefreshContext.Provider>
  );
};

export const useAdminRefresh = (): AdminRefreshContextType => {
  const ctx = useContext(AdminRefreshContext);
  if (!ctx) {
    throw new Error(
      'useAdminRefresh must be used within an AdminRefreshProvider'
    );
  }
  return ctx;
};

