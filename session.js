const sessions = {}; // storage for sessions

// makes a session for when user logs in
exports.setSession = function(req, username) { 
    const sessionId = generateSessionId();
    req.sessionID = sessionId;
    sessions[sessionId] = { userName: username, timestamp: Date.now() };
    console.log(`${username} logged in.`);
};

// returns current session
exports.getSession = function(req) { 
    const sessionId = req.sessionID;
    if (sessionId && sessions[sessionId]) {
        return sessions[sessionId];
    } else {
        return null;
    }
};

// deletes current session when user logs out
exports.deleteSession = function(req) { 
    const sessionId = req.sessionID;
    if (sessionId && sessions[sessionId]) {
        delete sessions[sessionId];
        console.log(`Session ${sessionId} logged out.`);
        return true;
    } else {
        console.log(`Session with ID ${sessionId} not found.`);
        return false;
    }
};

// not important but idk how to get rid of this and not have the whole login system break again
function generateSessionId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}