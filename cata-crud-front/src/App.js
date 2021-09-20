import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  createContext,
} from "react";

const HOST_API = "http://localhost:8080/api/todo";
const initialState = {
  list: [],
  item: {},
};
const Store = createContext(initialState);

const Form = () => {
  //formRef nos permite identificar la referencia de un componente en especifico.
  //Se inicializa en nulo, se inicializa cuando el componente es creado.
  const formRef = useRef(null);
  const {
    dispatch,
    state: { item },
  } = useContext(Store);
  //Permite tener estados internos dentro del componente
  const [state, setState] = useState({ item });

  const onAdd = (event) => {
    event.preventDefault();

    const request = {
      name: state.name,
      id: null,
      isComplete: false,
    };

    fetch(HOST_API + "/todo", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((todo) => {
        dispatch({ type: "add-item", item: todo });
        setState({ name: "" });
        formRef.current.reset();
      });
  };

  const onEdit = (event) => {
    event.preventDefault();

    const request = {
      name: state.name,
      id: item.id,
      isComplete: item.isComplete,
    };

    fetch(HOST_API + "/todo", {
      method: "PUT",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((todo) => {
        dispatch({ type: "update-item", item: todo });
        setState({ name: "" });
        formRef.current.reset();
      });
  };

  return (
    <form ref={formRef}>
      <input
        type="text"
        name="name"
        defaultValue={item.name}
        onChange={(event) => {
          setState({ ...state, name: event.target.value });
        }}
      ></input>
      {item.id && <button onClick={onEdit}> Actualizar </button>}
      {!item.id && <button onClick={onAdd}> Agregar </button>}
    </form>
  );
};

const List = () => {
  const { dispatch, state } = useContext(Store);

  useEffect(() => {
    //El fetch es una forma de poder consultar algo por HTTP o cualquier recurso que este en la web
    //El fetch es una promesa de Javascript que se necesita responder
    fetch(HOST_API + "/todos")
      .then((response) => response.json())
      .then((list) => {
        dispatch({ type: "update-list", list });
      });
  }, [state.list.lenght, dispatch]);

  const onDelete = (id) => {
    fetch(HOST_API + "/" + id + "/todo", {
      method: "DELETE",
    }).then((list) => {
      dispatch({ type: "delete-item", id });
    });
  };

  const onEdit = (todo) => {
    dispatch({ type: "edit-item", item: todo });
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>Nombre</td>
            <td>¿Esta completado?</td>
          </tr>
        </thead>
        <tbody>
          {state.list.map((todo) => {
            return (
              <tr key={todo.id}>
                <td>{todo.id}</td>
                <td>{todo.name}</td>
                <td>{todo.isComplete === true ? "SI" : "NO"}</td>
                <td>
                  <button onClick={() => onDelete(todo.id)}> Eliminar</button>
                </td>
                <td>
                  <button onClick={() => onEdit(todo)}> Editar</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

//Reducer es una funcion pura. Dada una entrada siempre va a recibir la misma salida de esa entrada.
function reducer(state, action) {
  switch (action.type) {
    case "update-item":
      const listUpdateEdit = state.list.map((item) => {
        if (item.id === action.item.id) {
          return action.item;
        }
        return item;
      });
      return { ...state, list: listUpdateEdit, item: {} };
    case "delete-item":
      const listUpdate = state.list.filter((item) => {
        return item.id !== action.id;
      });
      return { ...state, list: listUpdate };

    case "update-list":
      return { ...state, list: action.list };
    case "edit-item":
      return { ...state, item: action.item };
    case "add-item":
      const newList = state.list;
      newList.push(action.item);
      return { ...state, list: newList };
    default:
      return state;
  }
}

//Proviver nos permite conectar diferentes componentes
const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
};

function App() {
  //El provider funciona como un contenedor de componentes
  return (
    <StoreProvider>
      <Form />
      <List />
    </StoreProvider>
  );
}
export default App;