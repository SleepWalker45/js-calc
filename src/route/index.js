// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
const calc = require('./calc');


router.use('/calc', calc)

// Підключаємо роутер до бек-енду
module.exports = router
