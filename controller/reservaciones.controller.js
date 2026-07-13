const prisma = require('../prisma/client')
// controlador que sirve para las acciones de las reservaciones

// metodo para obtener todas las reservaciones
//funcion asincrona: funcion que se ejecuta en segundo plano
const obtenerReservaciones  = async (req, res) => {
    //select * from reservacion  = findMany()
    const lista_reservacion = await prisma.reservacion.findMany();
    res.status(200).json(lista_reservacion)
}

//funcion para obtener una reservacion por su ID
const obtenerReservacionById = async (req, res) => {
    // obtener el id de la ruta
    const idReservacion = Number(req.params.id)
    // select * from reservacion where id = idReservacion
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
    const { fecha, hora, personas, estado, usuario_id, mesa_id } = req.body

    const nuevaReservacion = await prisma.reservacion.create({
        data: {
            fecha,
            hora,
            personas,
            estado,
            usuario: {
                connect: { id: usuario_id }
            },
            mesa: {
                connect: { id: mesa_id }
            }
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