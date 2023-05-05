import {withIronSession} from 'next-iron-session'

export default withIronSession(
    async function loginRoute(req, res){
        console.log("*session storing*")
        const{customer_id, email} = req.query
        req.session.set('user', {customer_id: customer_id, email: email})
        try{
            await req.session.save()
            res.status(200).json({isLoggedIn: true})
        }catch(error){
            res.status(500).json({message: 'Error saving session'})
        }
    },
    {
        cookieName: 'gateway_cookie',
        password: process.env.SECRET_COOKIE_PASSWORD,
        cookieOptions:{
            secure: process.env.NODE_ENV === "production"
        }
    }
)

// export default async function login(req, res){
//     const {email, password} = req.query
//     console.log('*login* req.query.email: ' + email)
//     const {customer_id, hash, salt} = await axios.get(`/api/customers_get_email?email=${email}`)
//     console.log('*login* customer_id: ' + customer_id)
//     // const valid = passwordUtils.validPassword(password, hash, salt)
//     // if(valid){
//     //     req.session.set('user', {customer_id: customer_id, email: email})
//     //     await req.session.save()
//     //     res.status(200).json({isLoggedIn: true})
//     // }else{
//     //     console.log('not valid')
//     //     res.status(401).json({message: 'Invalid Credentials'})
//     // }
// }

