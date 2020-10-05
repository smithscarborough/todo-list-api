const express = require('express');
const bodyParser = require('body-parser');
const es6Renderer = require('express-es6-template-engine');
const methodOverride = require('method-override')

const app = express();
app.use(methodOverride('_method'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('html', es6Renderer); // use es6renderer for html view templates
app.set('views', 'templates'); // look in the 'templates' folder for view templates
app.set('view engine', 'html'); // set the view engine to use the 'html' views

app.use(express.static('./public'));

let todoList = [
  {
    id: 1,
    todo: 'Implement a REST API',
  },
];


// homepage route
app.get('/', (req, res) => {
  const name = req.query.name || 'World';
  
  res.render('home', {
    locals: {
      name: name,
      title: 'Home'
    },
    partials: {
      head: 'partials/head'
    }
  });
})

// GET request to the /todos route
app.get('/todos', (req, res) => {
  res.render('todos', { // use the templates/todos.html file
    locals: {
      todos: todoList, // make the 'data' variable available to the template as 'todos'
      title: 'Todos', // pass the 'Friends' string as 'title'
      message: null
    },
    partials: {
      head: 'partials/head'
    }
  })
})

app.post('/todos', (req, res) => {
  if (!req.body || !req.body.todo) {
    res.status(400).render('todos', { // use the templates/todos.html file
      locals: {
        todos: todoList, // make the 'data' variable available to the template as 'todos'
        title: 'Todos', // pass the 'Friends' string as 'title'
        message: 'Please Enter Todo Text'
      },
      partials: {
        head: 'partials/head'
      }
    })
    return;
  }
  const prevId = todoList.reduce((prev, curr) => {
    return prev > curr.id ? prev : curr.id;
  }, 0);
  const newTodo = {
    id: prevId + 1,
    todo: req.body.todo,
  };
  todoList.push(newTodo);

  res.status(201).render('todos', { // use the templates/todos.html file
    locals: {
      todos: todoList, // make the 'data' variable available to the template as 'todos'
      title: 'Todos', // pass the 'Friends' string as 'title'
      message: 'New Todo Added'
    },
    partials: {
      head: 'partials/head'
    }
  })
})

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;

  const todoIndex = todoList.findIndex(element => {
    if (element.id == id) {
      return true;
    }
    return false;
  })

  if (todoIndex === -1) {
    // send a 404 status
    res.status(404).send('Todo not found');
  } else {
    // otherwise, delete the object at the index found
    todoList.splice(todoIndex, 1);
    // send a 204 (no content) response
    res.status(204).redirect('/todos');
  }
})

// GET /api/todos
app.get('/api/todos', (req, res) => {
  res.json(todoList);
});

// GET /api/todos/:id
app.get('/api/todos/:id', (req, res) => {
  const todo =
    todoList.find((todo) => {
      return todo.id === Number.parseInt(req.params.id);
    }) || {};
  const status = Object.keys(todo).length ? 200 : 404;
  res.status(status).json(todo);
});

// POST /api/todos
app.post('/api/todos', (req, res) => {
  if (!req.body || !req.body.todo) {
    res.status(400).json({
      error: 'Provide todo text',
    });
    return;
  }
  const prevId = todoList.reduce((prev, curr) => {
    return prev > curr.id ? prev : curr.id;
  }, 0);
  const newTodo = {
    id: prevId + 1,
    todo: req.body.todo,
  };
  todoList.push(newTodo);
  res.json(newTodo);
});

// PUT /api/todos/:id
app.put('/api/todos/:id', (req, res) => {
  if (!req.body || !req.body.todo) {
    res.status(400).json({
      error: 'Provide todo text',
    });
    return;
  }
  let updatedTodo = {};
  todoList.forEach((todo) => {
    if (todo.id === Number.parseInt(req.params.id)) {
      todo.todo = req.body.todo;
      updatedTodo = todo;
    }
  });
  const status = Object.keys(updatedTodo).length ? 200 : 404;
  res.status(status).json(updatedTodo);
});

// DELETE /api/todos/:id
app.delete('/api/todos/:id', (req, res) => {
  let found = false;
  todoList = todoList.filter((todo) => {
    if (todo.id === Number.parseInt(req.params.id)) {
      found = true;
      return false;
    }
    return true;
  });
  const status = found ? 200 : 404;
  res.status(status).json(todoList);
});

app.listen(3000, function () {
  console.log('Todo List API is now listening on port 3000...');
});
