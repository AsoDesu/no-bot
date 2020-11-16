import got from 'got'

async function getUser(uid: string) {
    var returnRes: any
    await got(`https://new.scoresaber.com/api/player/${uid}/full`).then(async res => {
        returnRes = (await JSON.parse(res.body))
    }).catch(() => {
        return false;
    })
    return returnRes
}

export default getUser