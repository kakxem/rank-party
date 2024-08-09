import Bun from "bun"

const server = Bun.serve({
  port: 4000,
  fetch(req, server) {
    console.log("fetch", req.url)
    return new Response("helts worlnrtstsdnrtsnrts")
  }, // upgrade logic
  websocket: {
    message(ws, message) {
      console.log("message", message)
    }, // a message is received
    open(ws) {
      console.log("open")
    }, // a socket is opened
    close(ws, code, message) {
      console.log("close", code, message)
    }, // a socket is closed
    drain(ws) {
      console.log("drain")
    }, // the socket is ready to receive more data
  },
})

console.log(`Server listening on ${server.hostname}:${server.port}`)
