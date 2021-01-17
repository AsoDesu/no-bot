type uncollectedXpContent = {
    userid: string,
    amount: number
}

var uncollectedxp: uncollectedXpContent[] = []

function addUncollectedXp(id :string, amount: number) {
    var currentamount = uncollectedxp.find(u => u.userid == id)
    if (!currentamount) { 
        uncollectedxp.push({ userid: id, amount: amount })
        return amount
    } else {
        uncollectedxp[uncollectedxp.findIndex(u => u.userid == id)].amount = currentamount.amount += amount
        return amount
    }
}

function resetxp(id :string, amount: number) {
    var user = uncollectedxp.find(u => u.userid == id)
    if (user) { 
        uncollectedxp[uncollectedxp.findIndex(u => u.userid == id)]. amount = 0
        return true
    } else {
        return false
    }
}

export default {
    cache: uncollectedxp,
    addxp: addUncollectedXp,
    resetxp: resetxp
}