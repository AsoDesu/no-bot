import got from 'got'

type scoreSaber = {
    playerInfo: {
        playerId: string,
        playerName: string,
        avatar: string,
        rank: number,
        countryRank: number,
        pp: number,
        country: string,
        role: any,
        badges: [],
        history: string,
        permissions: number,
        inactive: number,
        banned: number
    },
    scoreStats: {
        totalScore: number,
        totalRankedScore: number,
        averageRankedAccuracy: number,
        totalPlayCount: number,
        rankedPlayCount: number
    }
}

async function getUser(uid: string) {
    var returnRes: any
    await got(`https://new.scoresaber.com/api/player/${uid}/full`).then(async res => {
        returnRes = (await JSON.parse(res.body))
    }).catch(() => {
        return false;
    })
    return returnRes as scoreSaber
}

export default getUser