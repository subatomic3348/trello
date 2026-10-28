const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()
const key = "subatomic3348"

app.use(express.json())

const USERS = []
const ORGANIZATION = []


const BOARDS = []
const ISSUES = []

let USERS_ID = 1
let ORG_ID = 1

let BOARD_ID = 1
let ISSUE_ID = 1




app.get('/',(req,res)=>{
    res.json(USERS)
})
//middlewares

const middlewares = (req,res,next)=>{
    const token = req.headers['authorization']
    if(!token){
        return res.status(403).json({
            message:"no token found"
        })
    }
    try{
    const decoded = jwt.verify(token,key)
    console.log(decoded)
    req.userid =  decoded.userId
    next()
    }

    catch(e){
        res.json({
            message:'you are not authenticated to access this route'
        })
    }
      
   
}

//create


app.post('/signup',(req,res)=>{

    const  username = req.body.username
    const  password = req.body.password
    const userExist = USERS.find(user=>user.username===username)
    if(userExist){
        res.status(443).json({
            message:"This user already exists"
        })
        return
    }

    const user = {
        id : USERS_ID++,
        username: username,
        password: password
    }
    USERS.push(user)
    return res.json({
        message:"user added successfully"
    })
    


})

app.post('/signin',(req,res)=>{
    const username = req.body.username
    const password  = req.body.password
    const autheticated = USERS.find(user=>user.username===username&&user.password===password)
    console.log(autheticated);
    
    
    if(!autheticated){
        res.status(443).json({
            message:"Incorrect Credentials"
        })
        return
    }
    //creating a token

    const token = jwt.sign(
        {
        userId : autheticated.id
         },
        key,
        
     )

   return res.json({
    message: "user logged in",
    token:token

   })


    

})

app.post('/organization', middlewares, (req,res)=>{
    //orgs = id,org title, org des, org admin, org members
    const title = req.body.title
    const description = req.body.description

    const existinORG = ORGANIZATION.find(o=>o.title===title)
    if(existinORG){
        res.status(403).json({
            message:"this org already exists , Try with a different name"
        })
        return
    }


    const org = {
        id : ORG_ID++,
        title:title,
        description:description,
        admin:req.userid,
        members:[]
    }
    ORGANIZATION.push(org)

    return res.json({
        message: "Organization created successfully",
        org,
        ORGANIZATION : org.id,
        ORGANIZATION
    })



    

})


app.post('/add-members',middlewares,(req,res)=>{
    const userId = req.userid
    const orgId = parseInt(req.body.orgId);
    const memberUserName = req.body.memberUserName
    const orgexist =  ORGANIZATION.find(or => or.id===orgId)
    console.log(orgexist);
    
    if(!orgexist||orgexist.admin!=userId){
        res.status(411).json({
            message:"You are not authenticated Or you might not be the admin of the organization"
        })
        return
    }

    const memberExist = USERS.find(user=>user.username===memberUserName)
    console.log(memberExist);
    
    if(!memberExist){
        return res.status(404).json({
            message:"This user not found in the database"
        })
    }

    orgexist.members.push(memberExist.id)
    res.json({
        message:"member added to the organization"
    })




})

app.get('/organizations',middlewares,(req,res)=>{
    const userId = req.userid
    const orgId = parseInt(req.query.orgId);
    const orgexist = ORGANIZATION.find(or=>or.id===orgId)
    if(!orgexist||orgexist.admin!=userId){
        return res.json({
            message:"The Organization doesnot exist or You are not the admin of this org"
        })
    }
    res.json({
        organization:{
            ...orgexist,
            members: orgexist.members.map(memberId=>{
                const user = USERS.find(user=>user.id===memberId)
                return {
                    id: user.id,
                    username:user.username

                }
            })
        }
    })



})

app.post('/boards',(req,res)=>{

})

app.post('/issue',(req,res)=>{

})

//GET

app.get('/member',(req,res)=>{

})

app.get('/boards',(req,res)=>{

})

app.get('/issues',(req,res)=>{

})

//UPDATE

app.put('issues',(req,res)=>{
    //change with status  of issues
})

//DELETE

app.delete('/members',middlewares,(req,res)=>{
    const userId = req.userid
    const memberId = req.body.memberId
    const  orgId = parseInt(req.body.orgId)
    const organization = ORGANIZATION.find(org=>org.id===orgId)
    console.log(organization);
    
    if(!organization||organization.admin!=userId){
        return res.json({
            message:"this organization doesnot exist or YOu are not the admin of the organization"
        })

    }
    const member =  organization.members.find(mem=>mem===memberId) 
    console.log(member);
    
    const memberInDB =  USERS.find(user=>user.id===memberId)
    if(!member){
        return res.json({
          message:"This user is not in our database or is not present in the organization"
        })
    }
    organization.members =  organization.members.filter(mem=>mem!=memberId);
    res.json({
        message:"The member deleted successfully from the organization"
    })




})

app.delete('/boards',(req,res)=>{

})




app.listen(3000,()=>{
    console.log('app is listening on port 3000');
    
})



