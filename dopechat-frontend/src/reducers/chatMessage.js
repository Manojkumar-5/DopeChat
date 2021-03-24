import CONSTANTS from '../utils/constants';
import pastDate from '../utils/pastDate';

// initial state
// [
//     {
//         _id:Id,(chatroomid)
//         eventListLength:Number,
//         firstMessageNumber,
//         messages:[
//             {
//                 event
//             }
//         ]
//     }
// ]

const groupMessages = (eventsArray) => {
  const groupedMessages = {};
  eventsArray.forEach((event) => {
    const { messageNumber } = event;
    if (messageNumber in groupedMessages)
      groupedMessages[messageNumber].push(event);
    else groupedMessages[messageNumber] = [event];
  });
  return Object.keys(groupedMessages).reduce((grouped, num) => {
    grouped.push(groupedMessages[num]);
    return grouped;
  }, []);
};

const compressEventsArray = (eventsArray) => {
  eventsArray.sort((event1, event2) => {
    const d1 = new Date(event1.createdAt);
    const d2 = new Date(event2.createdAt);
    if (d1 < d2) {
      return -1;
    }
    if (d1 > d2) {
      return 1;
    }
    return 0;
  });
  const { length } = eventsArray;
  return eventsArray[length - 1];
};

const updateChatMessagesWithNewEvents = (
  chatMessages,
  { chatRecordId, events }
) => {
  // console.log("LOADDINGWTF")
  const index = chatMessages.findIndex((chat) => chat._id === chatRecordId);
  let chat = {};
  if (index !== -1) chat = chatMessages[index];
  else {
    chat.messages = [];
    chat.eventListLength = 0;
    chat._id = chatRecordId;
  }
  // console.log("EVENTS",events)
  // console.log('New chat', chat);
  // console.log('New chat messages', chat.messages);
  chat.messages.push(...events);
  chat.messages = groupMessages(chat.messages).map((messageGroup) =>
    compressEventsArray(messageGroup)
  );
  const rejectedEvents = false;
  // console.log('after pushing', chat);
  if (chat.firstMessageNumber && chat.firstMessageNumber > 0) {
    // slicing.
    const { firstMessageNumber } = chat;
    const firstMsgIndex = chat.messages.findIndex(
      (event) => event.messageNumber === firstMessageNumber
    );
    if (firstMsgIndex !== 0) {
      const newFirstMessageNumber = chat.messages[0].messageNumber;
      const oneBeforeFirstMessageNumber = firstMessageNumber - 1;
      if (
        oneBeforeFirstMessageNumber - newFirstMessageNumber + 1 !==
        firstMsgIndex
      ) {
        chat.messages = chat.messages.slice(firstMsgIndex);
        rejectedEvents = true;
      }
    }
  }
  if (!rejectedEvents) chat.eventListLength += events.length;
  chat.firstMessageNumber = chat.messages.length
    ? chat.messages[0].messageNumber
    : 0;
  if (index !== -1) chatMessages[index] = chat;
  else chatMessages.push(chat);
  return [...chatMessages];
};

const addNewMessage = (chatMessages, { chatRecordId, event }) => {
  const chat = chatMessages.find((chat) => chat._id === chatRecordId);
  chat.messages.push(event);
  if (chat.firstMessageNumber === 0) {
    chat.firstMessageNumber = event.messageNumber;
  }
  chat.eventListLength += 1;
  return [...chatMessages];
};

const addEditDeleteEvent = (chatMessages, { chatRecordId, event }) => {
  const chat = chatMessages.find((chat) => chat._id === chatRecordId);
  chat.eventListLength += 1;
  const index = chat.messages.findIndex(
    (msg) => msg.messageNumber === event.messageNumber
  );
  chat.messages[index] = event;
  return [...chatMessages];
};

const messagesDelivered = (chat, chatRoomId, serverTime) => {
  if (chat._id === chatRoomId) {
    chat.messages.forEach((event) => {
      if (new Date(event.receivedTime).getTime() === pastDate.getTime())
        event.receivedTime = new Date(serverTime);
      return event;
    });
  }
  return chat;
};

const messageSeen = (chat, chatRoomId, seenTime) => {
  if (chat._id === chatRoomId) {
    chat.messages.forEach((event) => {
      if (new Date(event.seenTime).getTime() === pastDate.getTime())
        event.seenTime = new Date(seenTime);
      return event;
    });
    console.log(chat);
  }
  return chat;
};

const updateSeenDeliveredTIme = (chat, { chatRoomId, serverTime, isSeen }) => {
  console.log(`chatRoomId is ${chatRoomId}`);
  console.log(`serverTime  is ${serverTime}`);
  console.log(`isSeen is ${isSeen}`);
  if (chat._id === chatRoomId) {
    chat.messages.forEach((event) => {
      if (new Date(event.receivedTime).getTime() === pastDate.getTime())
        event.receivedTime = new Date(serverTime);
      if (new Date(event.seenTime).getTime() === pastDate.getTime() && isSeen)
        event.seenTime = new Date(serverTime);
      return event;
    });
    console.log(chat);
  }
  return chat;
};

const ChatMessageReducer = (chatMessages = [], { type, payload }) => {
  switch (type) {
    case CONSTANTS.LOAD_MESSAGES:
      return updateChatMessagesWithNewEvents(chatMessages, payload);
    // return payload; // send chatRoomId from action
    case CONSTANTS.NEW_MESSAGE:
      return addNewMessage(chatMessages, payload);
    case CONSTANTS.NEW_EDIT_DELETE_EVENT:
      return addEditDeleteEvent(chatMessages, payload);
    case CONSTANTS.MESSAGES_DELIVERED:
      return chatMessages.map(
        (chat) =>
          messagesDelivered(chat, payload.chatRoomId, payload.serverTime) // check payload for CRI
      );
    case CONSTANTS.UPDATE_SEEN_TIME:
      console.log('UPDATING SEEN TIME REDUCER');
      return chatMessages.map(
        (chat) => messageSeen(chat, payload.chatRoomId, payload.seenTime) // check payload for CRI
      );
    case CONSTANTS.UPDATE_DELIVERED_SEEN_TIME:
      return chatMessages.map((chat) => updateSeenDeliveredTIme(chat, payload)); // check payload CRI
    case CONSTANTS.LOGOUT:
      return [];
    default:
      return chatMessages;
  }
};

export default ChatMessageReducer;
