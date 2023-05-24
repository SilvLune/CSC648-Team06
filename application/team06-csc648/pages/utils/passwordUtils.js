/**
 * CSC 648 Spring 2023 - Team 6
 * File: passwordUtils.js
 * Author: Justin Shin
 * 
 * Description: Utility functions for generating and validating salt/hash/password
 */

const crypto = require('crypto')

function genPassword(password){
    var salt = crypto.randomBytes(32).toString('hex')
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    return{salt: salt, hash: genHash}
}

function validPassword(password, hash, salt){
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    return hash === hashVerify
}

module.exports.validPassword = validPassword
module.exports.genPassword = genPassword
