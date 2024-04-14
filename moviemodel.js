const Sequelize = require('sequelize');
const express = require('express');
const app = express();


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const Movie = sequelize.define('Movie', {
    title: Sequelize.TEXT,
    yearOfRelease: Sequelize.INTEGER,
    synopsis: Sequelize.TEXT
});

sequelize.sync().then(() => {
    console.log('Database and tables created!');

    Movie.bulkCreate([
        { title: 'Inception', yearOfRelease: 2010, synopsis: 'A thief who enters the dreams of others.'},
        { title: 'The Matrix', yearOfRelease: 1999, synopsis: 'A computer hacker learns about the true nature of reality and his role in the war against its controllers.'},
        { title: 'Interstellar', yearOfRelease: 2014, synopsis: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival' }
    ]).then(() => console.log('Intial data created'));
});

app.use(express.json());

//CRUD operations
app.post('/moviemodel.js', (req, res) => {
    Movie.create(req.body)
    .then(movie => res.status(201).json(movie))
    .catch(error => res.status(400).json({ error: error.message }));
});

app.get('/moviemodel.js', (req, res) => {
    const { limit, offset } = req.query;
    Movie.findAndCountAll({ limit: parseInt(limit), offset: parseInt(offset) })
    .then(result => res.json({ data: result.rows, total: result.count }))
    .catch(error => res.status(400).json({ error: error.message }));
});

app.get('/moviemodel.js/:id', (req, res) => {
    Movie.findByPk(req.params.id)
    .then(movie => {
        if(movie) {
            res.json(movie);
        } else {
            res.status(404).json({ error: 'Not found' });
        }
    })
    .catch(error => res.status(400).json({ error: error.message }));
});

app.put('/moviemodel.js/:id', (req, res) => {
    Movie.findByPk(req.params.id)
    .then(movie => {
        if(movie) {
            movie.update(req.body)
            .then(() => res.json(movie))
        }
    })
    .catch(error => res.status(400).json({ error: error.message }));
});

app.delete('/moviemodel.js/:id', (req, res) => {
    Movie.destroy({ where: { id: req.params.id } })
    .then(deleted => {
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Not found' });
        }
    })
    .catch(error => res.status(400).json({ error: error.message }));
});

app.listen(3001, () => console.log('Movie API server running on port 3001'));