import type { Request, Response } from "express"
import Project from "../models/Project"


export class ProjectController{

    static createProject = async(req: Request, res: Response)=>{

        const project = new Project(req.body)

        // Asigna un manager
        project.manager = req.user._id
        try {
            await project.save()
            // await Project.create(req.body)
            res.send('Project created successfully')
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }   

    static getAllProjects = async(req: Request, res: Response)=>{

        try {
            const projects = await Project.find({
                $or:[
                    {manager: {$in: [req.user._id]}},
                    {team: {$in: [req.user._id]}}
                ]
            }) //.populate('tasks')
            res.json(projects)

        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }   

    static getProjectById = async(req: Request, res: Response)=>{
        
        const {id} = req.params
        try {
            const project = await (await Project.findById(id).populate({
                path: 'tasks',
                populate: {path: 'completedBy.user', select: 'id name email'}
            } ))

            if(!project)
            {
                const error = new Error('Project not found')
                return res.status(404).json({error: error.message})
            }
                
            if(project.manager.toString() !== req.user._id.toString() && !project.team.includes(req.user._id))
            {
                const error = new Error('Action not valid')
                return res.status(404).json({error: error.message})
            }
            
            res.json(project)

        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }   
    
    static updateProject = async(req: Request, res: Response)=>{

        const {id} = req.params
        try {
            const project = await Project.findById(id)

            if(!project)
            {   
                const error = new Error('Project not found')
                return res.status(404).json({error: error.message})
            } 
 
            if(project.manager.toString() !== req.user._id.toString())
            {
                const error = new Error('only the manager can update a project')
                return res.status(404).json({error: error.message})
            }

            project.clientName = req.body.clientName
            project.projectName = req.body.projectName
            project.description = req.body.description
            await project.save()
            res.send('Project updated successfully')

        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }  

    static deleteProject = async(req: Request, res: Response)=>{

        const {id} = req.params
        try {
          
            const project = await Project.findById(id)
            
            if(!project)
            {
                const error = new Error('Project not found')
                return res.status(404).json({error: error.message})
            } 
            
            if(project.manager.toString() !== req.user._id.toString())
            {
                const error = new Error('only the manager can deleted a project')
                return res.status(404).json({error: error.message})
            }

            await project?.deleteOne()
            
            res.send('Project deleted successfully')

        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }  


}