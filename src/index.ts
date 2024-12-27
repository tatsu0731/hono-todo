import { Hono } from 'hono'

const app = new Hono()

type Todo = {
  id: number;
  title: string;
  delete_flg: boolean;
};

let todos: Todo[] = [
  {id: 1, title: "Reactを勉強", delete_flg: false },
  {id: 2, title: "Vueを勉強", delete_flg: false },
  {id: 3, title: "Golangを勉強", delete_flg: false },
]

app.get('/', (c) => {
  return c.text('Hello Hono!!!!!')
})

// Todo一覧取得API
app.get("/api/todos", (c) => c.json(todos.filter((todo) => !todo.delete_flg)))

// Todo登録API
app.post("/api/todos", async (c) => {
  const { title } = await c.req.json<{ title: string }>();
  if (!title) {
    return c.json({ message: "タイトルは必須です" }, 400);
  }
  // ここのやり方試す
  const newId = todos[todos.length - 1].id + 1;
  // const newId = todos.length + 1;
  const newTodo: Todo = { id: newId, title, delete_flg: false };
  todos = [...todos, newTodo];
  return c.json(newTodo);
})

app.put("/api/todos/:id", async (c) => {
  const id = c.req.param("id");
  const index = todos.findIndex((todo) => todo.id === Number(id));

  if (index === -1) {
    return c.json({message: "Todoは存在しません"}, 404);
  }

  const {title} = await c.req.json<{title: string}>();
  if (!title) {
    return c.json({message: "タイトルは必須です"}, 400);
  }
  todos[index] = {...todos[index], title};
  return c.json(todos[index]);
});


export default app
