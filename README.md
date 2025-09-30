# 🚀 My API Testing Project

## 📋 Оглавление
- [Описание проекта](#-описание-проекта)
- [Предварительные требования](#-предварительные-требованиz)
- [Установка и запуск](#-установка-и-запуск)
- [Настройка Postman](#-настройка-postman)
- [Тестирование API](#-тестирование-api)
- [Структура проекта](#-структура-проекта)

## 🎯 Описание проекта

Комплексная коллекция Postman для автоматизированного тестирования REST API с полным набором CRUD операций, аутентификацией и валидацией данных.

***

## ⚙️ Предварительные требования

Перед началом работы убедитесь, что у вас установлены:

- **Node.js** (версия 14 или выше)
- **npm** (обычно устанавливается вместе с Node.js)
- **Postman** (версия 8 или выше)
- **Git** (для клонирования репозитория)

***

## 📥 Установка и запуск

### Шаг 1: Скачивание проекта

```bash
# Клонируйте репозиторий
git clone https://github.com/ваш-username/my-api-testing-project.git
```
 Перейдите в папку проекта
```bash
cd my-api-testing-project
```
### Шаг 2: Установка зависимостей
Откройте файл package.json и проверьте раздел dependencies:
```
json
"dependencies": {
  "express": "^4.18.2",
  "uuid": "^9.0.0"
}
```
Установите необходимые библиотеки:

#### Установите все зависимости из package.json
``` bash
npm install
```

#### ИЛИ установите библиотеки вручную:
``` bash
npm install express uuid
```

### Шаг 3: Запуск сервера

#### Запустите сервер
``` bash
node server.js
```
Ожидаемый результат:

text
``` bash
🚀 My API server is running on http://localhost:3000
Сервер запущен и готов к тестированию! ✅
```

## Настройка Postman
### Шаг 1: Импорт коллекции
Откройте Postman

Нажмите Import в левом верхнем углу

Перетащите файл: My API Testing Collection.postman_collection.json

Нажмите Import

### Шаг 2: Импорт окружения
Повторите шаги импорта для файла: My API.postman_environment.json

Выберите импортированное окружение "My API" в выпадающем списке окружений (правый верхний угол)

### Шаг 3: Настройка переменных
В выбранном окружении "My API" установите значения:

#### Переменная	Значение
base_url	http://localhost:3000

admin_email	admin@example.com

admin_password	admin123

## Тестирование API

### Рекомендуемый порядок выполнения тестов

#### 1. Папка: Authentication
Запрос: Login (POST /api/auth/login)

text
``` bash
✅ Ожидаемый результат:
- Status: 200 OK
- Получены access_token и refresh_token
- Токены сохранены в переменные окружения
- Время ответа < 500ms
```

Запрос: Refresh Token (POST /api/auth/refresh)

text
``` bash
✅ Ожидаемый результат:
- Status: 200 OK
- Получен новый access_token
- Старый токен заменен новым
```
Запрос: Logout (POST /api/auth/logout)
``` bash
text
✅ Ожидаемый результат:
- Status: 200 OK
- Токены очищены из переменных
- Сообщение об успешном выходе
```
#### 2. Папка: Users

Запрос: Create User (POST /api/users)

text
``` bash
✅ Ожидаемый результат:
- Status: 201 Created
- Создан новый пользователь
- user_id сохранен в переменные
- Все поля пользователя валидны
```
Запрос: Get All Users (GET /api/users?page=1&limit=10)

text
``` bash
✅ Ожидаемый результат:
- Status: 200 OK
- Получен массив пользователей
- Структура пагинации корректна
- Каждый пользователь имеет правильную структуру
```
Запрос: Get User by ID (GET /api/users/{{user_id}})

text
``` bash
✅ Ожидаемый результат:
- Status: 200 OK
- Получен корректный пользователь
- ID соответствует запрошенному
- Email имеет валидный формат
```
Запрос: Update User (PUT /api/users/{{user_id}})

text
``` bash
✅ Ожидаемый результат:
- Status: 200 OK
- Данные пользователя обновлены
- ID остался прежним
- Новые значения соответствуют отправленным
```
Запрос: Delete User (DELETE /api/users/{{user_id}})

text
``` bash
✅ Ожидаемый результат:
- Status: 200 OK
- Пользователь удален
- Получено подтверждение удаления
- Переменная user_id очищена
```
#### 3. Папка: Products

Запрос: Get Products (GET /api/products?inStock=true)

text
``` bash
✅ Ожидаемый результат:
- Status: 200 OK
- Получен массив продуктов
- Все продукты в наличии (inStock: true)
- Каждый продукт имеет правильную структуру
```
Запрос: Create Product (POST /api/products)

text
``` bash
✅ Ожидаемый результат:
- Status: 201 Created
- Продукт создан успешно
- product_id сохранен в переменные
- Все поля продукта заполнены корректно
```

#### 4. Папка: Orders

Запрос: Create Order (POST /api/orders)

text
``` bash
✅ Ожидаемый результат:
- Status: 201 Created
- Заказ создан успешно
- order_id сохранен в переменные
- Статус заказа: "created"
```
Запрос: Get User Orders (GET /api/orders/user/{{user_id}})

text
``` bash
✅ Ожидаемый результат:
- Status: 200 OK
- Получен массив заказов
- Все заказы принадлежат указанному пользователю
- Каждый заказ имеет правильную структуру
```

#### Комплексный сценарий тестирования
Для полной проверки выполните тесты в следующем порядке:
``` bash
Authentication → Login

Users → Create User

Users → Get User by ID (проверка создания)

Products → Create Product

Orders → Create Order

Orders → Get User Orders (проверка заказа)

Users → Update User

Users → Get User by ID (проверка обновления)

Users → Delete User

Authentication → Logout
``` 

📁 **Структура проекта**
text
``` bash
my-api-testing-project/
├── 🚀 server.js                 # Основной файл сервера API
├── 📦 package.json              # Конфигурация npm и зависимости
├── 📋 My API Testing Collection.postman_collection.json
├── 🌍 My API.postman_environment.json
└── 📖 README.md                 # Этот файл
```
