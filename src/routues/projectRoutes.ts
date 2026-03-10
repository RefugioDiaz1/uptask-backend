import { Router } from "express";
import { body, param } from 'express-validator'
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import Task from "../models/Task";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/project";

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
router.param('projectId', validateProjectExists)
router.post('/:projectId/tasks',
    param('projectId').isMongoId().withMessage('Invalid project ID'),
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    TaskController.createTaskProject

)

router.get('/:projectId/tasks',
    param('projectId').isMongoId().withMessage('Invalid project ID'),
    handleInputErrors,
    TaskController.getProjectTask

)

router.get('/:projectId/task/:taskId',
    param('projectId').isMongoId().withMessage('Invalid project ID'),
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    handleInputErrors,
    TaskController.getTaskById

)

router.put('/:projectId/task/:taskId',
    param('projectId').isMongoId().withMessage('Invalid project ID'),
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    TaskController.updateTask

)

export default router;  