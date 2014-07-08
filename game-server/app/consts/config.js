var conf = module.exports = {
    DB: {
        dbHost: '127.0.0.1'
        , dbPort: 27015
        , dbName: 'tankstrike'
        , dbUser: ''
        , dbPass: ''
    }

    , ROOM: {
        namePrefix: 'R_',
        prefix: 'TSR_'
        , revivalInterval: 3000
        , maxPlayers: 20
        , map: ''
        , allowKillFriend: false
        , allowJoinAfterStart: false
        , mode: 'a'
        , status: {
            pending: 0
            , ready: 1
            , running: 2
            , over: 3
        }
    }

    , MODE: {
        // 团队竞技
        'a': '../domain/game_mode/modes/a'
    }

    , PLAYER: {
        prefix: 'TSP_'
    }
};
