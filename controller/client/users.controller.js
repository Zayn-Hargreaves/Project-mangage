const User = require("../../model/user.model")
const usersSocket = require("../../socket/client/users.socket")
//not-friend
module.exports.notfriend = async (req, res) => {
    usersSocket(res)

    const userId = res.locals.user.id
    const myUser = await User.findOne({
        _id: userId
    })
    const requestFriends = myUser.requestFriends
    const acceptFriends = myUser.acceptFriends
    const friendList = myUser.friendsList
    const friendListId = friendList.map(item => item.user_id)
    const users = await User.find({
        $and: [
            { _id: { $ne: userId } },
            { _id: { $nin: requestFriends } },
            { _id: { $nin: acceptFriends } },
            { _id: { $nin: friendListId } }
        ],
        status: "active",
        deleted: false
    }).select("id avatar fullName")
    res.render("client/page/users/not-friend", {
        pageTitle: "Danh sách người dùng",
        users: users
    })
}

// /users/request
module.exports.request = async (req, res) => {
    usersSocket(res)

    const userId = res.locals.user.id
    const myUser = await User.findOne({
        _id: userId
    })
    const requestFriends = myUser.requestFriends
    const users = await User.find({
        _id: { $in: requestFriends },
        status: "active",
        deleted: false
    }).select("id avatar fullName")
    res.render("client/page/users/request", {
        pageTitle: "Lời mời đã gửi",
        users: users
    })
}
// /user/accept
module.exports.accept = async (req, res) => {
    usersSocket(res)

    const userId = res.locals.user.id
    const myUser = await User.findOne({
        _id: userId
    })
    const acceptFriends = myUser.acceptFriends
    const users = await User.find({
        _id: { $in: acceptFriends },
        status: "active",
        deleted: false
    }).select("id avatar fullName")
    res.render("client/page/users/accept", {
        pageTitle: "Lời mời chấp nhận",
        users: users
    })
}
// /user/friends
module.exports.friend = async (req, res) => {
    usersSocket(res)

    const userId = res.locals.user.id
    const myUser = await User.findOne({
        _id: userId
    })
    const friendList = myUser.friendsList
    const friendListId = friendList.map(item => item.user_id)
    const users = await User.find({
        _id: { $in: friendListId },
        status: "active",
        deleted: false
    }).select("id avatar fullName statusOnline")
    for (const user of users) {
        const infoFriend = friendList.find(friend => friend.user_id == user.id)
        user.infoFriend = infoFriend
    }

    res.render("client/page/users/friends", {
        pageTitle: "Danh sách bạn bè",
        users: users
    })
}