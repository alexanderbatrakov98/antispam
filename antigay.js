let MessageCL = toColour(0, 255, 255, 255);

const BAN_FILE_PATH = 'MuteList.txt';

function loadBanData() {
    let banData = {};
    try {
        const data = loadTextFile(BAN_FILE_PATH);
        if (data) {
            banData = JSON.parse(data);
        }
    } catch (e) {
        console.error('Failed to load ban data:', e);
    }
    return banData;
}

function saveBanData(banData) {
    try {
        const data = JSON.stringify(banData);
        saveTextFile(BAN_FILE_PATH, data);
    } catch (e) {
        console.error('Failed to save ban data:', e);
    }
}

let banData = loadBanData();

addEventHandler('onPlayerJoined', (event, client) => {
    const playerId = event.playerId;
    const currentTime = new Date().getTime();

    if (banData[playerId]) {
        const banEndTime = banData[playerId].banEndTime;

        if (currentTime < banEndTime) {
            banData[playerId].isChatBanned = 1;
            const MessageBan = `You are currently banned until ${new Date(banEndTime).toLocaleString()} for inappropriate language.`;
            messageClient(MessageBan, client, MessageCL);
        } else {
            banData[playerId].isChatBanned = 0;
            delete banData[playerId];
            saveBanData(banData);
        }
    }
});

addEventHandler('onPlayerChat', (event, client, message) => {
    const playerId = event.playerId;

    if (banData[playerId] && banData[playerId].isChatBanned === 1) {
        const MessageBan = 'You are currently banned from chatting.';
        messageClient(MessageBan, client, MessageCL);
        return event.preventDefault();  
    }

    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes('gay')) {
        const currentTime = new Date().getTime();
        const banDuration = 60 * 60 * 1000;
        const banEndTime = currentTime + banDuration;

        banData[playerId] = {
            banEndTime: banEndTime,
            name: client.name,
            isChatBanned: 1
        };
        saveBanData(banData);

        const MessageBan = `You are banned from chat for 60 minutes until ${new Date(banEndTime).toLocaleString()} for using inappropriate language.`;
        messageClient(MessageBan, client, MessageCL);

        return false;
    }
});
