const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositorieId(request, reponse, next){
  const { id } = request.params;
  if(!isUuid(id)){
    return reponse.status(400).json({error: 'Invalide repositorie ID.'});
  }
  return next();
}

app.use('/repositories/:id', validateRepositorieId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repositorie = { id:uuid(), title, url, techs, likes: 0 };

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  const likes = repositories[repositorieIndex].likes;
  const repositorie = {id, url, title, techs, likes};

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositorieIndex >= 0){
    repositories.splice(repositorieIndex, 1);
  } else {
    return response.status(400).json({error: 'Repositorie not found.'});
  }
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositorieIndex < 0){
    return response.status(400).json({error: 'Repositorie not found.'});
  }

  repositorie = repositories[repositorieIndex];

  repositorie.likes = repositorie.likes + 1;

  return response.json(repositorie);

});

module.exports = app;
