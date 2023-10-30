const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());


const users = [
    { username: 'usuario1', password: 'contrasena1' },
    { username: 'usuario2', password: 'contrasena2' },
];


const JWT_SECRET = process.env.JWT_SECRET || 'secreto_predeterminado';

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
    }


    const token = jwt.sign({ username }, JWT_SECRET);
    res.json({ token });
});

app.get('/ruta-protegida', (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }

        
        res.json({ mensaje: 'Acceso autorizado' });
    });
});


const port = 3000;
app.listen(port, () => {
    console.log(`Servidor en ejecución en el puerto ${port}`);
});
