const KAFKA_URL = process.env.KAFKA_URL;
const KAFKA_TOPIC = process.env.KAFKA_TOPIC;

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

function sign_request(context) {
  return new Promise((resolve, reject) => {

    if (KAFKA_URL && KAFKA_TOPIC){
      //ship via kafka
      
    }
    else if (REDIS_HOST && REDIS_PORT){

    }
    else {

    }

    //console.log(require('util').inspect(context.query))
    return resolve();
  });
}

module.exports = sign_request;
