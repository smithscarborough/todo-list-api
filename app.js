const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//tell it to use these bodyparsers:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//tell it to put all of our static files in teh public folder:
app.use(express.static('./public'));

// this is our temporary database (like the 'friends' file in our previous exercise): 
const todoList = [
  {
    id: 1,
    description: 'Implement a REST API',
  },
  {
    id: 2,
    description: 'Build a frontend',
  },
  {
    id: 3,
    description: '???',
  },
  {
    id: 4,
    description: 'Profit!',
  },
];

let nextId = 5;

// GET /api/todos
app.get('/api/todos', (req, res) => {
  res.json(todoList); // sends back todoList array as JSON (this is our first route)
})
// GET /api/todos/:id
app.get('/api/todos/:id', (req, res) => {
  // get id from route
  const id = req.params.id;
  // use id to find one todo item
  const todo = todoList.find((currTodo) => {
    if (currTodo.id === id) {
      return true;
    } else {
      return false;
    }
  })

  if (!todo) {
    res.status(404).json({
      error: `Could not find todo with ID: ${id}`
    })
  } else {
  // send back todo
  res.json(todo)
  }
})

// POST /api/todos
app.post('/api/todos', (req, res) => {
  if (req.body.description) {
    console.log(req.body.description);
    const newTodo = {
      id: nextId++,
      description: req.body.description
    }
    todoList.push(newTodo);
    res.status(201);
    res.send();
  } else {
    res.status(422); // 422 means 'unprocessable entity'
    res.json({
      error: 'please add a description'
    })
  }
})
// PUT /api/todos/:id
app.patch('/api/todos/:id', (req, res) => {
  // if req.body ontains a description:
  if (req.body.description || req.body.description.length === '') {
    // get ID from route
    const id = Number(req.params.id);
    // find where the todo exists in the todoList array:
    const todoIndex = todoList.findIndex((currTodo) => currTodo.id === id)
    // update the object inside fo the todoList array:
    todoList[todoIndex].description = req.body.description
    // send back the updated todo item:
    res.json(todoList[todoIndex])
  } else {
    res.status(422).json({
      error: 'Please provide description'
    })
  }
})

// DELETE /api/todos/:id
app.delete('/api/todos/:id', (req, res) => {
  // get ID from route:
  const id = Number(req.params.id);
  // find where the todo exists in the todoList array:
  const todoIndex = todoList.findIndex((currTodo) => currTodo.id === id)
  if (todoIndex !== -1) {
  // remove it from the array:
  todoList.splice(todoIndex, 1)
  // respond with appropriate status/response:
  res.status(204).json()
  } else {
    res.status(404).json({ error: `Could not find todo with id: ${id}`})
  }
})

app.listen(3000, function () {
  console.log('Todo List API is now listening on port 3000...');
});
