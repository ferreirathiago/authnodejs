const express = require('express');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const authConfig = require('../../config/auth');

const User = require('../models/User');

const router = express.Router();

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    })
}


router.post('/register', async (req, res) => {
    const { email } = req.body;
    try {

        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists'})


        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({ 
            user,
            token: generateToken({ id: user.id }) });
    } catch(err) {
        return res.status(400).send({ error: 'Registration failed'})
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await (await User.findOne({ email }).select('+password'));

    if (!user)
        return res.status(400).send({ error: 'User not found'});

    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid password'});

    user.password = undefined;



    res.send({ 
        user, 
        token: generateToken({ id: user.id }),
    });
})

//esqueci minha senha
router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email});

        if (!user)
        return res.status(400).send({ error: 'User not found'});

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }   
        });

        mailer.sendMail({
            to: email,
            from: 'noreply@medlig.com',
            template: 'auth/forgot_password',
            context: { token },
        }, (err) => {
            if (err)
                return res.status(400).send({ error: 'Cannot send forgot password email'});

            return res.send();
        })


    } catch (err) {
        console.log(err);
        res.status(400).send({ error: 'Erro on forgot password, try again'})
    }
})

//reset password
router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body;

    try {
        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires');

        if (!user)
            return res.status(400).send({ error: 'User not found'});

        if (token !== user.passwordResetToken)
            return res.status(400).send({ error: 'Token invalid' })
        
        const now = new Date();

        if (now > user.passwordResetExpires)
            return res.status(400).send({ error: 'Token expired, generate a new one'})
        
        user.password = password;
        
        await user.save();

        res.send();


    } catch (err) {
        console.log(err);
        res.status(400).send({ error: 'Cannot reset password, try again' });
    }

})

module.exports = app => app.use('/auth', router);


//Palavra: medligbackendmongodb
//Hash MD5 : 2d8969845d6099ff76c30ed19e1fd9f7
//Hash SHA1 : 5c00910a54be27f06fd0a23276a18f0282eb9bf2
//Hash CRYPT: $1$9EyAYA9h$KHUhQQrq2ndEA2hsdhTQI/
