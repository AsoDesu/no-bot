import got from 'got'

async function getUser(uid: string) {
    const response = await got(`https://new.scoresaber.com/api/player/${uid}/full`)
    return (await JSON.parse(response.body))
}

export default getUser