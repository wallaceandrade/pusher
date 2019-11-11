const app        = require('express')();
const http       = require('http').createServer(app);
const io         = require('socket.io')(http);
const bodyParser = require('body-parser');

app.use(bodyParser.json());

/**
 * Publicar um evento na namespace chat
 */
app.post('/publish/chat', function (req, res) {
   const { chatId, payload, event } = req.body;
   if (
       chatId === undefined ||
       payload === undefined ||
       event === undefined
   ) {
       res.status(422).send({
           status: false,
           message: "Informe todos os parâmetros: chatId, payload e event"
       });
   }
   const chatChannel = `/chat/${chatId}`;
   chat.to(chatChannel).emit(event, payload);

   res.status(200).send({
       status: true,
       message: "Evento disparado"
   });
});

/**
 * Namespace do chat no socket-io
 * Adiciona em uma sala de acordo com a namespace informada
 *
**/
const chat = io.of(/^\/chat\/\d+$/).on('connect', (socket) => {
    const chatId = socket.nsp.name;
    console.log(chatId);
    socket.join(chatId);
});

/**
 * Roda o servidor HTTP
 */
http.listen(3000, function(){
    console.log('running in *:3000');
});
