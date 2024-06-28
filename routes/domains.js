const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Domain = require('../models/domain');
const Protect = require('../middleware/securityToken');

// Obtener todos los dominios
router.get('/', Protect, async (req, res) => {
    try {
        const domains = await Domain.find();
        res.json(domains);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Crear un nuevo dominio
router.post('/', async (req, res) => {
    const domain = new Domain({
        domain: req.body.domain,
        type_domain: req.body.type_domain,
        userID: req.body.userID // Asegúrate de que userID esté incluido en la creación del dominio
    });

    try {
        const newDomain = await domain.save();
        res.status(201).json(newDomain);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Obtener un dominio por ID
router.get('/:id', getDomain, (req, res) => {
    res.json(res.domain);
});

// Actualizar un dominio
router.put('/:id', getDomain, async (req, res) => {
    if (req.body.domain != null) {
        res.domain.domain = req.body.domain;
    }
    if (req.body.type_domain != null) {
        res.domain.type_domain = req.body.type_domain;
    }
    try {
        const updatedDomain = await res.domain.save();
        res.json(updatedDomain);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Eliminar un dominio
router.delete('/:id', getDomain, async (req, res) => {
    try {
        await res.domain.remove();
        res.json({ message: 'Deleted Domain' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Verificar si un dominio existe
router.get('/exists/:domain', async (req, res) => {
    try {
        const domain = await Domain.findOne({ domain: req.params.domain });
        res.json({ exists: domain !== null });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener un dominio por userID usando /me
router.get('/my/domain', Protect, getDomainByUserID, (req, res) => {
    res.json(res.domain);
});

// Middleware para obtener un dominio por ID
async function getDomain(req, res, next) {
    let domain;
    try {
        domain = await Domain.findById(req.params.id);
        if (domain == null) {
            return res.status(404).json({ message: 'Cannot find domain' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.domain = domain;
    next();
}

// Middleware para obtener un dominio por userID
async function getDomainByUserID(req, res, next) {
    const id  = req.user; // Asegúrate de que el middleware Protect agregue la información del usuario al req

console.log(id)
    let domain;
    try {
        domain = await Domain.findOne({ userID: id });
        if (!domain) {
            return res.status(404).json({ message: 'Cannot find domain' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.domain = domain;
    next();
}

module.exports = router;
