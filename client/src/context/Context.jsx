import React, { createContext, useEffect, useState } from "react";
import { getUserSession } from "../utils/appwrite";
import { supabase } from "../utils/supabase";

export let ThemeContext = createContext(null);
export default function Context({ children }) {
  let [todos, setTodos] = useState([]);
  let [user, setUser] = useState(null);
  let [isError, setIsError] = useState(false);
  let [isLoading, setIsLoading] = useState(true);
  let [darkTheme, setDarkTheme] = useState(
    JSON.parse(window.localStorage.getItem("dark")) || false
  );
  console.log(user);

  useEffect(() => {
    async function getUserData() {
      let userInfo = await getUserSession();
      setUser(userInfo);
    }
    getUserData();
  }, []);

  useEffect(() => {
    let fetchTodos = async () => {
      let { data, error } = await supabase.from("todos").select("*");
      if (error) console.error("Error fetching todos:", error);
      else {
        console.log(data);
        setTodos(data);
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        darkTheme,
        setDarkTheme,
        user,
        setUser,
        todos,
        setTodos,
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
