const Brands = require('../models/brand')
const Response = require('../utilities/response')
const {capitalizeSentence} = require('../utilities/Capitalize')

const uniqueName = (name) => new Promise((resolve, reject) => {

    name = capitalizeSentence(name)

    Brands.findOne({ "name": name })
        .then((res) => {
            if (!res) {
                resolve('')
            } else {
                reject('Name is already taken')
            }
        })
        .catch((err) => { console.log(err) })

})

const EditBrand = (req, res) => {

    const response = new Response()

    try {

        if (req.body.name === '' || req.body.name == undefined) {

            response.message = "Name is required"
            response.error = true
            res.send(response)

        } else {

            uniqueName(req.body.name)
                .then(() => {

                    Brands.findByIdAndUpdate({ "_id": req.body._id }, { "name": capitalizeSentence(req.body.name) }, (error, data) => {
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

const delBrand = (req, res) => {

    const response = new Response()

    let brandId = req.body.id

    try {

        Brands.findByIdAndDelete(brandId)
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

const viewBrands = (req, res) => {

    const response = new Response()
    const search = req.query.search || null

    try {

        Brands.paginate(search != null ? { name: { $regex: search, $options: 'i' } } : {}, { page: req.query.page || 1, limit: 10 })
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


const addBrands = (req, res) => {

    req.body.name = capitalizeSentence(req.body.name)

    const brand = new Brands(req.body)
    const response = new Response()

    try {

        if (req.body.name === '' || req.body.name == undefined) {

            response.message = "Name is required"
            response.error = true
            res.send(response)

        } else {

            uniqueName(req.body.name)
                .then(() => {
                    brand.save()
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
    addBrands,
    viewBrands,
    delBrand,
    EditBrand
}