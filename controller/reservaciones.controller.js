const prisma = require('../prisma/client')
// controlador que sirve para las acciones de las reservaciones

// metodo para obtener todas las reservaciones
//funcion asincrona: funcion que se ejecuta en segundo plano
const obtenerReservaciones = async (req, res) => {
    //select * from reservaciones  = findMany()
    const lista_reservaciones = await prisma.reservacion.findMany();
    res.status(200).json(lista_reservaciones)
}

//funcion para obtener una reservacion por su ID
const obtenerReservacionById = async (req, res) => {
    // obtener el id de la ruta
    const idReservacion = Number(req.params.id)
    // select * from reservaciones where id = idReservacion
    const reservacion = await prisma.reservacion.findUnique({
        where: { id: idReservacion },
    });

    // validamos si la reservacion no existe
    if(!reservacion){
        return res.status(404).json({ error: "Reservacion no encontrada" })
    }

    res.status(200).json(reservacion)
}

// funcion para crear una nueva reservacion
const crearReservacion = async (req, res) => {
    // obtenemos los datos para crear la reservacion (body/formulario)
    const { nombre, email, fecha, hora, personas } = req.body

    // INSERT INTO reservaciones (nombre, email, fecha, hora, personas) VALUES ('John Doe', 'john@example.com', '2023-10-10', '19:00', 4)
    const nuevaReservacion = await prisma.reservacion.create({
        data: {
            nombre,
            email,
            fecha,
            hora,
            personas
        },
    });

    // 201 = CREATED SUCCESUFFLY
    res.status(201).json({
        message: "Reservacion registrada correctamente",
        reservacion: nuevaReservacion   
    })
}

// actualizar una reservacion por ID
const actualizarReservacion = async (req, res) => {
    const id = Number(req.params.id)

    const existe = await prisma.reservacion.findUnique({ where: { id } })
    if (!existe) {
        return res.status(404).json({ error: 'Reservacion no encontrada' })
    }

    // update reservaciones set nombre = 'Jane Doe', email = 'jane@example.com' where id = 1
    const reservacion = await prisma.reservacion.update({
        where: { id },
        data: req.body //nombre, email, fecha, hora, personas
    })

    res.status(200).json({
        message: 'Reservacion actualizada exitosamente',
        reservacion
    })
}

// metodo que desactiva una reservacion
const desactivarReservacion = async (req, res) => {
    const id = Number(req.params.id)

    const existe = await prisma.reservacion.findUnique({ where: { id } })
    if (!existe) {
        return res.status(404).json({ error: 'Reservacion no encontrada' })
    }

    await prisma.reservacion.update({
        where: { id },
        data: { activa: false }
    })

    res.status(200).json({ message: 'Reservacion desactivada' })
}

// exportando los metodos para ocuparlos en cualquier lugar
module.exports = {
    obtenerReservaciones,
    obtenerReservacionById,
    crearReservacion,
    actualizarReservacion,
    desactivarReservacion
}