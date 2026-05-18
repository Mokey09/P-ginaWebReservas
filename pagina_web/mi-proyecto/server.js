const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500']
}));
app.use(express.json());

app.get('/clientes', (req, res) => {
    db.query('SELECT * FROM Clientes', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

app.get('/disponibilidad', (req, res) => {
    const { entrada, salida } = req.query;
    
    console.log("Fechas recibidas:", entrada, salida);

    const query = `
        SELECT 
            h.Tipo,
            COUNT(h.NumeroHabitacion) AS total,
            SUM(CASE WHEN r.CodReserva IS NOT NULL THEN 1 ELSE 0 END) AS ocupadas
        FROM Habitacion h
        LEFT JOIN RelacionReservaHabitacion rh ON h.NumeroHabitacion = rh.NumeroHabitacion
        LEFT JOIN Reserva r ON rh.\`Cod.Reserva\` = r.CodReserva
            AND r.FechaEntrada < ? 
            AND r.FechaSalida > ?
        GROUP BY h.Tipo
    `;
    db.query(query, [entrada, salida], (err, results) => {
        if (err) {
            console.error("Error en SQL:", err);
            return res.status(500).json({ error: err.message });
        }
        console.log("Resultados:", results);
        res.json(results);
    });
});

app.post('/reservas', (req, res) => {
    const {
        IdentificadorReserva,
        TitularReserva,
        FechaEntrada,
        FechaSalida,
        CantidadPersonas,
        Pension,
        Precio
    } = req.body;

    const NombreHotel = 'Hotel Naranja';

    const query = 'INSERT INTO Reserva(IdentificadorReserva, TitularReserva, FechaEntrada, FechaSalida, FechaReservaRealizada, CantidadPersonas, Pension, Precio, NombreHotel) VALUES (?, ?, ?, ?, CURDATE(), ?, ?, ?, ?)';

    db.query(query, [IdentificadorReserva, TitularReserva, FechaEntrada, FechaSalida, CantidadPersonas, Pension, Precio, NombreHotel], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Reserva creada correctamente', reservaId: IdentificadorReserva });
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000 🚀');
});