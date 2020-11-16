import { Message } from 'discord.js'

import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

import '../../firebaseinnit'
import addRole from './addMemberRole'

var database = firebase.firestore()

function addUser(msg: Message, scoresaber: any) {
    var targetUser = msg.mentions.members.first()
    var userRef = database.collection('users').doc(targetUser.id)
    database.collection('users').where('scoresaberId', '==', scoresaber).get().then(docs => {
        if (docs.empty) {
            addUserToFirestore()
            return;
        }
        msg.reply('That scoresaber user is allready registered')
    })

    function addUserToFirestore() {
        userRef.get().then(doc => {
            if (!doc.exists) {
                userRef.set({
                    scoresaberId: scoresaber
                })
                addRole(msg)
                return;
            }
    
            msg.reply("That user is allready registered")
        })
    }
}

export default addUser