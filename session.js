const sessions = {}; // storage for sessions

// makes a session for when user logs in
exports.setSession = function(req, username) { 
    req.sessionID = username;
    sessions[username] = { userName: username, timestamp: Date.now() };
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
        console.log(`${sessionId} logged out.`);
        return true;
    } else {
        console.log(`${sessionId} not found.`);
        return false;
    }
};