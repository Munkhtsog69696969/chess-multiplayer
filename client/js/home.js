initializeWebSocket();

document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('play-button');
    const friendsButton = document.getElementById('friends-button');
    const profileButton = document.getElementById('profile-button');

    playButton.addEventListener('click', () => {
        if(window.socket){
            window.socket.emit("matchmaking")
            console.log('Matchmaking request sent');
        }else{
            console.error('Socket is not initialized');
        }
    });

    friendsButton.addEventListener('click', () => {
        window.location.href="/friends"
    });

    profileButton.addEventListener('click', () => {
      
    });
});