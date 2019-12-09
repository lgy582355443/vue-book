const user = {
    state: {
        userList: [
            {
                username: 'admin',
                password: '123',
                userInfo: {
                    nickname: 'AuroraReader',
                    avatar:require('../../assets/images/user/avatar.png'),
                    signature: 'Welcome to AuroraReader'
                }
            }
        ],
        historyList: []
    },
    mutations: {
        SET_USER_LIST(state, userList) {
            state.userList = userList;
        },
        SET_HISTORY_LIST(state, historyList) {
            state.historyList = historyList;
        },
    }
}

export default user;