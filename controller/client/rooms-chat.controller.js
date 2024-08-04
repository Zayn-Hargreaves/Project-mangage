const User = require("../../model/user.model")
const RoomChat = require("../../model/rooms-chat.model")
module.exports.index = async(req, res) =>{
    const userId = res.locals.user.id;
    const listRoomChat = await RoomChat.find({
        'user.user_id':userId,
        typeRoom:"group",
        deleted:false
    })
    res.render("client/page/rooms-chat/index",{
        pageTitle:"Danh sách phòng chat",
        listRoomChat:listRoomChat
    })
}
module.exports.create = async(req, res) =>{
    const friendList = res.locals.user.friendsList
    for (const friend of friendList) {
        const infoUser = await User.findOne({
            _id:friend.user_id,
            deleted:false
        }).select("fullName avatar")
        friend.infoFriend = infoUser
    }
    res.render("client/page/rooms-chat/create",{
        pageTitle:"Tạo phòng chat",
        friendsList:friendList
    })
}
module.exports.createPost = async(req, res) =>{
    const title = req.body.title
    const usersId =  req.body.usersId
    if(usersId.length > 1){
        const dataRoom = {
            title:title,
            typeRoom:"group",
            users:[]
        }
        for (const userId of usersId) {
            dataRoom.users.push({
                user_id:userId,
                role:"user",
            })
        }
        dataRoom.users.push({
            user_id:res.locals.user.id,
            role:"superAdmin",
        })
        const roomChat = new RoomChat(dataRoom)
        await roomChat.save()
        res.redirect(`/chat/${roomChat.id}`)
    }else{
        console.log("ok")
    }
}