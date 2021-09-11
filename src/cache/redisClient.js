const redis = require("redis");
const client = redis.createClient();

client.set("foo_rand000000000000", "OK_string")

// This will return a JavaScript String
client.get("foo_rand000000000000", function(err, reply) {
  console.log(reply.toString()); // Will print `OK`
  client.end(true)
});


export {
    client
}