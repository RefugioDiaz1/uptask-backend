import { Router } from "express";
import { body, param } from 'express-validator'
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import Task from "../models/Task";
import { TaskController } from "../controllers/TaskController";
import { ProjectExists } from "../middleware/project";
import { hasAutorization, taskBelongsToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router()

router.use(authenticate)

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

router.get('/', 
    ProjectController.getAllProjects)

router.get('/:id',

    param('id').isMongoId().withMessage('Invalid project ID'),

    handleInputErrors,
    
    ProjectController.getProjectById

)

/**ROutes for Task */
router.param('projectId', ProjectExists)

router.put('/:projectId',

    param('projectId').isMongoId().withMessage('Invalid project ID'),

    body('projectName')
        .notEmpty().withMessage('Project name is required'),

    body('clientName')
        .notEmpty().withMessage('client name is required'),

    body('description')
        .notEmpty().withMessage('description name is required'),

    handleInputErrors,
    hasAutorization,
    ProjectController.updateProject

)

router.delete('/:projectId',

    param('projectId').isMongoId().withMessage('Invalid project ID'),

    handleInputErrors,
    hasAutorization,
    ProjectController.deleteProject
)



router.post('/:projectId/tasks',
    hasAutorization,
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
    hasAutorization,
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    TaskController.updateTask

)

router.delete('/:projectId/task/:taskId',
    hasAutorization,
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

/** Routes for teams */
router.post('/:projectId/team/find', 

    body('email')
        .isEmail().withMessage('Valid email is required'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team',
    TeamMemberController.getProjectTeam
)

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('Valid user ID is required'),
    handleInputErrors,
    TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('Valid user ID is required'),
    handleInputErrors,
    TeamMemberController.removeMemberById
)


/** Routes for Notes */
router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('Content is required'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    
    NoteController.getTaskNotes
)


router.delete('/:projectId/tasks/:taskId/note/:noteId',
    param('noteId').isMongoId().withMessage('ID No Válido'),
    handleInputErrors,
    NoteController.deleteNote
)

export default router;  