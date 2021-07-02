const { json, urlencoded } = require('body-parser');
const cors = require('cors');
const express = require('express');
const { writeFileSync } = require('fs');
const { join } = require('path');
const app = express();
const port = 1337;
const USERS_PATH = './users.json';


let users = require(USERS_PATH);

users.sort(sortById(false));


app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));


app.get('/users', (req, res) => {
  res.status(200);
  res.json(users);
});

app.put('/users', (req, res) => {
  const updateUsers = req.body;

  updateUsers.forEach(updateUser => {
    const usersToUpdateIndex = users.findIndex(user => user.id === updateUser.id);

    if (usersToUpdateIndex > -1) {
      users.splice(usersToUpdateIndex, 1, updateUser);
    }
  });

  save(USERS_PATH, users);

  res.status(200);
  res.send(updateUsers);
});


app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});

function save(target, data) {
  writeFileSync(join(__dirname, target), JSON.stringify(data, null, 2), { encoding: 'utf-8' });
}

function sortById(isAsc = false) {
  const ascension = isAsc ? 1 : -1;

  return (idA, idB) => {
    return idA === idB ? 0 : (idA > idB ? 1 : -1 * ascension);
  }
}