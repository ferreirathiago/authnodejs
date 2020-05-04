const mongoose = require('../../database');
const bcrypt = require('bcryptjs');


const DoctorSchema = new mongoose.Schema({
    nome: { type:String, require: true },
    genero: { type: String, require: true },
    logradouro: { type: String, require: true },
    bairro: { type: String, require: true },
    cidade: { type: String, require: true },
    uf: { type: String, require: true },
    cpf: { type: String, require: true },
    email: { type: String, require: true },
    datanascimento: { type: String, require: true },
    assinatura: { type: String, require: true },
    convenio: { type: String, require: true },
    profissao: { type: String, require: true },
    telefone: { type: String, require: true },
    crm: { type: String, require: true },
    rqe: { type: String, require: true },
    especialidade: { type: String, require: true },
    

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },

    createdAt: {
        type: Date, 
        default: Date.now,
    },
});

const Doctor = mongoose.model('Doctor', DoctorSchema);

module.exports = Doctor;