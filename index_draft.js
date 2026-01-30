const fs = require('fs');
const yargs = require('yargs');

const fileName = 'tasks.json';

// Read from file
function getTask() {
    const data = fs.readFileSync(fileName, 'utf8');
    return JSON.parse(data);
}

function saveTasks(tasks) {
    const data = JSON.stringify(tasks);
    fs.writeFileSync(fileName, data);
}

yargs.command({
    command: 'add',
    describe: 'Add a task',
    builder: {
        title: {
            describe: 'Task Title',
            demandOption: true,
            type: 'string'
        },
        priority: {
            describe: 'low, medium, or high',
            demandOption: true,
            type: 'string'
        }
    },
    handler(args) {
        const tasks = getTask();
        const newTask = {
            id: tasks.length + 1,
            title: args.title,
            completed: false,
            priority: args.priority,
            createdAt: new Date().toLocaleString()
        };

        tasks.push(newTask);
        saveTasks(tasks);

        console.log('Task added')
    }
});

// --- LIST ALL TASKS ---
yargs.command({
    command: 'list',
    describe: 'Show all tasks',
    handler() {
        const tasks = getTask();

        tasks.forEach((task) =>{
            console.log(task.id + '. [' + task.priority + '] ' + task.title + ' (Done: ' + task.completed + ')');
        })
    }
})

// --- COMPLETE A TASK ---
yargs.command({
    command: 'complete',
    describe: 'Mark task as done',
    builder: { id: { demandOption: true, type: 'number'}},
    handler(args) {
        const tasks = getTask();

        // Find the task and change it
        tasks.forEach((task) => {
            if (task.id === args.id) {
                task.completed = true;
            }
        });
        saveTasks(tasks);
        console.log('Task ' + args.id + ' completed')
    }
});

// --- DELETE A TASK ---
yargs.command({
    command: 'delete',
    describe: 'Remove a task',
    builder: { id: { demandOption: true, type: 'number'}},
    handler(args) {
        const tasks = getTask();

        // Keep everything except the one we want to delete
        const filteredTasks = tasks.filter((task) => {
            return task.id !== args.id;
        });

        saveTasks(filteredTasks);
        console.log('Task ' + args.id + ' deleted!');
    }
});

// --- FILTER TASKS ---
yargs.command({
    command: 'filter',
    describe: 'Filter by status or priority',
    builder: {
        status: { describe: 'true or false', type: 'boolean' },
        priority: { describe: 'low, medium, or high', type: 'string' },

    },
    handler(args) {
        let tasks = getTask();

        // Filter by completed status if provided
        if (args.status !== undefined) {
            tasks = tasks.filter((task) => task.completed === args.status);
        }

        // Filter by priority if provided
        if (args.priority !== undefined) {
            tasks = tasks.filter((task) => task.priority === args.priority);
        }

        tasks.forEach((task) => {
            console.log(task.id + '. ' + task.title + ' Priority: ' + task.priority);
        });
    }
});

yargs.parse()