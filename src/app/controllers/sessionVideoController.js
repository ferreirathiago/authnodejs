const express = require('express');
//const authMiddleware = require('../middlewares/auth');

const SessionVideo = require('../models/SessionVideo');
const User = require('../models/User');

const router = express.Router();

//router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        const sessions = await SessionVideo.find();//.populate('user');

        return res.send({sessions});

    } catch (err) {
        return res.status(400).send({ error: 'Error loading sessionVideo'})
    }
});

/*router.get('/:projectId', async(req,res) => {
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
        const { sessionId, sessionDate, sessionTime, anamnese, prescription } = req.body;
        
        
        const sessionVideo = await SessionVideo.create({  
            sessionId, sessionDate, sessionTime, anamnese, prescription,
            patientId: req.userId, doctorId:req.userId });


        await sessionVideo.save();

        return res.send({ sessionVideo });

    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: 'Error creating new Session Video' })
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


module.exports = app => app.use('/sessionvideo', router)

