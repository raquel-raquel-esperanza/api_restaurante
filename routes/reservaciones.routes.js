// manejando las rutas para los metodos de la seccion "Reservaciones"
const express = require('express')
// constante principal para manejar las rutas
const router = express.Router()
// llamando a los metodos a utilizar para las rutas
const {
    obtenerReservaciones,
    obtenerReservacionById,
    crearReservacion,
    actualizarReservacion,
    desactivarReservacion
} = require('../controller/reservaciones.controller')
const { verificarToken, verificarAdmin } = require('../middleware/auth.middleware')

// creando las rutas (/api/reservaciones)
router.get('/', obtenerReservaciones) // /api/v1/reservaciones/
// ruta con parametro
router.get('/:id', obtenerReservacionById) // /api/v1/reservaciones/:id

// rutas protegidas
// antes de la accion, se agrega los permisos para entrar a esa ruta

router.post('/', verificarToken, verificarAdmin, crearReservacion) // /api/v1/reservaciones/
router.put('/:id', verificarToken, verificarAdmin, actualizarReservacion) // /api/v1/reservaciones/:id
// puede desactivar la reservacion un cliente
router.patch('/:id', verificarToken, desactivarReservacion) // /api/v1/reservaciones   /:id

// exportando las rutas
module.exports = router