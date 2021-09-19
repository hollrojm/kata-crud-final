import React, {useContext, useReducer} from 'react';

const HOST_API = "Http://localhost:8080/api";
const initialState = {
  list:[]
}

//Almacen donde se guardan los estados internos de la app
const {dispach, state} = useContext(store);

const List = () =>{
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
    
  </StoreProvider>
}


export default App;
