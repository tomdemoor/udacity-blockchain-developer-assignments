const userLeft = false
const userWatchingCatMeme = false

function watchTutorialPromise(){
    return new Promise((resolve, reject) => {
        if(userLeft){
            reject({
                name: 'User Left',
                message: ':( sadge'   
            })
        } else if (userWatchingCatMeme){
            reject({
                name: 'User watching meme about Scottie',
                message: 'Tom < Cat'
            })
        } else {
            resolve('Amazing')
        }
    })
}

//instead of nesting callbacks (callback hell), just a a new 'then'

watchTutorialPromise().then((message) => {
    console.log('Success: ' + message)
}).catch((error) => {
    console.log(error.name + ' ' + error.message)
})