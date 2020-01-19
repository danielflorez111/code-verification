const taskForm = document.getElementById('task-form'),
    taskName = document.getElementById('task-name'),
    taskPriority = document.getElementById('task-priority'),
    taskDeadline = document.getElementById('task-deadline'),
    addTaskButton = document.getElementById('add-task-button'),
    updateTaskButton = document.getElementById('update-task-button'),
    cancelTaskButton = document.getElementById('cancel-task-button'),
    tasksList = document.getElementById('task-list');

var updateTaskId = null;

addTaskButton.addEventListener('click', createTask);
updateTaskButton.addEventListener('click', updateTask);
cancelTaskButton.addEventListener('click', cancelUpdateTask);
renderTaskList();

/**
 * Creates a new task and renders it in the list
 */
function createTask() {
    const task = {
        id: getId(),
        name: taskName.value,
        priority: taskPriority.value,
        deadline: taskDeadline.value,
    };

    if (taskName.value.trim() === '' || taskDeadline.value.trim() === '') {
        alert('Please fill-in all the fields');
        return;
    }

    saveTask(task);
    renderTaskList();
    resetInput();
}

/**
 * Render all the tasks stored in localStorage
 */
function renderTaskList() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasksList.innerHTML = '';

    tasks.forEach(task => {
        tasksList.innerHTML += `
        <div class="item">
            <div class="right floated content">
                <div onclick="editTask('${task.id}');" class="ui positive basic button">Edit</div>
                <div onclick="deleteTask('${task.id}');" class="ui negative basic button">Delete</div>
            </div>
            <div class="content">
                <span class="header">${task.name}</span>
                <div class="description">${task.deadline}  <span><b>${task.priority}</b></span></div>
            </div>
        </div>`
    });
}

/**
 * Clears the input fields
 */
function resetInput() {
    taskName.value = '';
    taskPriority.value = 'Low';
    taskDeadline.value = '';
}

/**
 * Saves a task in localStorage
 * @param {object} task task to save
 */
function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Deletes a task from localStorage
 * @param {number} taskId task id to delete
 */
function deleteTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks = tasks.filter(task => task.id !== taskId)
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
}

/**
 * Handles edit button
 * @param {number} taskId task id to edit
 */
function editTask(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.id === taskId);
    updateTaskId = taskId;

    if (task) {
        taskName.value = task.name;
        taskPriority.value = task.priority;
        taskDeadline.value = task.deadline;
    }

    addTaskButton.style.display = 'none';
    updateTaskButton.style.display = 'inline-block';
    cancelTaskButton.style.display = 'inline-block';
}

/**
 * Cancels update action and show Save button again
 */
function cancelUpdateTask() {
    updateTaskId = null;
    addTaskButton.style.display = 'inline-block';
    updateTaskButton.style.display = 'none';
    cancelTaskButton.style.display = 'none';
    resetInput();
}

/**
 * Updates a task in localStorage
 */
function updateTask() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.id == updateTaskId);

    if (taskName.value.trim() === '' || taskDeadline.value.trim() === '') {
        alert('Please fill-in all the fields');
        return;
    }

    tasks[taskIndex].name = taskName.value;
    tasks[taskIndex].priority = taskPriority.value;
    tasks[taskIndex].deadline = taskDeadline.value;

    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
    cancelUpdateTask();
}

/**
 * Generates a random id
 * @return {id} random id
 */
function getId() {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
}
