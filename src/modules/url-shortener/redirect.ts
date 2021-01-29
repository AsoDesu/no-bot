import { Request, Response } from 'express'

import firebase from 'firebase'
import 'firebase/firestore'
import '../../firebaseinnit'
import url from './url'
var db = firebase.firestore()

async function command(req: Request, res: Response) {
    if (req.params.shorturl.endsWith('.ico')) {res.sendStatus(404); return;}

    var urlData = await db.collection("urls").doc(req.params.shorturl).get()
    if (!urlData.exists) {
        res.send('404: Short URL Not Found')
        return;
    }
    var fullUrl = urlData.data().full
    var clicks = urlData.data().clicks

    clicks += 1

    res.redirect(fullUrl)
    db.collection("urls").doc(req.params.shorturl).set({
        clicks: clicks
    }, {merge: true})
}

export default command