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

  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs };

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {

  const { id } = request.params;

  const { title, url, techs, like } = request.body;

  if (like == null) {

    const repositorieIndex = repositories.findIndex(repository => repository.id === id);

    if (repositorieIndex < 0) {
      return response.status(400).json({
        error: 'Repository not found'
      })

    } else {

      const repository = { id, title, url, techs };

      repositories[repositorieIndex] = repository;

      return response.json(repository)
    }


  } else {

    console.log(like);
    return response.status(400).json({ error: 'Essa rota não pode atualizar o número de likes' })
  }

});

app.delete("/repositories/:id", (request, response) => {

  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repository => repository.id === id);

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

  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repository => repository.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  } else {
    var title = (repositories[repositorieIndex].title);
    var url = (repositories[repositorieIndex].url);
    var techs = (repositories[repositorieIndex].techs);
    var like = (repositories[repositorieIndex].like);

    like = parseInt(like);

    if (isNaN(like) === true || like === 'undefined') {
      like = 0;
      like = like + 1;
    } else {
      like = like + 1;
    }
  }

  like = "0" + like;

  const repository = { id, like, title, url, techs };

  //repositories.push(repository);

  repositories[repositorieIndex] = repository;

  return response.json(repository)
});

module.exports = app;