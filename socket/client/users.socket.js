const User = require("../../model/user.model")
const RoomChat = require("../../model/rooms-chat.model")
module.exports = async(res) =>{
    const userIdA = res.locals.user.id
    _io.once("connection", (socket) =>{
        //  khi a gửi yêu cầu cho b
        socket.on("CLIENT_ADD_FRIEND", async(userIdB) =>{
            const existAinB = await User.findOne({
                _id:userIdB,
                acceptFriends:userIdA
            })
            if(!existAinB){
                await User.updateOne({
                    _id:userIdB
                },{
                    $push:{acceptFriends:userIdA}
                })
            }
            const existBinA = await User.findOne({
                _id:userIdA,
                requestFriends:userIdB
            })
            if(!existBinA){
                await User.updateOne({
                    _id:userIdA
                },{
                    $push:{requestFriends:userIdB}
                })
            }
            const infoUserB = await User.findOne({
                _id:userIdB
            })
            const lengthAcceptFriend = infoUserB.acceptFriends.length
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND",{
                userId:userIdB,
                lengthAcceptFriend:lengthAcceptFriend
            })
            // lay infor cua a va tra ve cho b
            const infoUserA = await User.findOne({
                _id:userIdA,
            }).select("id avatar fullName")
            // console.log("SERVER_RETURN_INFO_ACCEPT_FRIEND")
            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND",{
                userId:userIdB,
                infoUserA:infoUserA
            })
        })
        // huy yeu cau
        socket.on("CLIENT_CANCEL_FRIEND", async(userIdB) =>{
            const existAinB = await User.findOne({
                _id:userIdB,
                acceptFriends:userIdA
            })
            if(existAinB){
                await User.updateOne({
                    _id:userIdB
                },{
                    $pull:{acceptFriends:userIdA}
                })
            }
            const existBinA = await User.findOne({
                _id:userIdA,
                requestFriends:userIdB
            })
            if(existBinA){
                await User.updateOne({
                    _id:userIdA
                },{
                    $pull:{requestFriends:userIdB}
                })
            }
            const infoUserB = await User.findOne({
                _id:userIdB
            })
            const lengthAcceptFriend = infoUserB.acceptFriends.length
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND",{
                userId:userIdB,
                lengthAcceptFriend:lengthAcceptFriend
            })
            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND",{
                userId:userIdB,
                useridA:userIdA
            })
        })
        // tu choi ket ban
        socket.on("CLIENT_REFUSE_FRIEND", async(userIdB) =>{
            const existAinB = await User.findOne({
                _id:userIdB,
                acceptFriends:userIdA
            })
            if(existAinB){
                await User.updateOne({
                    _id:userIdA
                },{
                    $pull:{acceptFriends:userIdB}
                })
            }
            const existBinA = await User.findOne({
                _id:userIdB,
                requestFriends:userIdA
            })
            if(existBinA){
                await User.updateOne({
                    _id:userIdB
                },{
                    $pull:{requestFriends:userIdA}
                })
            }
        })
        
        socket.on("CLIENT_ACCEPT_FRIEND", async(userIdB) =>{
            const roomChat = new RoomChat({
                typeRoom: "friend",
                users: [
                  {
                    user_id: userIdA,
                    role: "superAdmin"
                  },
                  {
                    user_id: userIdB,
                    role: "superAdmin"
                  }
                ],
              });
        
              await roomChat.save();
        
              // Thêm {user_id, room_chat_id} của B vào friendsList của A
              // Xóa id của B trong acceptFriends của A
              await User.updateOne({
                _id: userIdA
              }, {
                $push: {
                  friendsList: {
                    user_id: userIdB,
                    room_chat_id: roomChat.id
                  }
                },
                $pull: { acceptFriends: userIdB }
              });
        
              // Thêm {user_id, room_chat_id} của A vào friendsList của B
              // Xóa id của A trong requestFriends của B
              await User.updateOne({
                _id: userIdB
              }, {
                $push: {
                  friendsList: {
                    user_id: userIdA,
                    room_chat_id: roomChat.id
                  }
                },
                $pull: { requestFriends: userIdA }
              });
        })
    })
}