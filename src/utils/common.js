// 复姓
const twoSurname = [
  "司马",
  "上官",
  "欧阳",
  "夏侯",
  "诸葛",
  "南宫",
  "西门",
  "百里",
  "拓跋",
  "尉迟",
  "公孙",
  "端木",
  "皇甫",
  "东方",
  "淳于",
  "令狐",
  "钟离",
  "宇文",
  "长孙",
  "慕容",
  "太史",
  "独孤",
  "纳兰"
]
// 会话列表是否存在当前消息聊天
const isExistChat = (sessionList,id) => {
  let isExist = false
  for (let item of sessionList) {
    if (item.chatTarget === id) {
      isExist = true
      break
    }
  }
  return isExist
}

export {
  twoSurname,
  isExistChat,
}