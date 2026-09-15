# Request Pipeline

## /auth

| Route | Middleware chain (thứ tự) | Fail sớm nhất ở đâu? |
|-------|---------------------------|----------------------|
| POST /auth/register | validateRegister → authCtrl.register → authService.registerUser | 400 validateRegister (name, email, password) \| 409 Service (email exists) |
| POST /auth/login | validateLogin → authCtrl.login → authService.loginUser (+ signToken) | 400 validateLogin (email, password) \| 401 Service (invalid credentials) |
| GET /auth/me | authMiddleware → authCtrl.me → authService.findCurrentUser | 401 authMiddleware (missing/invalid token) |

## /posts (router.use authMiddleware TRƯỚC mọi route)

| Route | Middleware chain (thứ tự) | Fail sớm nhất ở đâu? |
|-------|---------------------------|----------------------|
| POST /posts | authMiddleware → validateCreatePost → postsCtrl.create → postsService.createPost | 401 authMiddleware (missing/invalid token) \| 400 validateCreatePost (title) \| 400 Service (FK constraint) |
| GET /posts | authMiddleware → postsCtrl.findMany → postsService.findPosts | 401 authMiddleware (missing/invalid token) |
| GET /posts/:id | authMiddleware → validateIdParam → postsCtrl.findById → postsService.findPostById | 401 authMiddleware (missing/invalid token) \| 400 validateIdParam (invalid id) \| 404 Service (post not found) |
| PUT /posts/:id | authMiddleware → validateIdParam → postsCtrl.update → postsService.updatePost | 401 authMiddleware (missing/invalid token) \| 400 validateIdParam (invalid id) \| 404 Service (post not found) |
| DELETE /posts/:id | authMiddleware → validateIdParam → postsCtrl.remove → postsService.deletePost | 401 authMiddleware (missing/invalid token) \| 400 validateIdParam (invalid id) \| 404 Service (post not found) |

## /users

| Route | Middleware chain (thứ tự) | Fail sớm nhất ở đâu? |
|-------|---------------------------|----------------------|
| POST /users | usersCtrl.create (410 ngay, không qua service) | 410 usersCtrl.create |
| GET /users | usersCtrl.findMany → usersService.findUsers (không authMiddleware) | 500 Service (database error) |
| GET /users/:id | validateIdParam → usersCtrl.findById → usersService.findUserById (không authMiddleware) | 400 validateIdParam (invalid id) \| 404 Service (user not found) |
| PUT /users/:id | validateIdParam → usersCtrl.update → usersService.updateUser (không authMiddleware) | 400 validateIdParam (invalid id) \| 404 Service (user not found) \| 409 Service (email exists) |
| DELETE /users/:id | validateIdParam → usersCtrl.remove → usersService.deleteUser (không authMiddleware) | 400 validateIdParam (invalid id) \| 404 Service (user not found) |
