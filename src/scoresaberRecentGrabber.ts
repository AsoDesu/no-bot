import got from 'got'

type scoreSaber = {
    "scores": [
        {
            "rank": number,
            "scoreId": number,
            "score": number,
            "unmodififiedScore": number,
            "mods": string,
            "pp": number,
            "weight": number,
            "timeSet": string,
            "leaderboardId": number,
            "songHash": string,
            "songName": string,
            "songSubName": string,
            "songAuthorName": string,
            "levelAuthorName": string,
            "difficulty": number,
            "difficultyRaw": string,
            "maxScore": number
        }
    ]
}

async function getUser(uid: string) {
    var returnRes: any
    await got(`https://new.scoresaber.com/api/player/${uid}/scores/recent/1`).then(async res => {
        returnRes = (await JSON.parse(res.body))
    }).catch(() => {
        return false;
    })
    return returnRes as scoreSaber
}

export default getUser