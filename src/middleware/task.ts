import type {Request, Response, NextFunction} from 'express'
import Task, { ITask } from '../models/Task'
import mongoose from 'mongoose'

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export async function taskExists(req: Request, res: Response, next: NextFunction) {

        try {
            
            const {taskId} = req.params

            if(!mongoose.Types.ObjectId.isValid(taskId.toString())){
                return res.status(400).json({error: "Invalid Task Id"})
            }  

            const task = await Task.findById(taskId)

            if(!task)
            {
                const error = new Error('Task not found')
                return res.status(404).json({error: error.message})
            }

            req.task = task
            next()

        } catch (error) {
            
            res.status(500).json({error:error})
        }

}


export function taskBelongsToProject(req: Request, res: Response, next: NextFunction){

     if(req.task.project.toString() !== req.project._id.toString())
            {
                const error = new Error('Invalid task')
                return res.status(400).json({error: error.message})
            }

            next()

}