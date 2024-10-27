import { useContext, useRef, useState } from "react";
import { IoMdMore } from "react-icons/io";
import { IoPencil, IoTrash } from "react-icons/io5";
import "./Todo.css";
import { ThemeContext } from "../../Context/Context";
import { supabase } from "../../utils/supabase";

export default function Todo({ todoName, todoState, todoOwner, id }) {
  let { darkTheme, todos, setTodos } = useContext(ThemeContext);
  let todoOptionRef = useRef(null);
  let todoNameRef = useRef(null);
  let [showEdit, setShowEdit] = useState(false);
  let [tempTodoName, setTempTodoName] = useState(todoName);
  let updateTodo = async (newTodoName, todoOwner, id) => {
    let { data, error } = await supabase
      .from("todos")
      .update({ todoName: newTodoName })
      .eq("id", id)
      .eq("todoOwner", todoOwner)
      .select("*");
    if (error) console.error("Error adding todo:", error);
    else {
      console.log("Added new todo:", data);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo?.id === id ? { ...todo, todoName: newTodoName } : todo
        )
      );
    }
  };
  let updateTodoState = async (newTodoState, todoOwner, id) => {
    let { data, error } = await supabase
      .from("todos")
      .update({ todoState: newTodoState })
      .eq("id", id)
      .eq("todoOwner", todoOwner)
      .select("*");
    if (error) console.error("Error adding todo:", error);
    else {
      console.log("Added new todo:", data);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo?.id === id ? { ...todo, todoState: newTodoState } : todo
        )
      );
    }
  };
  let deleteTodo = async (todoOwnwer, id) => {
    let { data, error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id)
      .select("*");
    if (error) console.error("Error adding todo:", error);
    else {
      console.log("Added new todo:", data);
      setTodos(
        todos?.filter((todo) => {
          return todo?.id !== id;
        })
      );
    }
  };
  return (
    <div className="flex flex-col justify-center items-center gap-2 bg-white dark:bg-[#202020] dark:text-white text-black px-3 py-2 rounded-lg w-full h-fit">
      <div className="w-full h-fit flex justify-between items-center">
        <div className="flex justify-center items-center gap-3">
          {todoState === false && (
            <label className="checkBox whiteShadow">
              <input
                id="ch1"
                type="checkbox"
                onChange={(e) => {
                  updateTodoState(e.target.checked, todoOwner, id);
                }}
              />
              <div></div>
            </label>
          )}
          {showEdit ? (
            <input
              ref={todoNameRef}
              className="border-none outline-none p-1 pl-2 rounded-lg text-sm max-md:w-[12rem] max-lg:w-[15rem] w-[30rem] dark:bg-[#151515] bg-[#e1e1e1]"
              value={tempTodoName}
              onChange={(e) => setTempTodoName(e.target.value)}
              type="text"
            />
          ) : todoState ? (
            <s>
              <p className="text-sm max-w-[30rem] break-all pr-2">{todoName}</p>
            </s>
          ) : (
            <p className="text-sm max-w-[30rem] break-all pr-2">{todoName}</p>
          )}
        </div>
        <div className="relative flex justify-center items-center gap-2">
          <button
            onClick={() => {
              if (todoOptionRef.current.style.display === "block") {
                todoOptionRef.current.style.display = "none";
              } else {
                todoOptionRef.current.style.display = "block";
              }
            }}
            className="bg-[#f5f5f5] active:bg-[#e1e1e1] dark:bg-[#323232] dark:active:bg-[#242424] transition-all rounded-md w-8 h-8 flex justify-center items-center"
          >
            <IoMdMore size={22} color={darkTheme ? "#9ca3af" : "#4b5563"} />
          </button>
          <div
            ref={todoOptionRef}
            className="absolute top-10 right-0 w-[8rem] h-fit hidden z-[300] rounded-md dark:bg-[#202020] bg-[#f5f5f5] shadow-md"
          >
            {todoState === false && (
              <button
                onClick={() => {
                  todoOptionRef.current.style.display = "none";
                  setShowEdit(true);
                  todoNameRef?.current?.focus();
                }}
                className="flex justify-between items-center w-full p-2 text-sm rounded-t-md transition-all hover:bg-[#e1e1e1] dark:hover:bg-[#282828] dark:text-white text-black"
              >
                <p>Rename</p>
                <IoPencil color={darkTheme ? "#fff" : "#000"} />
              </button>
            )}
            <button
              onClick={() => {
                deleteTodo(todoOwner, id);
                todoOptionRef.current.style.display = "none";
              }}
              className={`flex justify-between items-center w-full p-2 text-sm ${
                todoState ? "rounded-md" : "rounded-b-md"
              } transition-all hover:bg-[#e1e1e1] dark:hover:bg-[#282828] dark:text-white text-black`}
            >
              <p>Delete</p>
              <IoTrash color={"#ef4444"} />
            </button>
          </div>
        </div>
      </div>
      <div
        className={`w-full flex justify-end items-center gap-3 ${
          showEdit ? "flex" : "hidden"
        }`}
      >
        <button
          onClick={() => {
            updateTodo(tempTodoName, todoOwner, id);
            setShowEdit(false);
          }}
          className="flex justify-center items-center ring-1 ring-green-500 text-green-500 hover:bg-green-500 hover:text-white text-sm transition-all py-1 px-2 max-md:text-xs rounded-md"
        >
          Confirm
        </button>
        <button
          onClick={() => setShowEdit(false)}
          className="flex justify-center items-center ring-1 ring-red-500 text-red-500 hover:bg-red-500 hover:text-white text-sm transition-all py-1 px-2 max-md:text-xs rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
