// const jwt = require('jsonwebtoken');

// module.exports = async (req, res, next) => {
//     try {
//         // Check if the authorization header exists
//         const authHeader = req.headers['authorization'];
//         if (!authHeader) {
//             return res.status(401).send({ message: 'Authorization header missing', success: false });
//         }

//         // Ensure token format is correct: "Bearer <token>"
//         const token = authHeader.split(" ")[1];
//         if (!token) {
//             return res.status(401).send({ message: 'Token missing', success: false });
//         }

//         // Verify the token
//         jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//             if (err) {
//                 return res.status(401).send({ message: 'Invalid or expired token', success: false });
//             }

//             // Attach the decoded user ID to the request body
//             req.body.userId = decoded.id;
//             next();
//         });
//     } catch (err) {
//         console.log('Error in auth middleware:', err);
//         res.status(500).send({ message: 'Server error during authentication', success: false });
//     }
// };

const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(200).send({ message: `Auth Failed`, success: false });
            } else {
                req.body.userId = decode.id;
                next();
            }
        });
    } catch (err) {
        console.log(err);
        res.status(401).send({
            message: `Auth Failed`,
            success: false
        })
    }
}
