import express from "express";
import * as dotenv from 'dotenv'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import flash from "express-flash";
import session from "express-session";
import { PrismaClient } from '@prisma/client'
import { registerJoi, loginJoi } from "./utils/Users.js";
import authenticateLogin from "./middleware/sessionMiddleware.js";

const prisma = new PrismaClient()
const app = express() 
dotenv.config()

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 * 60 * 1  } // 1 hour
}))
app.use(flash());

app.set("view engine", "ejs");

app.get('/', authenticateLogin, home)
app.get('/register', register)
app.get('/login', login)
app.get('/logout', logout)
app.get('/addIncome/:id',authenticateLogin, addIncome)
app.get('/addOutcome/:id', authenticateLogin, addOutcome)
app.get('/addIncomeCategory/:id', authenticateLogin, addIncomeCategory)
app.get('/addOutcomeCategory/:id', authenticateLogin, addOutcomeCategory)
app.get('/deleteCategoryIncome/:id/:idUser', authenticateLogin, deleteCategoryIncome)
app.get('/deleteCategoryOutcome/:id/:idUser', authenticateLogin, deleteCategoryOutcome)
app.get('/editCategoryIncome/:idCategory/:idUser', authenticateLogin, editCategoryIncome)
app.get('/editCategoryOutcome/:idCategory/:idUser', authenticateLogin, editCategoryOutcome)

app.post('/register', registerPost)
app.post('/login', loginPost)
app.post('/addIncome/:id',authenticateLogin, addIncomePost)
app.post('/addOutcome/:id', authenticateLogin, addOutcomePost)
app.post('/addIncomeCategory/:id', authenticateLogin, addIncomeCategoryPost)
app.post('/addOutcomeCategory/:id', authenticateLogin, addOutcomeCategoryPost)
app.post('/editCategoryIncome/:idCategory/:idUser', authenticateLogin, editCategoryIncomePost)
app.post('/editCategoryOutcome/:idCategory/:idUser', authenticateLogin, editCategoryOutcomePost)


async function home (req, res) {

    try {
        const walletUser = await prisma.users.findUnique({ where: { email: req.session.email } })
        const isIncomeExist = await prisma.income.count({ where: {userId: walletUser.id} })
        // console.log(isIncomeExist)
        let incomeListData = null
        if(isIncomeExist) { //check if income exist or not
            const incomeListDb = await prisma.income.findMany({ 
                where: {
                    userId: walletUser.id
                },
                include: {
                    categoryIncome: {
                        select: {
                            nameCategory: true
                        }
                    }
                }
             })
            incomeListData = incomeListDb
        }

        const isOutcomeExist = await prisma.outcome.count({ where: {userId: walletUser.id} })

        let outcomeListData = null
        if(isOutcomeExist) { //check if outcome exist or not
            const outcomeListDb = await prisma.outcome.findMany({ 
                where: {
                    userId: walletUser.id
                },
                include: {
                    categoryOutcome: {
                        select: {
                            nameCategory: true
                        }
                    }
                }
             })
            outcomeListData = outcomeListDb
        }
        res.render('wallet', {
            isLogin: req.session.isLogin,
            name: req.session.name,
            balance: walletUser.balance,
            totalIncome: walletUser.totalIncome,
            totalOutcome: walletUser.totalOutcome,
            incomeList: incomeListData,
            outcomeList: outcomeListData,
            id: walletUser.id
        })
    } catch (error) {
        req.flash('error', error)
        res.redirect('/home')
    }
}

function register (req, res) {
    res.render('register')
}

async function registerPost (req, res) {
    try {
        const { email, name, password }  = req.body
        const { error } = registerJoi.validate({ email, name, password })
        if(error) {
            req.flash('error', error.message);
            return res.redirect('/register');
        }
            
        const isEmailRegistered = await prisma.users.count({where: { email }})
        if(isEmailRegistered > 0) {
            req.flash('error', 'email already registered')
            return res.redirect('/register')
        }
        
        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.users.create({
            data: {
                email,
                name,
                password: hashPassword
            }
        })

        // create default income and outcome category
        const defaultCategoriesIncome = ['sallary', 'invest', 'freelance', 'other']
        await Promise.all(defaultCategoriesIncome.map(async (categoryName) => {
            await prisma.incomeCategory.create({
                data: {
                    userId: newUser.id,
                    nameCategory: categoryName
                }
            });
        }));

        const defaultCategoriesOutcome = ['food', 'holiday', 'dinner', 'needs', 'other']
        await Promise.all(defaultCategoriesOutcome.map(async (categoryName) => {
            await prisma.outcomeCategory.create({
                data: {
                    userId: newUser.id,
                    nameCategory: categoryName
                }
            });
        }));

        req.flash('success','register successful, please log in')
        res.redirect('/login')
    } catch (error) {
        req.flash('error', 'Internal server error');
        res.redirect('/register');
    }
}

function login (req, res) {
    res.render('login')
}

async function loginPost (req, res) {
    try {
        const { email, password } = req.body
        const { error } = loginJoi.validate({ email, password })
        if(error) {
            req.flash('error', error.message);
            return res.redirect('/login');
        }

        const isEmailRegistered = await prisma.users.findFirst({where: { email }})
        // console.log(isEmailRegistered)
        if(!isEmailRegistered) {
            req.flash('error', 'email not registered')
            return res.redirect('/login')
        }

        const isMatchPassword = await bcrypt.compare(password, isEmailRegistered.password)
        if(!isMatchPassword) {
            req.flash('error', 'password wrong')
            return res.redirect('/login')
        }

        req.session.isLogin = true
        req.session.name = isEmailRegistered.name
        req.session.email = isEmailRegistered.email

        res.redirect('/')

    } catch (error) {
        req.flash('error', 'Internal server error');
        res.redirect('/login');
    }
}

function logout (req, res) {
    req.session.destroy(err => {
        if (err) {
          console.error(err.message);
        } else {
          res.redirect('/login'); 
        }
      });
}

async function addIncome(req, res) {
    try {
        const categoryId = parseInt(req.params.id)
        const nameCategories = await prisma.incomeCategory.findMany({
            where: {
              userId: categoryId 
            },
            select: {
                nameCategory: true,
                id: true
            }
        });

        res.render('addIncome', {
            id: categoryId,
            category: nameCategories
        })
    } catch (error) {
        req.flash('error', error);
        res.redirect('/');
    }
}

async function addIncomePost(req,res) {
    try {

        const id = req.params.id
        const { amount, note, category } = req.body
        // console.log({ amount, note, id, category })

        await prisma.income.create({
            data: {
                date: new Date(),
                amount: Number(amount),
                note,
                userId: Number(id),
                categoryId: Number(category)
            }
        })

        await prisma.users.update({
            where: {
                id: Number(id)
            },
            data: {
                balance: {
                    increment: Number(amount)
                },
                totalIncome: {
                    increment: Number(amount)
                }
            }
        })

        res.redirect('/')    
    } catch (error) {
        req.flash('error', error);
        res.redirect('/addIncome');
    }
}


async function addOutcome(req, res) {

    try {
        const categoryId = parseInt(req.params.id)
        const nameCategories = await prisma.outcomeCategory.findMany({
            where: {
                userId: categoryId
            },
            select: {
                nameCategory: true,
                id: true
            }
        });

        res.render('addOutcome', {
            id: categoryId,
            category: nameCategories
        })
    } catch (error) {
        req.flash('error', error);
        res.redirect('/');
    }
}

async function addOutcomePost(req,res) {
    try {

        const id = req.params.id
        const { amount, note, category } = req.body
        // console.log({ amount, note, id, category })

        await prisma.outcome.create({
            data: {
                date: new Date(),
                amount: Number(amount),
                note,
                userId: Number(id),
                categoryId: Number(category)
            }
        })

        await prisma.users.update({
            where: {
                id: Number(id)
            },
            data: {
                balance: {
                    decrement: Number(amount)
                },
                totalOutcome: {
                    increment: Number(amount)
                }
            }
        })

        res.redirect('/')    
    } catch (error) {
        req.flash('error', error);
        res.redirect('/addIncome');
    }
}

function addIncomeCategory(req, res) { 
    const id = req.params.id
    res.render('addIncomeCategory', {id})
}

async function addIncomeCategoryPost(req, res) {
    try {
        const id = req.params.id
        await prisma.incomeCategory.create({
            data: {
                userId: Number(id),
                nameCategory: req.body.nameCategory
            }
        })
        // console.log(addIncomeCategory)

        res.redirect(`/addIncome/${id}`)
    } catch (error) {
        req.flash('error', error)
        res.redirect('/')
    }
}

function addOutcomeCategory(req, res) {
    const id = req.params.id   
    res.render('addOutcomeCategory', {id})
}

async function addOutcomeCategoryPost(req, res) {
    try {
        const id = req.params.id
        await prisma.outcomeCategory.create({
            data: {
                userId: Number(id),
                nameCategory: req.body.nameCategory
            }
        })

        res.redirect(`/addOutcome/${id}`)
    } catch (error) {
        req.flash('error', error)
        res.redirect('/')
    }
}

async function deleteCategoryIncome(req, res) {
    try {
        const id = req.params.id
        const idUser = req.params.idUser
        // console.log({id})
        const category = await prisma.incomeCategory.findUnique({
            where: {
                id: Number(id),
                userId: Number(idUser)
            },
            include: {
                incomes: true
            }
        })

        if(category) {
            if (category.incomes.length > 0) {
                req.flash('error', 'cant delete this category, because it has income related')
            } else {
              await prisma.incomeCategory.delete({
                where: {
                  id: Number(id),
                  userId: Number(idUser)
                }
              });
              req.flash('success', 'delete category successfully')
            }
          } else {
            req.flash('error', 'category not found')
          }

        res.redirect(`/addIncome/${idUser}`)
    } catch (error) {
        req.flash('error', error)
        res.redirect('/addIncome')
    }
}

async function deleteCategoryOutcome(req, res) {
    try {
        const id = req.params.id
        const idUser = req.params.idUser
        // console.log({id})
        const category = await prisma.outcomeCategory.findUnique({
            where: {
                id: Number(id),
                userId: Number(idUser)
            },
            include: {
                outcomes: true
            }
        })

        if(category) {
            if (category.outcomes.length > 0) {
                req.flash('error', 'cant delete this category, because it has income related')
            } else {
              await prisma.outcomeCategory.delete({
                where: {
                  id: Number(id),
                  userId: Number(idUser)
                }
              });
              req.flash('success', 'delete category successfully')
            }
          } else {
            req.flash('error', 'category not found')
          }

        res.redirect(`/addOutcome/${idUser}`)
    } catch (error) {
        req.flash('error', error)
        res.redirect('/addOutcome')
    }
}

async function editCategoryIncome(req, res) {
    try {
        const idCategory = Number(req.params.idCategory)
        const idUser = Number(req.params.idUser)
        
        res.render('editCategoryIncome', {idUser, idCategory})
    } catch (error) {
        req.flash('error', error)
        res.redirect('/addIncome')
    }
}

async function editCategoryIncomePost(req, res) {
    try {
        const name = req.body.name
        const idCategory = Number(req.params.idCategory)
        const idUser = Number(req.params.idUser)

        await prisma.incomeCategory.update({
            where: {
                id: Number(idCategory),
                userId: Number(idUser)
            },
            data: {
                nameCategory: name
            }
        })

        res.redirect(`/addIncome/${idUser}`)
         
    } catch (error) {
        req.flash('error', error)
        res.redirect('/')
    }
}

async function editCategoryOutcome(req, res) {
    try {
        const idCategory = Number(req.params.idCategory)
        const idUser = Number(req.params.idUser)
        
        res.render('editCategoryOutcome', {idUser, idCategory})
    } catch (error) {
        req.flash('error', error)
        res.redirect('/addOutcome')
    }
}

async function editCategoryOutcomePost(req, res) {
    try {
        const name = req.body.name
        const idCategory = Number(req.params.idCategory)
        const idUser = Number(req.params.idUser)

        await prisma.outcomeCategory.update({
            where: {
                id: Number(idCategory),
                userId: Number(idUser)
            },
            data: {
                nameCategory: name
            }
        })

        res.redirect(`/addOutcome/${idUser}`)
         
    } catch (error) {
        req.flash('error', error)
        res.redirect('/')
    }
}

app.listen(process.env.PORT, () => {
    console.log('server running on port ' + process.env.PORT)
})