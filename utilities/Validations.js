const SignUpValidation = ({ name, email, password, assertion }) => {

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    let error = {
        error: false,
        messsage: ""
    }

    if (name == '' || name == undefined) {

        error.error = true
        error.messsage = 'Name is Required!'

    } else if (email == '' || email == undefined) {

        error.error = true
        error.messsage = 'Email is Required!'

    } else if (reg.test(email) === false) {

        error.error = true
        error.messsage = 'Email is Invalid!'

    } else if (password == '' || password == undefined && assertion == 'password') {

        error.error = true
        error.messsage = 'Password is Required!'

    }


    return error

}

const SignInValidation = ({ email, password }) => {

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    let error = {
        error: false,
        messsage: ""
    }

    if (email == '' || email == undefined) {

        error.error = true
        error.messsage = 'Email is Required!'

    } else if (reg.test(email) === false) {

        error.error = true
        error.messsage = 'Email is Invalid!'

    } else if (password == '' || password == undefined) {

        error.error = true
        error.messsage = 'Password is Required!'

    }


    return error

}


module.exports = { SignUpValidation, SignInValidation }