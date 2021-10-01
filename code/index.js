const WebSocket = require('ws')
const Max = require('max-api')


let ws = new WebSocket('wss://irl.winwin.zone/ws/')

ws.onopen = function(e) {
  console.log('Websocket open.')
  ws.send(JSON.stringify({ cmd: 'SCREEN_JOIN' }))
}

ws.onclose = function(e) {
  console.log('Websocket closed.')
}

ws.onerror = function(e) {
  console.log('Websocket errored.')
}

ws.onmessage = function(e) {
  const msg = JSON.parse(e.data)
  let val = 0
  if(msg.cmd === "SCREEN_BRANCH")
    val = handleBranch(msg.data[0].answers)
  else if(msg.cmd = "SCREEN_TREE")
    val = handleTree(msg.data)

  // TODO: MARK -- put the Max.outlet code here
  // not sure this is 100% correct maybe check it - JBG
    Max.outlet(val)
   // console.log(e.data)
    console.log(val)
}

function handleBranch(data) {
  let obj = data.reduce((obj, ans) => {
    ans.val ? obj.a++ : obj.d++
    return obj
  }, {a: 0, d: 0})
  obj.a = obj.a / data.length
  obj.d = obj.d / data.length
  return (obj.a > obj.d ? obj.a : obj.d) * 100
}

function handleTree(data) {

  let p = 0
  let cp = 0

  if(data.answers && data.answers.length > 0) {
    p = handleBranch(data.answers)
  }

  if(data.children && data.children.length > 0) {
    for(child of data.children) {
      cp += handleTree(child)
    }
    cp /= data.children.length 
  }

  return (p + cp) / 2

}

