import React, { useEffect, useState } from "react"
import './TodoList.css'
import axios from "axios"

interface todoType {
    text: string
    done: boolean
}


function TodoList() {
    let [todoLists, setTodoLists] = useState<todoType[]>([])
    let [inputValue, setInputValue] = useState<string>('');

    function updateDataToDatabase() {
        const user = localStorage.getItem('user')
        console.log("local user")
        console.log(user)
        if (user) {
            const parsedUser = JSON.parse(user)
            const updatedUser = parsedUser
            updatedUser.todoList = todoLists
            console.log(updatedUser)
            localStorage.setItem('user', JSON.stringify(updatedUser))
            setTimeout(async (user: any) => {
                let response = await axios.post("https://allinoneapi.onrender.com/insertUserList", {
                    "id": user.id,
                    "listName": "todoList",
                    "value": user.todoList
                })
                console.log(response)
            }, 2000, updatedUser)
        }
    }
    useEffect(() => {
        if (todoLists.length > 0)
            updateDataToDatabase()
    }, [todoLists])

    useEffect(() => {
        const user = localStorage.getItem('user')
        if (user) {
            const parsedUser = JSON.parse(user)
            const list = parsedUser.todoList
            setTodoLists(list)
        }
    }, [])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    function handleChecking(event: React.MouseEvent<HTMLLIElement, MouseEvent>) {
        let changeIndex = Number(event.currentTarget.getAttribute('data-key'))
        setTodoLists(prevTodoLists =>
            prevTodoLists.map((todo, index) =>
                index === changeIndex
                    ? { ...todo, done: !todo.done }  // Toggle the done status
                    : todo
            )
        );
        console.log(todoLists)

    }

    function handleRemove(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation()
        let removeIndex = Number(event.currentTarget.getAttribute('data-key'))
        setTodoLists(prevTodoLists =>
            prevTodoLists.filter((todo, index) => {
                todo.done = todo.done
                return index != removeIndex
            }
            )
        );
        console.log(todoLists)
    }

    const handleAdding = () => {
        if (inputValue == '') return
        let newTodo: todoType = {
            text: inputValue,
            done: false
        }
        setTodoLists(prevTodoLists => [...prevTodoLists, newTodo])
        setInputValue('')
    }

    return <div className="card">
        <div className="container-fluid d-flex align-items-center">
            <div className="d-flex w-100" style={{ padding: '5px' }}>
                <h4 className="" style={{ width: '160px' }}>Todo Lists</h4>
                <input
                    className="form-control"
                    id="todo-input"
                    type="text"
                    style={{ maxHeight: '50px', maxWidth: '80%' }}
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Enter new task"></input>
                <button
                    className="btn btn-secondary"
                    style={{ padding: '6px', width: '50px', marginLeft: '10px' }}
                    onClick={handleAdding}
                >ADD</button>
            </div>
        </div>
        <ul className="list-group ">
            {
                todoLists.map((todoItems, index) => (
                    <li
                        className={todoLists[index].done == true
                            ? "container-fluid d-flex list-group-item highlighted"
                            : "container-fluid d-flex list-group-item unhighlighted"
                        }
                        key={index}
                        data-key={index}
                        onClick={(event) => handleChecking(event)}
                        style={{ padding: '10px 20px 10px 20px' }}
                    >
                        <div className="col" style={{ width: '50%' }}>{todoItems.text}</div>
                        <div className="col" style={{ width: '50%' }}>
                            <button
                                className="btn-close"
                                aria-label="Close"
                                style={{ width: '40px', position: 'relative', left: '90%', marginRight: '20px', zIndex: '999' }}
                                onClick={(event) => handleRemove(event)}
                                data-key={index}
                            >
                            </button>
                        </div>
                    </li>
                ))
            }
        </ul>
    </div>

}

export default TodoList