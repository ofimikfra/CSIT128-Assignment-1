const sessions = {}; // In-memory session storage

exports.setSession = function(req, username) {
    const sessionId = generateSessionId();
    req.sessionID = sessionId;
    sessions[sessionId] = { userName: username, timestamp: Date.now() };
    console.log(`Session Created for ${username} with ID: ${sessionId}`);
};

exports.getSession = function(req) {
    const sessionId = req.sessionID;
    if (sessionId && sessions[sessionId]) {
        return sessions[sessionId];
    } else {
        return null;
    }
};

exports.deleteSession = function(req) {
    const sessionId = req.sessionID;
    if (sessionId && sessions[sessionId]) {
        delete sessions[sessionId];
        console.log(`Session Deleted for ID: ${sessionId}`);
    } else {
        console.log(`Session with ID ${sessionId} not found.`);
    }
};

// Helper function to generate a secure session ID
function generateSessionId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}