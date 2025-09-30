const express = require('express')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = 3000

app.use(express.json())

// Простая "база данных"
let users = [
    { id: '1', name: 'Иван Иванов', email: 'ivan@example.com', createdAt: new Date().toISOString() }
]
let products = [
    { id: '101', name: 'Ноутбук', price: 50000, inStock: true }
]
let orders = []
let authToken = null

// 📁 Authentication Routes
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body
    // проверка
    if (email === 'admin@example.com' && password === 'admin123') {
        // Генерируем "токен"
        authToken = uuidv4()
        const refreshToken = uuidv4()

        res.json({
            success: true,
            access_token: authToken,
            refresh_token: refreshToken,
            message: 'Login successful'
        })
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' })
    }
})

app.post('/api/auth/refresh', (req, res) => {
    const { refresh_token } = req.body
    // если передан какой-либо refresh_token, выдаем новый access_token
    if (refresh_token) {
        authToken = uuidv4()
        res.json({ success: true, access_token: authToken })
    } else {
        res.status(401).json({ success: false, message: 'Invalid refresh token' })
    }
})

app.post('/api/auth/logout', (req, res) => {
    authToken = null
    res.json({ success: true, message: 'Logged out' })
})

// Middleware для проверки авторизации
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
        return res.status(401).json({ message: 'Access token required' })
    }

    if (token !== authToken) {
        return res.status(403).json({ message: 'Invalid token' })
    }

    next()
}

// 📁 Users Routes
app.get('/api/users', authenticateToken, (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const startIndex = (page - 1) * limit

    const resultUsers = users.slice(startIndex, startIndex + limit)

    res.json({
        data: resultUsers,
        page: page,
        limit: limit,
        total: users.length
    })
})

app.get('/api/users/:id', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.params.id)
    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
})

app.post('/api/users', authenticateToken, (req, res) => {
    const { name, email } = req.body

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' })
    }

    const newUser = {
        id: uuidv4(),
        name: name,
        email: email,
        createdAt: new Date().toISOString()
    }

    users.push(newUser);
    res.status(201).json(newUser)
})

app.put('/api/users/:id', authenticateToken, (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.params.id)
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' })
    }

    const { name, email } = req.body;
    users[userIndex] = { ...users[userIndex], name, email }

    res.json(users[userIndex])
})

app.delete('/api/users/:id', authenticateToken, (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.params.id)
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' })
    }

    users.splice(userIndex, 1)
    res.json({ message: 'User deleted successfully' })
})

// 📁 Products Routes
app.get('/api/products', (req, res) => {
    const { inStock } = req.query
    let resultProducts = products

    // фильтрация по наличию на складе
    if (inStock !== undefined) {
        resultProducts = resultProducts.filter(p => p.inStock === (inStock === 'true'))
    }

    res.json(resultProducts)
})

app.post('/api/products', authenticateToken, (req, res) => {
    const { name, price } = req.body
    const newProduct = {
        id: uuidv4(),
        name,
        price,
        inStock: true
    }
    products.push(newProduct)
    res.status(201).json(newProduct)
})

// 📁 Orders Routes
app.post('/api/orders', authenticateToken, (req, res) => {
    const newOrder = {
        id: uuidv4(),
        userId: '1', // Для примера
        products: [],
        status: 'created',
        createdAt: new Date().toISOString()
    }
    orders.push(newOrder)
    res.status(201).json(newOrder)
})

app.get('/api/orders/user/:userId', authenticateToken, (req, res) => {
    const userOrders = orders.filter(o => o.userId === req.params.userId)
    res.json(userOrders)
})

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 My API server is running on http://localhost:${PORT}`)
})