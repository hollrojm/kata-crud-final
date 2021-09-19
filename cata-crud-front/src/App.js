import React, {useContext, useReducer, useEffect, createContext} from 'react';

const HOST_API = "Http://localhost:8080/api";
const initialState = {
  list:[]
};

const Store = createContext(initialState)

const Form =()=> {

  return <form ref= {formRef}>
    <input type="text" name="name" onChange={(event)=>{
      setState({ ...state, name: event.target.value})
    }}></input>
    <input type="text" name="description" onChange={(event)=>{
      setState({ ...state, description: event.target.value})
    }}></input>
    <button onClick={onAdd}>Agregar</button>
  </form>

}

const List = () =>{
  //Almacen donde se guardan los estados internos de la app
    const {dispatch, state} = useContext(store);

useEffect(()=>{

  fetch(HOST_API + "/todos")
  .then(response => response.json())
  .then((list)=>{
    dispatch({type: "update-list", list})
  }, [state.list.length,dispatch]);

})
  return <div>
    <table >
      <thead>
        <tr>
          <td>ID</td>
          <td>Tarea</td>
          <td>¿Esta Completado?</td>
        </tr>
      </thead>
      <tbody>
        {currentList.map((todo) => {
          return <tr key={todo.id} >
            <td>{todo.id}</td>
            <td>{todo.name}</td>
            <td>{todo.isCompleted}</td>
            <td><button onClick={() => onDelete(todo.id)}>Eliminar</button></td>
            <td><button onClick={() => onEdit(todo)}>Editar</button></td>
          </tr>
        })}
      </tbody>
    </table>
  </div>
} 

//Funcion pura entra misma salida, gestor que implementa la logica


function reducer(state, action){
  switch (action, type){
    case'update-list':
      return{...state, list: action.list}
    case 'add-item':
      const newList = state.list;
      newList.push(action.item);
      return{...state, list: newList}
    default:
      return state;
  }
}

//Conectar entre si diferentes componetes 
const StoreProvider = ({children}) =>{

  
 const [state, dispatch] = useReducer(reducer, initialState);

 return <Store.Provider value= {{state, dispach}}>
   {children}
</Store.Provider>

}

function App() {
  return <StoreProvider>
    <List />
  </StoreProvider>
}


export default App;
