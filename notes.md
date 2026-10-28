const users = [{
    username:"shubham",
    pass:123
}]
 const user= {
    username:"shubham",
    pass:123
 }
const found = users.includes(user)

console.log(found)

# we cannot do this in objects and even with same property of two object it has different reference , and include checks the reference --(more on this)