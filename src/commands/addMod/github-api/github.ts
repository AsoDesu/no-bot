import { parse } from 'dotenv/types'
import got from 'got'
import { repot } from './types'

async function getRepo(url: string) {
    var returnRes: any
    await got(`https://api.github.com/repos/` + parseUrl(url)).then(async res => {
        returnRes = (await JSON.parse(res.body))
    }).catch(() => {
        return false;
    })
    return returnRes as repot
}

function parseUrl(url: string) {
    if (url.endsWith('/')) { url = url.substring(0, url.length - 1) }
    return url.replace('https://github.com/', '')
}

export default {
    getRepo: getRepo
}