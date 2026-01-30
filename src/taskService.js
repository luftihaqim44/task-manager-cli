const fs = require('fs').promises;
const path = require('path');

// Go up one level (..) then into data/tasks.json
const tasksFile = path.join(__dirname, '..', 'data', 'tasks.json');

async function getTasks() {
    // Check if file exists, if not create empty list
    try {
        await fs.access(tasksFile);
    } catch (error) {
        await fs.writeFile(tasksFile, '[]');
    }
    const fileContent = await fs.readFile(tasksFile, 'utf-8');
    return JSON.parse(fileContent);
}

async function saveTasks(tasks) {
    await fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2));
}

module.exports = {
    add: async (title, priority) => {
        const tasks = await getTasks();
        const newTask = {
            id: tasks.length + 1,
            title: title,
            completed: false,
            priority: priority || 'low',
            createdAt: new Date().toLocaleString()
        };
        tasks.push(newTask);
        await saveTasks(tasks);
        console.log('Task added');
    },

    list: async (filter, level) => {
        let list = await getTasks();

        if (filter === '--completed') {
            list = list.filter(item => item.completed === true);
        } else if (filter === '--pending') {
            list = list.filter(item => item.completed === false);
        } else if (filter === '--priority') {
            list = list.filter(item => item.priority === level);
        }

        console.log("Task List:");
        list.forEach(function(task) {
            console.log(task.id + ': ' + task.title + ' [' + task.priority + '] - ' + task.completed);
        });
    },

    done: async (id) => {
        const tasks = await getTasks();
        tasks.forEach(function(task) {
            if (task.id === Number(id)) {
                task.completed = true;
            }
        });
        await saveTasks(tasks);
        console.log('Task finished');
    },

    delete: async (id) => {
        const tasks = await getTasks();
        const newList = tasks.filter(task => task.id !== Number(id));
        await saveTasks(newList);
        console.log('Task delete');
    }
};