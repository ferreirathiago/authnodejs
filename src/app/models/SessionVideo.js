const mongoose = require('../../database');
const bcrypt = require('bcryptjs');


const SessionVideoSchema = new mongoose.Schema({
    sessionId: { type:String, require: true },
    sessionDate: { type:Date, require: true },
    sessionTime: { type:String, require: true },
    anamnese: { type:String, require: true },
    prescription: { type:String, require: true },

    patientid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        require: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        require: true,
    },

    


    createdAt: {
        type: Date, 
        default: Date.now,
    },
});

const SessionVideo = mongoose.model('SessionVideo', SessionVideoSchema);

module.exports = SessionVideo;