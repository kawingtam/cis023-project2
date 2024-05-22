const users = JSON.parse(localStorage.getItem('users')) || {};

document.getElementById('login-btn').addEventListener('click', () => {
    const username = document.getElementById('username-input').value.trim();
    if (username) {
        if (!users[username]) {
            users[username] = [];
        }
        localStorage.setItem('users', JSON.stringify(users));
        loadUser(username);
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('todo-section').style.display = 'none';
    document.getElementById('username-input').value = '';
});

function loadUser(username) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('todo-section').style.display = 'block';
    document.getElementById('user-name').textContent = username;
    renderTasks(username);
}

document.getElementById('add-task-btn').addEventListener('click', () => {
    const taskName = document.getElementById('task-name').value.trim();
    const taskPriority = document.getElementById('task-priority').value;
    const taskDueDate = document.getElementById('task-due-date').value;
    const username = document.getElementById('user-name').textContent;

    if (taskName && taskDueDate) {
        const newTask = { name: taskName, priority: taskPriority, dueDate: taskDueDate };
        users[username].push(newTask);
        localStorage.setItem('users', JSON.stringify(users));
        renderTasks(username);
    }
});

function renderTasks(username) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    const tasks = [...users[username]];

    tasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <span>${task.name} - ${task.priority} - ${task.dueDate}</span>
            <div class="task-actions">
                <button class="edit-btn" onclick="editTask('${username}', ${index})">Edit</button>
                <button class="delete-btn" onclick="deleteTask('${username}', ${index})">Delete</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
}

function deleteTask(username, index) {
    users[username].splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users));
    renderTasks(username);
}

function editTask(username, index) {
    const task = users[username][index];
    document.getElementById('task-name').value = task.name;
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-due-date').value = task.dueDate;
    deleteTask(username, index);
}

function sortTasks(attribute, order) {
    const username = document.getElementById('user-name').textContent;
    let tasks = [...users[username]];

    if (attribute === 'name') {
        tasks.sort((a, b) => a.name.localeCompare(b.name));
    } else if (attribute === 'priority') {
        const priorityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
        tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (attribute === 'dueDate') {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    if (order === 'desc') {
        tasks.reverse();
    }

    users[username] = tasks;
    localStorage.setItem('users', JSON.stringify(users));
    renderTasks(username);
}

// Ensure the username prompt is shown each time the app is opened
window.addEventListener('load', () => {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('todo-section').style.display = 'none';
});
