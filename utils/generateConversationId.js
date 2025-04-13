const generateConversationId = (userId1, userId2) => {
    const sortedUsers = [userId1, userId2].sort();
    return `${sortedUsers[0]}_${sortedUsers[1]}`;
};

export default generateConversationId;
