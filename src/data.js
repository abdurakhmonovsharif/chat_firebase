const userCardData = [
    {
        id: 1,
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/John_Doe%2C_born_John_Nommensen_Duchac.jpg/220px-John_Doe%2C_born_John_Nommensen_Duchac.jpg',
        fullName: 'John Doe',
        lastText: 'Hey, how are you? what`up  what`up  Hey, how are you? what`up what`up what`up what`up what`up what`up Hey, how are you? what`up what`up what`up what`up what`up what`upHey, how are you? what`up what`up what`up what`up what`up what`up Hey, how are you? what`up what`up what`up what`up what`up what`upHey, how are you? what`up what`up what`up what`up what`up what`up Hey, how are you? what`up what`up what`up what`up what`up what`upHey, how are you? what`up what`up what`up what`up what`up what`up Hey, how are you? what`up what`up what`up what`up what`up what`upHey, how are you? what`up what`up what`up what`up what`up what`up Hey, how are you? what`up what`up what`up what`up what`up what`up what`up  what`up  what`up  what`up Hey, how are you? what`up what`up what`up what`up what`up what`up ',
        status: 'Online',
    },
    {
        id: 2,
        avatar: 'https://media.licdn.com/dms/image/C4E03AQHzZufVzu4TZg/profile-displayphoto-shrink_800_800/0/1629224618025?e=2147483647&v=beta&t=xsOWy4YMGfOCeJXr9trPwwPp3TsXoqd8f1Af_miC57M',
        fullName: 'Alice Smith',
        lastText: 'I just got back from vacation! ',
        status: 'Offline',
    },
    {
        id: 3,
        avatar: 'https://static.wixstatic.com/media/9c4080_2660137735bc4e2e84ca2288fe949b71~mv2.jpg/v1/fill/w_600,h_810,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/9c4080_2660137735bc4e2e84ca2288fe949b71~mv2.jpg',
        fullName: 'Michael Johnson',
        lastText: 'See you later!',
        status: 'Online',
    },
    {
        id: 4,
        avatar: 'https://yt3.googleusercontent.com/ytc/AOPolaQlo3BHbnTz3SihOchA0KnCkiT4a3Mr6lKhSc6J=s900-c-k-c0x00ffffff-no-rj',
        fullName: 'Emily Wilson',
        lastText: 'Can we meet tomorrow?',
        status: 'Offline',
    },
    {
        id: 5,
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Dan_Brown_bookjacket_cropped.jpg',
        fullName: 'Daniel Brown',
        lastText: 'Sounds like a plan!',
        status: 'Online',
    },
    {
        id: 6,
        avatar: 'https://www.themoviedb.org/t/p/w500/rS1pHEsXrLWqpkmzItnAqnBEpZQ.jpg',
        fullName: 'Olivia Martinez',
        lastText: 'Looking forward to it!',
        status: 'Offline',
    },
    {
        id: 7,
        avatar: 'https://media.licdn.com/dms/image/C5603AQEs4aokD5h_cA/profile-displayphoto-shrink_800_800/0/1659658645559?e=2147483647&v=beta&t=LhmS5LTU_YLrPaGoNtIXbF5XtdaP6DeacP9zVDIPEcA',
        fullName: 'William Lee',
        lastText: 'What time works for you?',
        status: 'Online',
    },
    {
        id: 8,
        avatar: 'https://images.squarespace-cdn.com/content/v1/59a706d4f5e2319b70240ef9/1660070064725-JNON2EMGGPR6HMCSJF79/image-asset.png?format=1000w',
        fullName: 'Sophia Wilson',
        lastText: `I can't believe it!`,
        status: 'Offline',
    },
    {
        id: 9,
        avatar: 'https://neuromuscularnetwork.ca/files/SLSheadshot-1-scaled-e1604429415874-1024x881.jpg',
        fullName: 'James Davis',
        lastText: 'Great, see you then!',
        status: 'Online',
    },
    {
        id: 10,
        avatar: 'https://media.licdn.com/dms/image/C5603AQGRjaTMVwXG_g/profile-displayphoto-shrink_800_800/0/1642111200077?e=2147483647&v=beta&t=vS9f4JFlR5bLeGXnE2oxubppnqyLzneUaipIeZfaTB4',
        fullName: 'Ava Johnson',
        lastText: `Let's plan for next week.`,
        status: 'Offline',
    },
];
const pictures = [
    {
        id: 1,
        url: "https://media.architecturaldigest.com/photos/57c7003fdc03716f7c8289dd/16:9/w_1280,c_limit/IMG%20Worlds%20of%20Adventure%20-%201.jpg"
    },
    {
        id: 2,
        url: "https://platinumlist.net/guide/wp-content/uploads/2023/03/IMG-worlds-of-adventure.webp"
    },
    {
        id: 3,
        url: "https://www.timeoutdubai.com/cloud/timeoutdubai/2021/09/14/yvA5SpUH-IMG-Worlds-1200x800.jpg"
    },
    {
        id: 4,
        url: "https://www.imgacademy.com/sites/default/files/img-academy-organization-schema.jpg"
    },
    {
        id: 5,
        url: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000,f_auto/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/v6bwf3e8qhdfhrgq7lv3/IMGWorldsofAdventureAdmissionTicketinDubai-Klook-KlookUnitedStates.jpg"
    }
    ,
    {
        id: 6,
        url: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000,f_auto/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/v6bwf3e8qhdfhrgq7lv3/IMGWorldsofAdventureAdmissionTicketinDubai-Klook-KlookUnitedStates.jpg"
    }
    ,
    {
        id: 7,
        url: "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_3000,h_2000,f_auto/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/v6bwf3e8qhdfhrgq7lv3/IMGWorldsofAdventureAdmissionTicketinDubai-Klook-KlookUnitedStates.jpg"
    }

];
const musicsArray = [
    {
        url: "http://dl.tarona.net/music/2023/01/adil-gospoja.mp3",
        id: 1,
        artist: `Adil`,
        name: `Госпожа`
    },
    {
        url: "http://dl.tarona.net/music/2023/01/Natalia-Gordienko-Na-Sinix-Ozyorax.mp3",
        id: 2,
        artist: `Natalia Gordienko`,
        name: `На Синих Озёрах`
    },
    {
        url: "http://dl.tarona.net/music/2023/01/kalifarniya-puerto-rico-aidarbekov-remix.mp3",
        id: 3,
        artist: `Kalifarniya`,
        name: `Puerto-Rico (Aidarbekov Remix)`
    }
];
const videos = [
    {
        id: 1,
        url: "https://firebasestorage.googleapis.com/v0/b/telegram-26a2c.appspot.com/o/d70b708f0bc20781739bed30bee15f821de1ad9aca22e9cfed7a58043dabc359.mp4?alt=media&token=19de5d47-9250-46b0-9eda-2499774826db"
    },
    {
        id: 2,
        url: "https://firebasestorage.googleapis.com/v0/b/telegram-26a2c.appspot.com/o/fc6dd74e8a654d19bad97f273144b1e005adec84cc55dcbb79f0b82d843e640b.mp4?alt=media&token=bea83ec0-bde0-4c87-882d-d79709a7925a"
    }, {
        id: 3,
        url: "https://firebasestorage.googleapis.com/v0/b/telegram-26a2c.appspot.com/o/y2mate.com%20-%20Show%20time%20%20tez%20orada_1080p.mp4?alt=media&token=aba54ed5-2a07-4d0a-9f3e-6c73c2ed0240"
    },
    {
        id: 4,
        url: "https://firebasestorage.googleapis.com/v0/b/telegram-26a2c.appspot.com/o/y2mate.com%20-%20Show%20time%20%20tez%20orada_1080p.mp4?alt=media&token=aba54ed5-2a07-4d0a-9f3e-6c73c2ed0240"
    }
]
export { userCardData, pictures, musicsArray, videos }