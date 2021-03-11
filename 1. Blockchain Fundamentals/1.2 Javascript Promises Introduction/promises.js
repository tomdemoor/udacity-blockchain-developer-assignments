//lets make a promise

//useful a task that takes time that you cant to do in the background while running other javascript
//Practical example: downloading a big image from another web server to not make everything else wait for it, with feedback for failures and successes

let p = new Promise((resolve, reject) => {
    let a = 1 + 1

    //what if the promise is a success
    if (a == 2){
        resolve('success')
    }else{
    //what if the promise is a failure    
        reject('failed')
    }
})

//a cleaner way of doing callbacks

//do this when it is a success or failure
p.then((message) => {
    console.log('This is in the then ' + message)
}).catch((message) => {
    console.log('This is in catch ' + message)
})