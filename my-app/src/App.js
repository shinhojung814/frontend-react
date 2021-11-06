import { useState } from "react";

function App() {
  const [todo, setTodo] = useState("");
  const onChange = (event) => setTodo(event.target.value);
  const onSubmit = (event) => {
    event.preventDefault();
    if (todo === "") {
      return;
    }
    setTodo("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="FILL IN YOUR LIST"
          value={todo}
          onChange={onChange}
        />
        <button>ADD TO-DO</button>
      </form>
    </div>);
}

export default App;