import type {Request, Response, NextFunction} from 'express'
import Project, { IProject } from '../models/Project'
import mongoose from 'mongoose'

declare global {
    namespace Express {
        interface Request {
            project: IProject
        }
    }
}

export async function ProjectExists(req: Request, res: Response, next: NextFunction) {
        try {
            const {projectId} = req.params

            if(!mongoose.Types.ObjectId.isValid(projectId.toString())){
                            return res.status(400).json({error: "Invalid Task Id for Mongo"})
                        }  

            const project = await Project.findById(projectId)            

            if(!project)
            {
                const error = new Error('Project not found')
                return res.status(404).json({error: error.message})
            }

            req.project = project
            next()

        } catch (error) {
            
            res.status(500).json({error:error})
        }

}