const capitalizeWord = s => (s && s[0].toUpperCase() + s.slice(1).toLowerCase())

const capitalizeSentence = s => {

    let array = s.split(' ')

    for (let index = 0; index < array.length; index++) {
        array[index] = array[index][0].toUpperCase() + array[index].slice(1).toLowerCase()
    }

    array = array.join(" ")

    return array

}

module.exports = {
    capitalizeSentence,
    capitalizeWord
}