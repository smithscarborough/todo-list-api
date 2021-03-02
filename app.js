const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//tell it to use these bodyparsers:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//tell it to put all of our static files in the public folder:
app.use(express.static('./public'));

// this is our temporary database (like the 'friends' file in our previous exercise): 
const todoList = [
  {
    id: 1,
    description: 'Implement a REST API',
    completed: false,
  },
  {
    id: 2,
    description: 'Build a frontend',
    completed: false,
  },
  {
    id: 3,
    description: '???',
    completed: false,
  },
  {
    id: 4,
    description: 'Profit!',
    completed: false,
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

// POST /api/todos (this creates a new to-do)
app.post('/api/todos', (req, res) => {
  if (req.body.description) {
    console.log(req.body.description);
    const newTodo = {
      id: nextId++,
      description: req.body.description,
      completed: false
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
  if (req.body.description || req.body.description === '' || req.body.completed) {
    // get ID from route
    const id = Number(req.params.id);
    // find where the todo exists in the todoList array:
    const todoIndex = todoList.findIndex((currTodo) => currTodo.id === id)
    // update the object inside fo the todoList array
    // if there is a description on the request body:
    if (req.body.description) {
      // set it on the todo item
      todoList[todoIndex].description = req.body.description
    }
    // conditional to determine whether the data, which is in JSON, is true or false
    // if the completed status is true or 'true':
    if (req.body.completed === 'true' || req.body.completed === true) {
      todoList[todoIndex].completed = true
      // else if it is false or 'false'
    } else if (todoList[todoIndex].completed === 'false' || req.body.completed === false) {
      todoList[todoIndex].completed = false
    }
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
