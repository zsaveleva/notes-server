import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { registerValidation, loginValidation } from './validations.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserController, NoteController } from './controllers/index.js'
import { paginatedResults } from './controllers/NoteController.js';
import NoteModel from './models/Note.js'

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('DB ok'))
    .catch((error) => console.log('DB error', error))

const app = express();

app.use(express.json())
app.use(cors())

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/notes', paginatedResults(NoteModel), (req, res) => {
    res.json(res.paginatedResults)
})
app.post('/notes', checkAuth, handleValidationErrors, NoteController.create)
app.delete('/notes/:id', checkAuth, NoteController.remove)
app.patch('/notes/:id', checkAuth, NoteController.update)

app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('Server OK')
})