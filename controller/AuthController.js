require('dotenv').config()
const User = require('../models/user')
const Response = require('../utilities/response')
const jwt = require('jsonwebtoken')
const { SignUpValidation, SignInValidation } = require('../utilities/Validations')
const fs = require('fs')


const okResponse = (req, res) => {
    const response = new Response()
    response.error = false
    res.send(response)
}


const ValidateToken = (req, res, next) => {

    let AuthHeader = req.headers['authorization']
    const token = AuthHeader && AuthHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    else
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            console.log(err)
            if (err) res.sendStatus(403)
            else
                next()

        })
}


const createToken = (userData) => {

    return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

const createRefreshToken = (userData) => {
    return jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET)
}

const uniqueEmail = (email) => new Promise((resolve, reject) => {

    User.findOne({ "email": email })
        .then((res) => {
            if (!res) {
                resolve('')
            } else {
                reject('Email is Already Taken')
            }
        })
        .catch((err) => { console.log(err) })

})

const uniqueID = (platform_id) => new Promise((resolve, reject) => {

    User.findOne({ "platform_id": platform_id })
        .then((res) => {
            if (!res) {
                resolve('')
            } else {
                reject(res)
            }
        })
        .catch((err) => { console.log(err) })

})

const viewUsers = (req, res) => {

    const response = new Response()
    const search = req.query.search || null


    try {

        User.paginate(search != null ? { name: { $regex: search, $options: 'i' } } : {}, { page: req.query.page || 1, limit: 10 })
            .then((result) => {
                response.data = result
                response.message = "Success"
                res.send(response)
            })
            .catch((error) => {
                response.data = error
                response.message = "Error"
                response.error = true
                res.send(response)
            })

    } catch (error) {
        console.log(error)
        res.send(error)
    }


}

const createrUser = (req, res) => {

    const user = new User(req.body)
    const response = new Response()

    try {
        let validate = SignUpValidation(req.body)

        if (validate.error == true) {

            response.message = validate.messsage
            response.error = true
            res.send(response)

        } else {
            
            if (req?.body?.assertion == 'password') {

                uniqueEmail(req.body.email)
                    .then(() => {
                        save_return()
                    })
                    .catch((err) => {
                        console.log(err)
                        response.error = true
                        response.message = err
                        res.status(401).send(response)
                    })

            } else {

                uniqueID(req.body.platform_id)
                    .then(() => {
                        save_return()
                    })
                    .catch((data) => {
                        response.data = data
                        const ACCESS_TOKEN = createToken({ email: data.email, type: data?.type, id: data?._id })
                        const REFRESH_TOKEN = createRefreshToken({ email: data.email })
                        response.data = { "email": data.email, "password": data.password, "id": data.id, "type": data.type, "ACCESS_TOKEN": ACCESS_TOKEN, "REFRESH_TOKEN": REFRESH_TOKEN, assertion: data?.assertion, "avatar": data?.avatar,"is_stripe_connected":data?.is_stripe_connected }
                        res.send(response)

                    })

            }



        }

    } catch (error) {
        console.log(error)
        res.send(error)
    }


    const save_return = async () => {

        user.save()
            .then((result) => {
                response.data = result
                const ACCESS_TOKEN = createToken({ email: result.email, type: result?.type, id: result?._id })
                const REFRESH_TOKEN = createRefreshToken({ email: result.email })
                response.data = { "email": result.email, "password": result.password, "id": result.id, "type": result.type, "ACCESS_TOKEN": ACCESS_TOKEN, "REFRESH_TOKEN": REFRESH_TOKEN, assertion: result?.assertion, "avatar": result?.avatar, }
                res.send(response)

            })
            .catch((err) => { console.log(err); res.send(err) })

    }

}

const loginUser = (req, res) => {

    const response = new Response()

    try {
        let validate = SignInValidation(req.body)

        if (validate.error == true) {

            response.message = validate.messsage
            response.error = true

        } else {

            User.findOne({ "email": req.body.email, "password": req.body.password })
                .then((resp) => {
    
                    if (resp) {
                        const ACCESS_TOKEN = createToken({ email: req.body.email, type: resp?.type, id: resp?._id })
                        const REFRESH_TOKEN = createRefreshToken({ email: req.body.email })
                        response.message = "Login Sucessfull"
                        response.data = { "id": resp._id, "email": req.body.email, "ACCESS_TOKEN": ACCESS_TOKEN, "REFRESH_TOKEN": REFRESH_TOKEN, "type": resp.type, "phone": resp?.mobile, "avatar": resp?.avatar, assertion: resp?.assertion,"is_stripe_connected":resp?.is_stripe_connected }
                        res.send(response)

                    } else {
                        response.error = true
                        response.message = "Invalid Email or Password"
                        res.status(401).send(response)
                    }
                })
                .catch((err) => { console.log(err); res.send(err); })

        }



    } catch (error) {
        console.log(error)
        res.send(error)
    }

}

const showUser = (req, res) => {

    const response = new Response()

    try {

        User.findById(req?.params?.id)
            .then((resp) => {

                if (resp) {

                    response.data = resp
                    response.message = "User Successfully Fetched"
                    res.send(response)

                } else {
                    response.error = true
                    response.message = "User Not Found"
                    res.status(422).send(response)
                }
            })
            .catch((err) => { console.log(err); res.send(err); })


    } catch (error) {
        console.log(error)
        res.send(error)
    }

}

const updateUser = (req, res) => {

    const response = new Response()

    try {


        User.findByIdAndUpdate({ "_id": req?.body?.id }, { ...req?.body?.userData }, (error, data) => {
            if (error) {
                response.message = "Maybe wrong id"
                response.error = true
                res.status(422).send(response)
            } else {

                response.message = data.name + ' updated to ' + req.body.name
                response.data = data
                res.send(response)

            }
        })


    } catch (error) {
        console.log(error)
        res.send(error)
    }

}

const editUserImg = (req, res) => {

    const response = new Response()

    try {

        // const pathImage = './' + req.body.prevImage

        // fs.unlink(pathImage, function (err) {
        //     if (err) return console.log(err);
        //     console.log('file deleted successfully');
        // });

        User.findByIdAndUpdate({ "_id": req?.body?.id }, { avatar: req.file.path }, (error, data) => {
            if (error) {
                console.log(error)
                response.message = "Maybe wrong id"
                response.error = true
                res.status(422).send(response)
            } else {
                console.log(data)

                response.message = "Image Updated"
                data.avatar = req.file.path
                response.data = data
                res.send(response)

            }
        })


    } catch (error) {
        console.log(error)
        res.send(error)
    }

}


module.exports = {
    createrUser,
    viewUsers,
    loginUser,
    ValidateToken,
    okResponse,
    showUser,
    updateUser,
    editUserImg
}