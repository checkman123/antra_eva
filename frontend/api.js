export const Api = (() => {
  // const baseUrl = "https://jsonplaceholder.typicode.com";
  const baseUrl = "http://localhost:3000";
  const path = "todos";

  const getTodos = () =>
    fetch([baseUrl, path].join("/")).then((response) => response.json());

  const deleteTodo = (id) =>
    fetch([baseUrl, path, id].join("/"), {
      method: "DELETE",
    });

  const addTodo = (todo) =>
    fetch([baseUrl, path].join("/"), {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((response) => response.json());

  const editTodo = (todo, id) => {
    const data = fetch([baseUrl, path, id].join("/"), {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  };

  return {
    getTodos,
    deleteTodo,
    addTodo,
    editTodo,
  };
})();
