const express = require('express');
const bodyParser = require('body-parser');
const { response } = require('express');

const app = express();

app.use(bodyParser.json());

var a = 0
var b = 0
const users = []
const news = []
const friendsReq = [];

const authorize = (request, response, next) => {
        const authorization = request.headers.authorization.split(" ")
        const authorization2 = atob(authorization[1]).split(":")
        const username = authorization2[0];
        const password = authorization2[1];
        let uname = users.find(da => da.username == username)
        let index1 = users.indexOf(uname)
        if (users[index1].auth == true){
            if (authorization[0].toLowerCase() !== "basic") {
                return response.json({
                    message:"Bad token"
                })
            }
        
            if (uname == undefined) {
                response.json({
                    message:"User not found"
                })
            }
        
            let index = users.indexOf(uname)
            let pass = users[index].password
        
        
                if (pass !== password) {
                response.json({
                    message:"Wrong Password"
                })
            }

            
    }else {
            response.json({
                message:"User not confirmed, please conferm in /auth/confirm"
            })
    }
        next();
        }


app.post('/reg', (req,res) => {
   const  username = req.headers.username
   const  password = req.headers.password
   const confirmPassword = req.body.confirmpassword
   const id =  users.length + 1

    // if (password != confirmPassword) {
    //     res.json({
    //         message:"Password doesnt match"
    //     })
    // } 

    users.push({id,username:username,password:password,friends:[],auth:false})
    res.json({
        message:"User created",
        message:"Please confirm verification",
    })
    
})

app.post('/reg/confirm', (req,res) => {
    const username = req.headers.username
    const verif = req.headers.verification
    let user = users.find(da => da.username == username)
    let index = users.indexOf(user)
    a = Math.floor(Math.random() * 10);
    b = Math.floor(Math.random() * 10);
    let c = a + b
    if (verif == c) {
        users[index].auth = true
        res.json({
            message:"Successful auth"
        })
    }else{
        res.json({
            a,b,
            message:"Try again"
        })
    }
    

})
app.get('/users',authorize, (req,res) => {
    res.json({
        users
    })
})

app.get('/news',authorize, (req,res) => {
    res.json({
        news
    })
})

app.post('/news', authorize, (req,res) => {
    const title = req.body.title
    const content = req.body.content
    news.push({title:title, content:content})
    res.json({
        message:"Title created"
    })
})

app.post('/friends', authorize, (req,res) => {
    const username = req.headers.username
    const friendUsername = req.headers.friendusername
    const id =  friendsReq.length + 1
    friendsReq.push({id,username:username,friendUsername:friendUsername})
    res.json({
        message:"Friend request sent"
    })

})

app.get('/friends', authorize, (req,res) => { 
    const username = req.headers.username
    let a = friendsReq.filter(da => da.username = username)
    res.json({
        a
    })
})

app.post('/friends/confirm', (req,res) => {
    const username = req.headers.username
    const friendUsername = req.headers.friendusername
    let user = users.find(da => da.username == username)
    let index = users.indexOf(user)
    let freq = friendsReq.find(da => da.username = username)
    let index2 = users.indexOf(freq)
        let fuser = users.find(da => da.username == friendUsername)
        let findex2 = users.indexOf(fuser)
        users[index].friends.push(users[findex2])
        friendsReq.splice(index2,1)
        res.json({
            message:"Friend added"
        })

})
app.delete('/friends', authorize, (req,res) => {
    const username = req.headers.username
    const friendUsername = req.headers.friendUsername
    let user = users.find(da => da.username == username)
    let index = users.indexOf(user)
    let friend = users[index].friends.find(da =>da.username = friendUsername)
    let index2 = users.indexOf(friend)
    if (user !== undefined || friend !== undefined) { 
            users[index].friends.splice(index2,1)
            res.json({
                res: "Friend deleted"
            })
            }else {
                res.json({
                    message: "User not found",
                }) 
            }
})

app.listen(5050, () => console.log("Started")); 