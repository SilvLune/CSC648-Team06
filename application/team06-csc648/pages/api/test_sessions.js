import {withIronSession} from "next-iron-session"

function testHandler(req, res, session){
    const customer = req.session.get('customer')
    res.send({customer})
}

export default withIronSession(testHandler, {
    cookieName: 'gateway_cookie',
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieOptions:{
        secure: process.env.NODE_ENV === "production"
    }
})