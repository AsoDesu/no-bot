import { Client, Message } from 'discord.js'

import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
import '../../firebaseinnit'

var db = firebase.firestore()

import getUserFromScoresaber from '../../scoresaberApiGrabber'
import giveRoleTo1 from './1Role'

import log from '../../modules/botLog'

type leaderboardUser = {
    scoresaber: string,
    name: string,
    pp: number,
    discord: string
}

var cache: leaderboardUser[]
var cacheStatus = {
    status: '0/0',
    job: false
}

// Function to generate the leaderboard array
async function updateCache(client: Client) {
    console.log('Updating Cache')
    cacheStatus.job = true
    var leaderboard: leaderboardUser[] = []
    var userCollection = (await db.collection('users').where('scoresaberId', '!=', null).get()).docs
    for (const doc of userCollection) {
        var userData = doc.data()
        var ssData = await getUserFromScoresaber(userData.scoresaberId)
        var user: leaderboardUser = { scoresaber: userData.scoresaberId, name: ssData.playerInfo.playerName, pp: ssData.playerInfo.pp, discord: doc.id }
        leaderboard.push(user)
        cacheStatus.status = `${leaderboard.length}/${userCollection.length}`
    }
    leaderboard = leaderboard.sort(function (a, b) {
        return b.pp - a.pp
    })

    log(`Updated cache for ${userCollection.length} users`, client, __filename)
    cacheStatus.job = false

    cache = leaderboard
    return leaderboard
}

function getCache() {
    return cache
}

function getCacheStatus() {
    return cacheStatus
}

export default {
    updateCache,
    getCache,
    getCacheStatus,
    cache
}