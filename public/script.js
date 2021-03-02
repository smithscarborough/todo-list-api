function getAllTodos() {
    // get data from API
    axios.get('/api/todos')
        .then(response => {
            // console.log(response.data); // test the response in console to make sure it's working
            // use data to render todos on page
            const todosContainer = document.querySelector('#todosContainer')
            // loop over each todo in the response and make an array of HTML strings
            const todosHtml = response.data.map(todo => {
                return `<li class="${todo.completed ? 'complete' : 'incomplete'}">
                ${todo.description}
                <button onclick="setCompleteStatus('${todo.id}', '${!todo.completed}')">
                ${ todo.completed ? '❌' : '✅'}</button>
                <button onclick="deleteTodo('${todo.id}')">🗑</button>
                <button id="editBtn" onclick="editTodo('${todo.id}')">Edit</button>
                </li>`
            }).join('') // join the array with an empty string to make it one big string
            // set the innerHTML of the todosContainer to the HTML we just created
            todosContainer.innerHTML = todosHtml
        })
    // use that data to render todos onto page (which means we'll probably have a second function to renderDataOnPage)
}

function setCompleteStatus(id, status) {
    axios.patch(`/api/todos/${id}`, {
        completed: status
    })
    .then(() => {
        getAllTodos();
    })
}


function addNewTodo(description) {
    // send POST request to API
    return axios.post('/api/todos', {
        description: description // set description in request body
    })
}

function editTodo(id, oldDescription) {
    const description = prompt('What do you want to change the to-do to? ', `${oldDescription}`)
    return axios.patch(`/api/todos/${id}`, {
        description: description
    })
    .then(() => {
        getAllTodos()
    })
}


function deleteTodo(id) {
    axios.delete(`/api/todos/${id}`)
        .then(() => {
            getAllTodos();
        })
}

// fetch all todos on load
getAllTodos();

// find the form on the page and add event listener to the form
const todosForm = document.querySelector('#todosForm')
todosForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = e.target.elements.description.value
    addNewTodo(description)
    .then(() => {
        todosForm.elements.description.value = ''
        getAllTodos();
    })
})


// const todosHtml = response.data.map(todo => {
//         return `<li>
//         ${todo.description}
//         <button onclick="deleteTodo('${todo.id}')">🗑</button>
//         </li>`
//     }).join('') // join the array with an empty string to make it one big string
//     // set the innerHTML of the todosContainer to the HTML we just created
//     todosContainer.innerHTML = todosHtml


// function editTodo(id) {
//     const description = prompt('What would you like to edit? ')
//     return axios.patch(`/api/todos/${id}`, {
//         description: description
//     })
// }