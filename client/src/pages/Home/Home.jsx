import React, { useContext, useEffect, useRef, useState } from "react";
import { FaBars, FaCaretRight, FaPlus } from "react-icons/fa";
import { IoAdd, IoChevronDown, IoClose, IoExpand } from "react-icons/io5";
import { Tooltip } from "react-tooltip";
import "./Home.css";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Todo from "../../components/Todo/Todo";
import { supabase } from "../../utils/supabase";
import { logout } from "../../utils/appwrite";
import { ThemeContext } from "../../Context/Context";
import { DatePicker, TimePicker, Calendar } from "rsuite";

export default function Home() {
  let { todos, setTodos } = useContext(ThemeContext);
  let sectionRef = useRef(null);
  let [todoName, setTodoName] = useState("");
  let [todoDate, setTodoDate] = useState("");
  let [createTodo, setCreateTodo] = useState(false);
  let [hideSide, setHideSide] = useState(false);
  let [section, setSection] = useState("home");
  let [showCalender, setShowCalender] = useState(false);
  let [showMenu, setShowMenu] = useState(false);
  let [currentCalender, setCurrentCalender] = useState("Today");
  let currentDateArray = String(new Date()).split(" ");
  let { darkTheme, setDarkTheme, user, isLoading } = useContext(ThemeContext);
  let handleSelectCalender = (date) => {
    let dateArray = String(date).split(" ");
    if (Number(dateArray[3]) === Number(currentDateArray[3])) {
      setCurrentCalender(dateArray[1] + " " + dateArray[2]);
    } else {
      setCurrentCalender(
        dateArray[1] + " " + dateArray[2] + " " + dateArray[3]
      );
    }
    console.log(date);
  };
  let handleSelectDate = (date) => {
    let dateArray = String(date).split(" ");
    setTodoDate(
      todoDate.trim() +
        " " +
        dateArray[1] +
        " " +
        dateArray[2] +
        " " +
        dateArray[3]
    );
    console.log(date);
  };
  let handleSelectTime = (time) => {
    let timeArray = String(time)?.split(" ");
    setTodoDate(todoDate.trim() + " " + timeArray[4]?.slice(0, 5));
    console.log(timeArray[4]?.slice(0, 5));
  };
  let addTodo = async () => {
    let { data, error } = await supabase
      .from("todos")
      .insert([{ todoName, todoDate, todoOwner: user?.$id }])
      .select("*");
    if (error) console.error("Error adding todo:", error);
    else {
      console.log("Added new todo:", data);
      setTodos([...todos, ...data]);
    }
  };
  useEffect(() => {
    if (darkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkTheme]);

  useEffect(() => {
    console.log(todoDate);
  }, [todoDate]);
  console.log(todoDate);

  return (
    <div className="relative home flex justify-between items-center w-full h-dvh bg-[#f5f5f5] dark:bg-[#151515] p-3 overflow-hidden">
      <div
        className={`relative min-w-[18rem] max-w-[18rem] h-full rounded-md bg-white dark:bg-[#121212] shadow-md ${
          hideSide === true ? "hidden" : "block"
        } max-md:hidden`}
      >
        <Tooltip id="expand" />
        <button
          onClick={() => setHideSide(true)}
          data-tooltip-id="expand"
          data-tooltip-content="Expand"
          className="absolute top-10 -right-7 translate-x-[-50%] translate-y-[-50%] bg-white p-2 hover:bg-gray-200 dark:bg-[#202020] dark:hover:bg-[#282828] transition-all rounded-full shadow-sm"
        >
          <IoExpand color={darkTheme ? "#fff" : "#000"} />
        </button>
        <div className="pt-6 px-3 w-full flex flex-col justify-start items-center gap-3">
          <header className="text-lg text-start w-full dark:text-white text-black">
            Todos
          </header>
          <main className="w-full px-1 flex flex-col gap-2">
            <button
              onClick={() => setSection("home")}
              className={`w-full p-2 flex justify-between items-center ${
                section === "home" && "bg-gray-200 dark:bg-[#282828]"
              } dark:text-white text-black rounded-lg`}
            >
              <div className="flex justify-center items-center gap-2">
                <img
                  className="w-5"
                  src="https://img.icons8.com/?size=100&id=30106&format=png&color=000000"
                  alt=""
                />
                <p className="text-sm">Home</p>
              </div>
              <span className="min-w-7 h-5 rounded-xl bg-[#f5f5f5] dark:bg-[#202020] flex justify-center items-center text-xs px-1 text-gray-500 dark:text-gray-400">
                {
                  todos
                    ?.filter((todo) => {
                      return (
                        todo?.todoOwner === user?.$id &&
                        todo?.todoState === false
                      );
                    })
                    ?.map((todo) => {
                      return (
                        <Todo
                          key={todo?.id}
                          id={todo?.id}
                          todoOwner={todo?.todoOwner}
                          todoName={todo?.todoName}
                          todoState={todo?.todoState}
                        />
                      );
                    }).length
                }
              </span>
            </button>
            <button
              onClick={() => setSection("completed")}
              className={`w-full p-2 flex justify-between items-center ${
                section === "completed" && "bg-gray-200 dark:bg-[#282828]"
              } dark:text-white text-black rounded-lg`}
            >
              <div className="flex justify-center items-center gap-2">
                <span className="w-5 h-5 rounded-md border-[3px] border-black dark:border-[#404040]"></span>
                <p className="text-sm">Completed</p>
              </div>
              <span className="min-w-7 h-5 rounded-xl bg-[#f5f5f5] dark:bg-[#202020] flex justify-center items-center text-xs px-1 text-gray-500 dark:text-gray-400">
                {
                  todos
                    ?.filter((todo) => {
                      return (
                        todo?.todoOwner === user?.$id &&
                        todo?.todoState === true
                      );
                    })
                    ?.map((todo) => {
                      return (
                        <Todo
                          key={todo?.id}
                          id={todo?.id}
                          todoOwner={todo?.todoOwner}
                          todoName={todo?.todoName}
                          todoState={todo?.todoState}
                        />
                      );
                    }).length
                }
              </span>
            </button>
            <button
              onClick={() => setCreateTodo(!createTodo)}
              className="w-full p-2 flex justify-between items-center bg-[#1C1C1C] dark:bg-[#ebebeb] dark:text-black rounded-full transition-all active:bg-[#2F2F2F] mt-2"
            >
              <div className="flex justify-center items-center gap-2 px-2">
                <FaPlus size={14} color={darkTheme ? "#000" : "#fff"} />
                <p className="text-sm text-white dark:text-black">
                  Create new task
                </p>
              </div>
            </button>
          </main>
        </div>
      </div>
      <Tooltip id="collapse" />
      <button
        onClick={() => setHideSide(false)}
        data-tooltip-id="collapse"
        data-tooltip-content="Collapse"
        className={`absolute top-10 left-3 p-2 shadow-lg rounded-full flex justify-center items-center max-md:!hidden ${
          hideSide ? "flex" : "hidden"
        } bg-white hover:bg-gray-200 dark:bg-[#202020] dark:hover:bg-[#282828]`}
      >
        <FaCaretRight color={darkTheme ? "#fff" : "#000"} />
      </button>
      <div className="w-full h-full px-10 py-5 max-md:px-3 max-md:py-2 flex flex-col">
        <header className="w-full flex justify-between items-center">
          <div className="flex flex-col justify-center items-start">
            <h1 className="font-semibold text-lg max-md:text-base break-words dark:text-white text-black">
              Welcome Back, {user?.name}👋
            </h1>
            <p className="text-gray-500 text-sm max-md:text-xs pt-1 pb-3 dark:text-gray-400">
              Today,{" "}
              {currentDateArray[0] +
                " " +
                currentDateArray[1] +
                " " +
                currentDateArray[2] +
                " " +
                currentDateArray[3]}
            </p>
          </div>
          <div className="relative flex justify-center items-center gap-2">
            <button
              onClick={() => {
                setShowMenu(false);
                setShowCalender(!showCalender);
              }}
              className="bg-white active:bg-[#e1e1e1] dark:bg-[#202020] dark:active:bg-[#181818] dark:text-white transition-all p-3 rounded-md min-w-[5rem] h-[2.5rem] flex justify-start items-center gap-2"
            >
              <span className="bg-[#f5f5f5] dark:bg-[#323232] p-1 rounded-md flex justify-center items-center">
                <IoChevronDown color={darkTheme ? "#fff" : "#000"} />
              </span>
              <h1 className="text-sm max-md:text-xs text-black dark:text-white">
                {currentCalender}
              </h1>
            </button>
            <button
              onClick={() => {
                setShowCalender(false);
                setShowMenu(!showMenu);
              }}
              className="bg-white active:bg-[#e1e1e1] dark:bg-[#202020] dark:active:bg-[#181818] transition-all p-2 rounded-md flex justify-center items-center w-[2.5rem] h-[2.5rem]"
            >
              <FaBars color={darkTheme ? "#fff" : "#000"} />
            </button>
            <div
              className={`absolute top-12 -left-40 max-md:-left-44 ${
                showCalender ? "flex" : "hidden"
              } transition-all rounded-lg z-[200] bg-white dark:bg-[#171717] shadow-lg w-fit h-fit`}
            >
              <Calendar
                compact
                isoWeek={false}
                style={{ width: 320 }}
                onChange={handleSelectCalender}
                className="dark:text-white text-black"
              />
            </div>
            <div
              className={`absolute top-12 -left-10 max-md:-left-16 ${
                showMenu ? "flex" : "hidden"
              } transition-all flex-col justify-start items-center gap-2 p-2 rounded-lg z-[300] bg-white dark:bg-[#202020] dark:text-white shadow-lg w-52 h-fit`}
            >
              <label className="hover:bg-[#f5f5f5] transition-all switch cursor-pointer rounded-md py-2 px-3 h-fit bg-white dark:bg-[#202020] dark:hover:bg-[#181818] flex justify-between items-center w-full">
                <p className="text-sm text-black dark:text-white">Dark mode</p>
                <label className="switch">
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
                  <span className="slider"></span>
                </label>
              </label>
              <button
                onClick={logout}
                className="hover:bg-[#f5f5f5] transition-all cursor-pointer rounded-md py-2 px-3 h-fit bg-white dark:bg-[#202020] dark:hover:bg-[#181818] flex justify-between items-center w-full"
              >
                <p className="text-sm text-black dark:text-white">Logout</p>
                <img
                  className="w-[1.4rem] h-[1.4rem]"
                  src={`https://img.icons8.com/?size=100&id=24337&format=png&color=${
                    darkTheme ? "ffffff" : "000000"
                  }`}
                  alt=""
                />
              </button>
            </div>
          </div>
        </header>
        <main className="w-full h-full py-3 flex flex-col gap-3 overflow-y-auto main">
          <div className="relative flex justify-between items-center w-full mb-1 pb-2">
            <button
              onClick={() => {
                sectionRef.current.classList.remove("toRight");
                sectionRef.current.classList.add("toLeft");
                setSection("home");
              }}
              className="flex justify-center items-center w-[50%]"
            >
              Home
            </button>
            <button
              onClick={() => {
                sectionRef.current.classList.remove("toLeft");
                sectionRef.current.classList.add("toRight");
                setSection("completed");
              }}
              className="flex justify-center items-center w-[50%]"
            >
              Completed
            </button>
            <div
              ref={sectionRef}
              className="absolute left-0 bottom-0 toLeft rounded-lg h-[.1rem] w-[50%] dark:bg-white bg-black"
            ></div>
          </div>
          {isLoading ? (
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          ) : section === "home" ? (
            todos
              ?.filter((todo) => {
                return (
                  todo?.todoOwner === user?.$id && todo?.todoState === false
                );
              })
              ?.map((todo) => {
                return (
                  <Todo
                    key={todo?.id}
                    id={todo?.id}
                    todoOwner={todo?.todoOwner}
                    todoName={todo?.todoName}
                    todoState={todo?.todoState}
                  />
                );
              })
          ) : (
            todos
              ?.filter((todo) => {
                return (
                  todo?.todoOwner === user?.$id && todo?.todoState === true
                );
              })
              ?.map((todo) => {
                return (
                  <Todo
                    key={todo?.id}
                    id={todo?.id}
                    todoOwner={todo?.todoOwner}
                    todoName={todo?.todoName}
                    todoState={todo?.todoState}
                  />
                );
              })
          )}
        </main>
      </div>
      <div
        className={`${
          createTodo ? "flex" : "hidden"
        } absolute flex justify-center items-end rounded-lg z-[100] bottom-5 left-[50%] translate-x-[-50%] shadow-2xl`}
      >
        <div className="w-[25rem] max-sm:w-[20rem] h-fit bg-white dark:bg-[#202020] todo rounded-lg flex flex-col justify-start items-center gap-3 p-2">
          <div className="flex justify-end items-center w-full">
            <button
              onClick={() => {
                setTodoName("");
                setTodoDate("");
                setCreateTodo(false);
              }}
              className="dark:hover:bg-[#181818] w-7 h-7 rounded-md flex justify-center items-center transition-all"
            >
              <IoClose size={18} color={darkTheme ? "#fff" : "#000"} />
            </button>
          </div>
          <input
            type="text"
            className="bg-[#e1e1e1] dark:bg-[#171717] w-full transition-all focus:bg-[#f5f5f5] dark:focus:bg-[#242424] placeholder:text-sm border-none outline-none text-sm placeholder:text-gray-500 dark:text-white text-black px-3 py-2 rounded-lg"
            placeholder="Enter your task"
            value={todoName}
            onChange={(e) => {
              setTodoName(e.target.value);
            }}
          />
          <DatePicker
            oneTap
            style={{ width: "100%" }}
            onChange={handleSelectDate}
          />
          <TimePicker
            onChange={handleSelectTime}
            placeholder="Select Time"
            style={{ width: "100%" }}
          />
          <div className="w-full flex justify-end items-center">
            <button
              onClick={() => {
                addTodo();
                setTodoDate("");
                setCreateTodo(false);
              }}
              className="px-3 py-1 bg-teal-600 active:bg-teal-700 transition-all text-white rounded-lg font-sans"
            >
              Create
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={() => setCreateTodo(!createTodo)}
        className="absolute bottom-5 right-5 w-12 h-12 md:hidden flex justify-center items-center rounded-full transition-all active:scale-90 bg-[#1C1C1C] dark:bg-[#ebebeb]"
      >
        <IoAdd color={darkTheme ? "#000" : "#fff"} size={22} />
      </button>
    </div>
  );
}
