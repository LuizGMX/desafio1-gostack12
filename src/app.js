const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title ? repositories.filter(repository => repository.title.includes(title)) : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {

  const { title, url, techs, likes } = request.body;
  const repository = { id: uuid(), title, url, techs, likes };

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {

  const {id} = request.params;

  const {title,url,techs} = request.body;

  const repositorieIndex = repositories.findIndex(repository => repository.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({
      error: 'Repository not found'
    })

  } else {
 
    const repository = {id, title, url, techs};

    repositories[repositorieIndex] = repository;
  
    return response.json([repository])
  }


});

app.delete("/repositories/:id", (request, response) => {

  const {id} = request.params;

  const repositorieIndex = repositories.findIndex(repositories => repositories.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({
      error: 'Repository not found'
    })

  } else {
    repositories.splice(repositorieIndex, 1);
    return response.status(204).send();
  }

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const {title,url,techs,like} = request.body;

  const repositorieIndex = repositories.findIndex(repository => repository.id === id);
  
  const repository = {id, title, url, techs, like};

  if(repositorieIndex<0){
    return response.status(400).json({error:'Repository not found'})
  }else{
  repositories[repositorieIndex] = repository;

  return response.json([repository])
}
});

module.exports = app;