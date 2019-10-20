const express = require("express");

const app = express();

let projects = [];
let request = 0;

app.use(express.json());

/** Middlewares */

/** Check projects exists */
const checkList = (req, res, next) => {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);

    if (!project) return res.status(400).json({ error: 'Project does not exists' });

    req.project = project;

    return next();
}

/** Generate log  */
const changeLogs = (req, res, next) => {
    request++;

    console.log(`${req.method} - ${req.url} :: Request Number: ${request}`);

    return next();
}

/** Route edit id projects */
app.put('/projects/:id', checkList, changeLogs, (req, res) => {
    const { title } = req.body;

    req.project.title = title;

    return res.json(req.project);
});

/** Route create projects */
app.post('/projects', changeLogs, (req, res) => {
    const { id, title } = req.body;

    projects.push({ id: id, title: title, tasks: [] });

    return res.json(projects);
});

/** Route list projects */
app.get('/projects', (req, res) => {
    res.json(projects);
});

/** Route list projects for id */
app.delete('/projects/:id', checkList, changeLogs, (req, res) => {
    projects.splice(req.projectIndex, 1);
    
    return res.json(projects);
});

/** Route list add taskt to project id */
app.post('/projects/:id/tasks', checkList, changeLogs, (req, res) => {
    const { titleTask } = req.body;

    req.project.tasks.push(titleTask);

    return res.send(req.project);
});

app.listen(3333, () => {
    console.log('Server started on port 3333');
})