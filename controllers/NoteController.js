import NoteModel from '../models/Note.js'

export function paginatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = {}

        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }
        try {
            results.results = await model.find().populate('user').limit(limit).skip(startIndex).exec()
            res.paginatedResults = results
            next()
        } catch (e) {
            console.log(err)
            res.status(500).json({
                message: 'Не удалось получить заметки'
            })
        }
    }
}

export const remove = async (req, res) => {
    const noteId = req.params.id
    NoteModel.findOneAndDelete({ _id: noteId })
        .then((foundNote) => {
            if (foundNote) {
                res.json({
                    success: true
                })
            }
        })
        .catch((err, doc) => {
            console.log(err.message)
            res.status(500).json({
                message: 'Не удалось получить заметку'
            })

            if (!doc) {
                return res.status(404).json({
                    message: 'Заметка не найдена'
                })
            }
        })
}

export const create = async (req, res) => {
    try {
        const doc = new NoteModel({
            title: req.body.title,
            text: req.body.text,
            user: req.userId
        })

        const note = await doc.save()

        res.json(note)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать заметку'
        })
    }
}

export const update = async (req, res) => {
    try {
        const noteId = req.params.id
        await NoteModel.updateOne({
            _id: noteId
        }, {
            title: req.body.title,
            text: req.body.text,
            user: req.userId
        })

        res.json({
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить заметку'
        })
    }
}