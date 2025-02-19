const $ = document.querySelector.bind(document);
const clientIDElement = $(".client-id");
const remoteID = $(".session-id");
const joinButton = $(".join");

var peer = new Peer();

peer.on("open", function (id) {
  clientIDElement.innerHTML = `Client ID: ${id}`;
});

// Handle incoming connections
peer.on("connection", function (conn) {
  conn.on("open", function () {
    console.log(`Incoming connection has opened!`);
    // Receive messages
    conn.on("data", function (data) {
      console.log("Received data (incoming):", data);
    });

    // Send messages
    setTimeout(() => {
      conn.send("Test Message from receiver after 5 seconds");
    }, 5000);
  });
});

// Handle outgoing connections
joinButton.addEventListener("click", () => {
  try {
    console.log("Connecting...");
    const conn = peer.connect(remoteID.value);
    
    conn.on("open", () => {
      console.log("Outgoing connection has opened!");
      
      conn.on("data", (data) => {
        console.log("Received data (outgoing):", data);
      });

      setTimeout(() => {
        conn.send("Test Message from initiator after 5 seconds");
      }, 5000);
    });
  } catch (err) {
    console.error(err);
  }
});

peer.on("error", (err) => {
  console.error("Peer error:", err);
});


