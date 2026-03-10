import type{Request, Response} from 'express'
import Task from '../models/Task'


export class TaskController{

    static createTaskProject = async(req: Request, res: Response)=>{

        try {
            
            const task = new Task(req.body)
            task.project = req.project._id
            req.project.tasks.push(task._id)
            await Promise.allSettled([task.save(), req.project.save()])
            res.send('Task created successfully')

        } catch (error) {
            res.status(500).json({error:"Hubo un error"})
        }
    }   

    static getProjectTask = async(req: Request, res: Response)=>{

        try {
            
            const tasks = await Task.find({project: req.project._id}).populate('project')
            res.json(tasks)

        } catch (error) {
            res.status(500).json({error:"Hubo un error"})
        }

    }

    static getTaskById = async(req: Request, res: Response)=>{

        try {
            const {taskId} = req.params
            const task = await Task.findById(taskId)
            if(!task)
            {
                const error = new Error('Task not found')
                return res.status(404).json({error: error.message})
            }

            if(task.project.toString() !== req.project._id.toString())
            {
                const error = new Error('Invalid task')
                return res.status(400).json({error: error.message})
            }
            res.json(task)
        } catch (error) {
            res.status(500).json({error:"Hubo un error"})
        }
    }

     static updateTask = async(req: Request, res: Response)=>{

        try {
            const {taskId} = req.params
            const task = await Task.findByIdAndUpdate(taskId, req.body)
            if(!task)
            {
                const error = new Error('Task not found')
                return res.status(404).json({error: error.message})
            }

            if(task.project.toString() !== req.project._id.toString())
            {
                const error = new Error('Invalid task')
                return res.status(400).json({error: error.message})
            }
            res.send("Task updated successfully")
        } catch (error) {
            res.status(500).json({error:"Hubo un error"})
        }
    }

    
}