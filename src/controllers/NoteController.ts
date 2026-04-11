import type {Request, Response} from 'express'
import Note, {INote} from '../models/Note'
import { Types } from 'mongoose'

type NoeParams = {
    noteId: Types.ObjectId
}

export class NoteController{
    static createNote = async (req:Request<{},{},INote>, res:Response) => {

        const {content} = req.body
        const note = new Note()
        note.content = content
        note.createBy = req.user._id
        note.task = req.task._id

        req.task.notes.push(note._id)
        
        try {
            await Promise.allSettled([req.task.save(), note.save()])
            res.send('Note created successfully')
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }

     static getTaskNotes = async (req:Request, res:Response) => {

        try {
            const notes = await Note.find({task: req.task._id})
            res.json(notes)
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }

     static deleteNote = async (req:Request<NoeParams>, res:Response) => {

        try {
            const {noteId} = req.params
            const note = await Note.findById(noteId)
            if(!note)
            {
                const error = new Error('Note not Found')
                return res.status(404).json({error:error.message})
            }

            if(note.createBy.toString() !== req.user._id.toString())
            {
                const error = new Error('Action not Valid')
                return res.status(401).json({error:error.message})
            }

            req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString())
            
            try {
                 await Promise.allSettled([req.task.save(), note.deleteOne()])
                 res.json('Note Deleted Successfully')
            } catch (error) {
                return res.status(500).json({error: error.message})
            }
           
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }


}
