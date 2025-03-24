let socket;

function initializeWebSocket() {
    if (!window.socket) { 
        const existingSocketId = localStorage.getItem("socketId");

        if (existingSocketId) {
            console.log("Reusing socket ID from localStorage:", existingSocketId);
        }

        window.socket = io("/", { withCredentials: true });

        window.socket.on("connect", () => {
            localStorage.setItem("socketId", window.socket.id);
            console.log('Socket connected:', window.socket.id);
        });

        window.socket.on("match_found", (data) => {
            console.log("Match found for you!", data);
            alert("Match found!");
            window.location.href = "/inmatch";  
        });

        window.socket.on("matchmaking_timer", (message) => {
            const notification = document.getElementById("notification-container");
            if (notification) {
                notification.innerHTML = message;
            }
        });

        window.socket.on("move_made",(data)=>{
            console.log("Received move_made event with data:", data);
            if (data && data.chessboard) {
                updateChessboard(data.chessboard);
            } else {
                console.error("Invalid data received in move_made event:", data);
            }
        })

        window.socket.on("matchmaking_error", (data) => {
            if (data.code === "in_match") {
                alert(data.message);
                window.location.href = "/inmatch";  
            } else if (data.code === "timed_out") {
                alert(data.message);  
            }
        });

        window.socket.on("in_match_error",(data)=>{
            if(data.code=="not_in_match" || data.code=="not_in_game_state"){
                alert(data.message)
                window.location.href="/home"
            }else if(data.code=="not_your_turn" ||
                data.code=="no_match_actions" ||
                data.code=="invalid_move" || 
                data.code=="no_updated_match_actions"
            ){
                alert(data.message)
            }
        })

        window.socket.on("connect_error", (err) => {
            console.error("WebSocket connection error:", err.message);
            alert(`Connection failed: ${err.message}`);
        });

        window.socket.on("disconnect", () => {
            console.log("WebSocket disconnected");
        });

        window.socket.on("reconnect", () => {
            console.log("Reconnected to WebSocket:", window.socket.id);
        });

        window.socket.on("reconnect_error", (err) => {
            console.error("Reconnect failed:", err.message);
        });
    }
}

const getSocket = () => {
    return window.socket;
};

initializeWebSocket();
