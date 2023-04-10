const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'uces',
	password: 'uces',
	database: 'uces',
});


connection.connect((error) => {
	if (error) {
		console.error(`Error de conexión: ${error.stack}`);
		return;
	}
	console.log('Conexión exitosa a la base de datos!');
});


app.get('/musicos', (req, res) => {
	connection.query('SELECT * FROM musicos', (err, rows, fields) => {
		if (err) throw err
		res.json(rows)
	})
});

app.get('/musicos/:id', (req, res) => {
	const {id} = req.params;
	connection.query(`SELECT * FROM musicos where id = ${id}`, (err, rows, fields) => {
		if (err) throw err
			if(rows.length == 0){
				res.status(404).send("Not Found")
				return;
			}

		return res.json(rows[0])
	})
});

app.delete('/musicos/:id', (req, res) => {
	const { id } = req.params;
	connection.query(`delete FROM musicos where id = ${id}`, (err, rows, fields) => {
		if (err) throw err
			if(!rows?.affectedRows)
				{
					res.json('User no existe')
					return res.status(404).send("User no existe")
				}
			return res.json('ok');	
	})
});

app.patch('/musicos/:id/:name', (req, res) => {
	const { id, name } = req.params;
	connection.query(`UPDATE musicos SET nombre = '${name}' WHERE id = ${id}`, (err, rows, fields) => {
		if (err) throw err
			if(!rows?.affectedRows)
				{
					res.json('User no existe')
					return res.status(404).send("User no existe")
				}
			return res.json('ok');	
	})
});

app.post('/musicos', (req, res) => {
	const { name, actividad, instrumento } = req.body;

	if(name && actividad && instrumento)
		{	
			connection.query(`INSERT INTO musicos (nombre, en_actividad, instrumento) values ('${name}', ${actividad}, '${instrumento}')`, (err, rows, fields) => {
			if (err) throw err
				if(!rows?.affectedRows)
					{
						res.json('User no existe')
						return res.status(404).send("User no existe")
					}
				return res.json('ok');	
			})
		}
});


app.listen(port, () => {
	console.log(`Servidor iniciado en http://localhost:${port}`);
});
