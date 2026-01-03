import React, { createContext, useContext, useState } from "react";

let Contex = createContext();

let UserContex = (props) => {
  let [user, setUser] = useState(null);
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
