import { decode_token } from "./extract_jwt";
export const dataReducer = (state, action) => {
  //user authentication function 
  const { type, paylod } = action;
  if (type == "login_success") {
    state.userInfo = decode_token(paylod.token),
      state.token = paylod.token
  }
  if (type == "logout") {
    state.userInfo = '',
      state.token = ''
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('myDetails')
    }
  }
  //============================
  if (type === "ALL") {
    state.questionData = action.payload;
    return state;
  }

  if (type === "FILTER") {
    const allData = action.payload;
    const filterQuestions = allData.filter((quest) => {
      return quest.subject === action.filter;
    });
    return filterQuestions;
  }

  //===================================
  if (type === "userSearch") {
    state.searchReasultFromGeneralUser = action.payload
  }
  //===================================
  if (type === "authenticUserSearch") {
    state.searchReasultFromAuthenticUser = paylod.searchReasultFromAuthenticUser
  }

  if (type === "INCOMINGMESSAGE") {
    state.incomingMessage.push(paylod.incomingMessage)
  }

  /////////////////////////////////////////////////////
  if (type === 'AcceptedFriend') {
    localStorage.setItem('allAcceptedFriend', JSON.stringify(action.payload))
    // state.getAllAcceptedFriend = [...action.payload]
  }
  /////////////////////////////////////////////////////
  if (type === 'PendingFriend') {
    localStorage.setItem('PendingFriend', JSON.stringify(action.payload))
    // state.getAllPendingFriend = [...action.payload]
  }
  /////////////////////////////////////////////////////
  if (type === 'requestedFriendId') {
    console.log(action)
    localStorage.setItem('requestedFriendId', JSON.stringify([action.payload]))
    // state.getAllPendingFriend = [...action.payload]
  }
  /////////////////////////////////////////////////////
  if (type === 'SET_NEARBY_FRIENDS_ID') {
     state.nearbyUsersId = action.payload
  }
  /////////////////////////////////////////////////////
  if (type === 'GET_NEARBY_FRIENDS_ID') {
    return state
  }


  /////////////////////////////////////////////////////
  if (type === 'START_CALL') {
    return {
      ...state,
      call: {
        isCalling: true,
        data: action.payload
      },
    };
  }

  if (type === 'END_CALL') {
    return {
      ...state,
      call: {
        isCalling: false,
        data: null
      },
    };
  }

  if (type === 'OPEN_LIKED_CONTAINER') {
    return {
      ...state,
      isOpenLikedContainer: {
        openBox: true,
        data: action.payload
      },
    };
  }

  if (type === 'CLOSE_LIKED_CONTAINER') {
    return {
      ...state,
      isOpenLikedContainer: {
        openBox: false,
        data: null
      },
    };
  }

  if (type === 'OPEN_FEEDMAKER') {
    return {
      ...state,
      isOpenFeedMaker: true
    };
  }

  if (type === 'CLOSE_FEEDMAKER') {
    return {
      ...state,
      isOpenFeedMaker: false
    };
  }

  //Here is the calling logic

  return state
}