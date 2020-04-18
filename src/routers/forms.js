const express = require('express')

const Form = require('../models/form')
const Ledger = require('../models/ledger')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/forms', auth, async (req, res) => {
    const formBody = req.body.data
    const finalForm = {
        name: req.body.name,
        data: formBody,
        owner: req.user._id
    }
    try {
        const form = new Form(finalForm)
        const ledger = new Ledger({
            name: req.body.name,
            forms: [{form: form._id }]
        })
        await ledger.save()
        await form.save()
        res.status(200).send()
    } catch(e) {
        res.status(400).send()
    }
})

router.post('/forms/submit', auth, async (req, res) => {
    const name = req.body.name
    const data = req.body.data
    try {
        const ledger = await Ledger.findOne({ name })
        if (!ledger) {
            return res.status(404).send()
        }
        const oldForm = await Form.findById(ledger.forms[0].form)
        const fields = Object.keys(data)
        const requiredFields = Object.keys(oldForm.data)
        const isValid = fields.every((field) => requiredFields.includes(field))
        if (!isValid) {
            return res.status(400).send()
        }
        const newForm = new Form({ name, data, owner: req.user._id})
        await newForm.save()
        ledger.forms = ledger.forms.concat({ form: newForm._id })
        await ledger.save()
        res.status(200).send()
    } catch (e) {
        return res.status(400).send(e)
    }
})

router.get('/forms', auth, async (req, res) => {
    const forms = []
    const ledgers = await Ledger.find({})
    for (var i = 0; i < ledgers.length; i++) {
        const form = await Form.findById(ledgers[i].forms[0].form)
        const fields = Object.keys(form.data)
        const formats = []
        fields.forEach((field) => {
            formats.push({ field, type: typeof(form.data[field])})
        })
        forms.push({name: form.name, formats})
    }
    res.send(forms)
})

module.exports = router