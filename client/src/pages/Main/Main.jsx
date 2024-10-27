import React, { useContext, useEffect, useRef, useState } from "react";
import "./Main.css";
import { ThemeContext } from "../../Context/Context";
import { IoClose } from "react-icons/io5";
import { signUp, login } from "../../utils/appwrite";

export default function Main() {
  let signOrLoginRef = useRef(null);
  let [signOrLogin, setSignOrLogin] = useState("Sign");
  let [registerUser, setRegisterUser] = useState({ email: "", password: "" });
  let [loginUser, setLoginUser] = useState({ email: "", password: "" });
  let [isError, setIsError] = useState(false);
  let [isLoading, setIsLoading] = useState(false);
  let { darkTheme, setDarkTheme } = useContext(ThemeContext);
  useEffect(() => {
    if (JSON.parse(window.localStorage.getItem("dark"))) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [window.localStorage.getItem("dark")]);

  return (
    <div className="dark:text-white flex flex-col justify-center items-center gap-5 w-full h-dvh bg-[#f5f5f5] dark:bg-[#151515]">
      <div className="w-full flex justify-between items-center p-3 pr-5">
        <div className="flex justify-start items-center gap-2 w-full">
          <img className="size-14" src="/assets/TheDos.png" alt="" />
          <h1 className="text-lg text-black dark:text-white">TheDos</h1>
        </div>
        <label className="switchMain">
          <input
            type="checkbox"
            defaultChecked={JSON.parse(darkTheme)}
            onChange={(e) => {
              setDarkTheme(e.target.checked);
              window.localStorage.setItem(
                "dark",
                JSON.stringify(e.target.checked)
              );
            }}
          />
          <span className="sliderMain"></span>
        </label>
      </div>
      <div className="dark:text-white flex flex-col justify-center items-center gap-5 w-full flex-grow">
        <h1 className="text-2xl text-black dark:text-white">
          Sign Up or Login {darkTheme ? "❄️" : "🔥"}
        </h1>
        <div className="w-[25rem] max-sm:w-[20rem]">
          <div className="relative w-full flex justify-between items-center mb-3">
            <button
              onClick={() => {
                signOrLoginRef.current.classList.remove("toRight");
                signOrLoginRef.current.classList.add("toLeft");
                setSignOrLogin("Sign");
              }}
              className="w-[50%] flex justify-center items-center text-center pb-2 text-black dark:text-white"
            >
              SignUp
            </button>
            <button
              onClick={() => {
                signOrLoginRef.current.classList.remove("toLeft");
                signOrLoginRef.current.classList.add("toRight");
                setSignOrLogin("Login");
              }}
              className="w-[50%] flex justify-center items-center text-center pb-2 text-black dark:text-white"
            >
              LogIn
            </button>
            <div
              ref={signOrLoginRef}
              className="absolute left-0 bottom-0 toLeft rounded-lg h-[.1rem] w-[50%] dark:bg-white bg-black"
            ></div>
          </div>
          <div className="flex flex-col justify-center items-center gap-4 w-full">
            {isError && (
              <div className="w-full h-10 rounded-lg flex justify-start items-center gap-2 px-2 bg-red-500">
                <span className="w-4 h-4 flex justify-center items-center">
                  <IoClose size={40} color="#000" />
                </span>
                <p className="text-sm text-black">There was an error!</p>
              </div>
            )}
            <div className="flex flex-col justify-center items-center gap-3 w-full">
              <input
                className="w-full bg-[#c5c5c5] placeholder:text-[#606060] dark:bg-[#202020] text-black dark:text-white rounded-md p-2 text-sm dark:focus:outline-teal-500 focus:outline-orange-500 focus:outline"
                type="email"
                placeholder="Email"
                value={
                  signOrLogin === "Sign" ? registerUser.email : loginUser.email
                }
                onChange={(e) => {
                  if (signOrLogin === "Sign") {
                    setRegisterUser({ ...registerUser, email: e.target.value });
                  } else {
                    setLoginUser({ ...loginUser, email: e.target.value });
                  }
                }}
              />
              <input
                className="w-full bg-[#c5c5c5] placeholder:text-[#606060] dark:bg-[#202020] text-black dark:text-white rounded-md p-2 text-sm dark:focus:outline-teal-500 focus:outline-orange-500 focus:outline"
                type="text"
                placeholder="Password"
                value={
                  signOrLogin === "Sign"
                    ? registerUser.password
                    : loginUser.password
                }
                onChange={(e) => {
                  if (signOrLogin === "Sign") {
                    setRegisterUser({
                      ...registerUser,
                      password: e.target.value,
                    });
                  } else {
                    setLoginUser({ ...loginUser, password: e.target.value });
                  }
                }}
              />
            </div>
            <button
              onClick={() => {
                if (signOrLogin === "Sign") {
                  signUp(
                    registerUser.email,
                    registerUser.password,
                    registerUser.email.split("@")[0]
                  );
                } else {
                  login(loginUser.email, loginUser.password);
                }
              }}
              className="w-full p-2 rounded-md text-base text-white dark:text-black bg-gradient-to-r dark:from-[#8983f7] dark:to-[#a3dafb] from-[#ff0080] to-[#ff8c00] active:scale-95 transition-all"
            >
              {signOrLogin === "Sign" ? "SignUp" : "LogIn"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
