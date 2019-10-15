const express = require('express');

server = express();
server.use(express.json());

const projects = [{
  id: 1,
  title: "",
  tasks: [] 
}];

let cont = 0;

server.use((req, res, next) => {
  cont++;
  console.log(`Foram realizadas ${cont} ${cont <= 1 ? "requisição" : "requisições"}`);

  next();

})

function checkIdExists(req, res, next) {
  const { id } = req.params;

  if(!projects.find(project => project.id == id)){
    return res.status(400).json({  error: 'User does not exists'});
  }

  req.id = id;

  return next();
}

server.get('/projects', (req,res) => {
  return res.json(projects);
});

server.get('/projects/:id', checkIdExists ,(req, res) => {
  return res.json(projects.find(project => project.id == req.id));
});

server.post('/projects', (req, res) => {
  req.body.id = parseInt(projects.length + 1);

  if(!req.body.title) req.body.title = "";
  if(!req.body.tasks) req.body.tasks = [];

  projects.push(req.body);

  return res.json(projects);
});

server.post('/projects/:id/tasks', checkIdExists, (req, res) => {
  const project = projects.find(project => project.id == req.id);
  index = projects.indexOf(project);

  project.tasks.push(req.body.title);

  projects[index] = project;

  return res.json(projects);
});

server.put('/projects/:id', checkIdExists , (req, res) => {
  project = projects.find(project => project.id == req.id);
  index = projects.indexOf(project);

  if(!req.body.id) req.body.id = req.id;
  if(!req.body.title) req.body.title = project.title;
  if(!req.body.tasks) req.body.tasks = project.tasks;

  projects[index] = req.body;

  return res.json(projects);
})

server.delete('/projects/:id',checkIdExists, (req, res) => {
  project = projects.find(project => project.id == req.id);
  index = projects.indexOf(project);

  projects.splice(index , 1);

  return res.send();
})

server.listen(3001);