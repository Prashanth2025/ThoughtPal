import React, { createContext, useContext, useState } from "react";

const Contex = createContext();

const UserContex = (props) => {
  const [user, setUser] = useState(null);
  return (
    <Contex.Provider value={{ user, setUser }}>
      {props.children}
    </Contex.Provider>
  );
};

export const useUser = () => {
  return useContext(Contex);
};

export default UserContex;
