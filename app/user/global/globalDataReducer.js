export const globalDataReducer = (state, action) => {

  if (action.type == 'GLOBALUSERDATA') {
    return {
      ...state,
      globalUserProfile: action.payload,
      message: state.message,
      user: state.user,
      userMemories: state.userMemories,
      rightSideBarData: state.rightSideBarData
    };
  }

  if (action.type === "fetch-message") {
    state.message = [...action.payload];
    return state;
  }

  if (action.type === "send-message") {
    return {
      ...state,
      globalUserProfile: state.globalUserProfile,
      message: [...state.message, action.payload],
      user: state.user,
      userMemories: state.userMemories,
      rightSideBarData: state.rightSideBarData
    };
  }
  if (action.type === "receive-message") {
    return {
      ...state,
      globalUserProfile: state.globalUserProfile,
      message: [...state.message, action.payload],
      user: state.user,
      userMemories: state.userMemories,
      rightSideBarData: state.rightSideBarData
    };
  }


  if (action.type === "EDITED_MESSAGE") {
    const { id, msg } = action.payload
    const index = state?.message?.findIndex((m) => m._id == id);
    state.message[index].message = { type: 'text', content: msg };
    return {
      ...state,
      globalUserProfile: state.globalUserProfile,
      message: [...state.message],
      user: state.user,
      userMemories: state.userMemories,
      rightSideBarData: state.rightSideBarData
    };
  }



  if (action.type === "concate-emoji") {
    // // const tergatMessage = state?.filter(m=>m._id == action.payload)
    const { messageId, senderId, senderName, senderProfile, emoji } =
      action.payload;
    const index = state?.message?.findIndex((m) => m._id == messageId);
    if ("emoji" in state?.message[index]) {
      const duplicateEmoCheck = state.message[index].emoji.filter(
        (em) => em.senderId !== senderId
      );
      state.message[index].emoji = [
        ...duplicateEmoCheck,
        { senderId, senderName, senderProfile, emoji },
      ];
    } else {
      state.message[index].emoji = [
        { senderId, senderName, senderProfile, emoji },
      ];
    }
    // // if ("emoji" in tergatMessage[0] == false) {
    // //   tergatMessage[0].emoji = [{senderId,senderName,senderProfile,emoji}]
    // //   console.log(state)
    // //   return state
    // // }
    return {
      ...state,
      globalUserProfile: state.globalUserProfile,
      message: [...state.message],
      user: state.user,
      userMemories: state.userMemories,
      rightSideBarData: state.rightSideBarData
    };
  }

  if (action.type === "fetch-scroll-message") {
    return {
      ...state,
      globalUserProfile: state.globalUserProfile,
      message: [...action.payload, ...state.message],
      user: state.user,
      userMemories: state.userMemories,
      rightSideBarData: state.rightSideBarData
    };
  }

  if (action.type === "empty-message") {
    state.message = [];
    return state;
  }

  ///////////////////////////////////////////User logic from here/////////////////////////////
  if (action.type === "STORE_ALL_MESSANGER_USER") {
     console.log("store user:", action.payload);
    return {
      ...state,
      globalUserProfile: state.globalUserProfile,
      message: state.message,
      user: [...action.payload],
      userMemories: state.userMemories,
      rightSideBarData: state.rightSideBarData
    };
  }
  ///////////////////////////////////////////User logic from here/////////////////////////////
  if (action.type === "MERGE_ALL_MESSANGER_USER") {
      console.log("merge user:", action.payload);
    return {
      ...state,
      globalUserProfile: state.globalUserProfile,
      message: state.message,
      user: [...state.user,...action.payload],
      userMemories: state.userMemories,
      rightSideBarData: state.rightSideBarData
    };
  }

  ///////////////////////////////////////////User logic from here/////////////////////////////
if (action.type === "INSURT_LAST_MESSANGER_USER") {
    console.log("new user:", action.payload);
  const userId = String(action.payload.userId);

  const updatedUser = state.user.find(
    (item) => String(item.userId) === userId
  );

  const otherUsers = state.user.filter(
    (item) => String(item.userId) !== userId
  );
  const res = {
    ...state,
     globalUserProfile: state.globalUserProfile,
      message: state.message,
      user:[
      action.payload,
      ...otherUsers,
    ],
      userMemories: state.userMemories,
      rightSideBarData: state.rightSideBarData
  };
  return res
}


  if (action.type === "STORE_MESSANGER_USER_AFTER_DELETE_SELECTED_USERS") {
    const restUser = state.user.filter(user => !action.payload.includes(user.userId))
    return {
      ...state,
      globalUserProfile: state.globalUserProfile,
      message: state.message,
      user: restUser,
      userMemories: state.userMemories,
      rightSideBarData: state.rightSideBarData
    };
  }

  if (action.type === "INSURT_MY_USER_PROFILE") {
    // const isExist = state.user.some(user=>user.senderId===action.payload.senderId)
    // const isExistObj = state.user.find(user=>user.senderId===action.payload.senderId)
    const updateArrey = state.user.filter(
      (user) => user.userId !== action.payload.userId
    );
    return {
      ...state,
      globalUserProfile: state.globalUserProfile,
      message: state.message,
      user: [action.payload, ...updateArrey],
      userMemories: state.userMemories,
      rightSideBarData: state.rightSideBarData
    };
  }

  if (action.type === "STORE_REMOTE_USER_PROFILE") {
    const existingUser = state.user.filter(
      (user) => user.userId === action.payload.data.userId
    );
    const updatingUsers = state.user.filter(
      (user) => user.userId !== action.payload.data.userId
    );
    const newUserModify = {
      ...action.payload.data,
      unseenMessageCount: existingUser[0]?.unseenMessageCount + 1,
      test: "sttt",
    };
    return {
      ...state,
      globalUserProfile: state.globalUserProfile,
      message: state.message,
      user: [newUserModify, ...updatingUsers],
      userMemories: state.userMemories,
      rightSideBarData: state.rightSideBarData
    };
  }

  ///////////////////////////////Logic for user memory management///////////////////////////
  if (action.type === "ADD_ALL_MEMORY") {
    return {
      ...state,
      globalUserProfile: state.globalUserProfile,
      message: state.message,
      user: state.user,
      userMemories: action.payload,
      rightSideBarData: state.rightSideBarData
    };
  }
  if (action.type === "ADD_NEW_MEMORY") {
    return {
      ...state,
      globalUserProfile: state.globalUserProfile,
      message: state.message,
      user: state.user,
      userMemories: action.payload,
      rightSideBarData: state.rightSideBarData
    };
  }
  if (action.type === "STORE_RIGHTSIDEBAR_DATA") {
    return {
      ...state,
      globalUserProfile: state.globalUserProfile,
      message: state.message,
      user: state.user,
      userMemories: state.userMemories,
      rightSideBarData: action.payload
    };
  }

  if (action.type === "DELETE_MESSAGE") {
    // // const tergatMessage = state?.filter(m=>m._id == action.payload)
    const index = state?.message?.findIndex((m) => m._id == action.payload);
    state.message[index].message = null;
    state.message[index].emoji = [];
    state.message[index].reply = [null, null]
    state.message[index].others = null
    return {
      ...state,
      globalUserProfile: state.globalUserProfile,
      message: [...state.message],
      user: state.user,
      userMemories: state.userMemories,
      rightSideBarData: state.rightSideBarData
    };
  }

  if (action.type == 'STORE_NOTIF') {
    return {
      ...state,
      notifications: action.payload
    }
  }

if (action.type === "NEW_NOTIF") {
  console.log(action.payload)
  return {
    ...state,
    notifications: [ action.payload,...state.notifications],
  };
}

  if (action.type == 'CHANGE_NOTIF') {
    const notif = state.notifications.map((notification) => ({
      ...notification,
      seen: true,
    }));
    return {
      ...state,
      notifications: notif
    }
  }


  return state;
};
