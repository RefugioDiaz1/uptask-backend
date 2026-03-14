import { Router } from "express";
import { body, param } from 'express-validator'
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import Task from "../models/Task";
import { TaskController } from "../controllers/TaskController";
import { ProjectExists } from "../middleware/project";
import { taskBelongsToProject, taskExists } from "../middleware/task";

const router = Router()

router.post('/',

    body('projectName')
        .notEmpty().withMessage('Project name is required'),

    body('clientName')
        .notEmpty().withMessage('client name is required'),

    body('description')
        .notEmpty().withMessage('description name is required'),

    handleInputErrors,

    ProjectController.createProject

)

router.get('/', ProjectController.getAllProjects)

router.get('/:id',
    param('id').isMongoId().withMessage('Invalid project ID'),

    handleInputErrors,
    
    ProjectController.getProjectById

)

router.put('/:id',

    param('id').isMongoId().withMessage('Invalid project ID'),

    body('projectName')
        .notEmpty().withMessage('Project name is required'),

    body('clientName')
        .notEmpty().withMessage('client name is required'),

    body('description')
        .notEmpty().withMessage('description name is required'),

    handleInputErrors,

    ProjectController.updateProject

)

router.delete('/:id',

    param('id').isMongoId().withMessage('Invalid project ID'),

    handleInputErrors,

    ProjectController.deleteProject
)


/**ROutes for Task */
router.param('projectId', ProjectExists)

router.post('/:projectId/tasks',
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    TaskController.createTaskProject

)

router.get('/:projectId/tasks',
    handleInputErrors,
    TaskController.getProjectTask

)

router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)
router.get('/:projectId/task/:taskId',
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    handleInputErrors,
    TaskController.getTaskById

)

router.put('/:projectId/task/:taskId',
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    TaskController.updateTask

)

router.delete('/:projectId/task/:taskId',
    param('taskId').isMongoId().withMessage('Invalid task ID'),
   
    handleInputErrors,
    TaskController.deleteTask

)

router.post('/:projectId/task/:taskId/status',
    
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    body('status')
        .notEmpty().withMessage('Status is required'),

    handleInputErrors,
    TaskController.updateStatus
)

export default router;  