var session = require('express-session');
const sessions = {}; // In-memory session storage

exports.setSession = function (req, username) {
    const sessionId = new Date().getTime(); // Simple session ID
    req.sessionID = sessionId;
    sessions[sessionId] = { userName: username };
    console.log("Session Created.");
};

exports.getSession = function(req) {
    const sessionId = req.sessionID;
    return sessions[sessionId];
};

exports.deleteSession = function (req) {
    const sessionId = req.sessionID;
    delete sessions[sessionId];
    console.log("Session Deleted.");
};

