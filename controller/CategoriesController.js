const Categorie = require('../models/categorie')
const Response = require('../utilities/response')
const { capitalizeSentence } = require('../utilities/Capitalize')
const fs = require('fs')


const uniqueName = (name) => new Promise((resolve, reject) => {

    name = capitalizeSentence(name)

    Categorie.findOne({ "name": name })
        .then((res) => {
            if (!res) {
                resolve('')
            } else {
                reject('Name is already taken')
            }
        })
        .catch((err) => { console.log(err) })

})

const EditCategory = (req, res) => {

    const response = new Response()

    try {

        if (req.body.name === '' || req.body.name == undefined) {

            response.message = "Name is required"
            response.error = true
            res.send(response)

        } else {

            req.body.name = capitalizeSentence(req.body.name)

            if (req.file) {
                req.body.image = req.file.path
            }
        
            if (req.body.prevImage) {
        
                const pathImage = './' + req.body.prevImage
        
                fs.unlink(pathImage, function (err) {
                    if (err) return console.log(err);
                    console.log('file deleted successfully');
                });
        
            }

            uniqueName(req.body.name)
                .then(() => {

                    Categorie.findByIdAndUpdate({ "_id": req.body._id }, req?.body , (error, data) => {
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

                })
                .catch((err) => {
                    response.error = true
                    response.message = err
                    res.status(422).send(response)
                    console.log(err)
                })

        }



    } catch (error) {
        console.log(error)
        res.send(error)
    }

}

const delCategory = (req, res) => {

    const response = new Response()

    let catId = req.body.id

    try {

        Categorie.findByIdAndDelete(catId)
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

const viewCategories = (req, res) => {

    const response = new Response()
    const search = req.query.search || null

    try {

        Categorie.paginate(search != null ? { name: { $regex: search, $options: 'i' } } : {}, { page: req.query.page || 1, limit: req.query.limit || 10 })
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


const addCategories = (req, res) => {


    const response = new Response()

    try {

        req.body.name = capitalizeSentence(req?.body?.name)

        if (req.file) {
            req.body.image = req.file.path
        }

        const category = new Categorie(req.body)

        if (req.body.name === '' || req.body.name == undefined) {

            response.message = "Name is required"
            response.error = true
            res.send(response)

        } else {

            uniqueName(req.body.name)
                .then(() => {
                    category.save()
                        .then((result) => {

                            response.message = result.name + " added successfully"
                            response.data = result
                            res.send(response)

                        })
                        .catch((err) => console.log(err))
                })
                .catch((err) => {
                    response.error = true
                    response.message = err
                    res.status(422).send(response)
                    console.log(err)
                })

        }

    } catch (error) {
        console.log(error)
        res.send(error)
    }


}



module.exports = {
    addCategories,
    viewCategories,
    delCategory,
    EditCategory
}