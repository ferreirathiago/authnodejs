const express = require('express');
//const authMiddleware = require('../middlewares/auth');

const Doctor = require('../models/Doctor');
const User = require('../models/User');

const router = express.Router();

//router.use(authMiddleware);

/*router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate('user');

        return res.send({projects});

    } catch (err) {
        return res.status(400).send({ error: 'Error loading projects'})
    }
});

router.get('/:projectId', async(req,res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate('user');

        return res.send({project});

    } catch (err) {
        return res.status(400).send({ error: 'Error loading project'})
    }
}) 
*/
router.post('/', async(req,res) => {
    try {
        const { nome, genero, logradouro, bairro,
            cidade, uf, cpf, email, datanascimento, 
            assinatura, convenio, profissao, telefone, 
            crm, rqe, especialidade } = req.body;
        
        
        const doctor = await Doctor.create({ nome, 
            genero, logradouro, bairro,
            cidade, uf, cpf, email, datanascimento, 
            assinatura, convenio, profissao, telefone, 
            crm, rqe, especialidade, user:req.userId });


        await doctor.save();

        return res.send({ doctor });

    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: 'Error creating new project' })
    }
    
}) 
/*
router.put('/:projectId', async(req,res) => {
    res.send({ user: req.userId })
}) 

router.delete('/:projectId', async(req,res) => {
    try {
        const project = await Project.findByIdAndRemove(req.params.projectId);

        return res.send();

    } catch (err) {
        return res.status(400).send({ error: 'Error deleting project'})
    }
}) 
*/


module.exports = app => app.use('/doctor', router)

