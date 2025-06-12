/*  AgentExpress.js   (Node 18+)      */
/*  npm i express cors body-parser dotenv twilio openai          */

require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const bodyP    = require('body-parser');
const twilio   = require('twilio');
const { OpenAI } = require('openai');

const app  = express();
const PORT = process.env.PORT || 3000;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors({ origin: '*' }));
app.use(bodyP.urlencoded({ extended:false }));
app.use(bodyP.json());

/* ---------- TOKEN PARA TWILIO CLIENT (browser) ---------------- */
app.get('/token', (req,res)=>{
  const { TWILIO_ACCOUNT_SID,TWILIO_API_KEY_SID,TWILIO_API_KEY_SECRET,TWILIO_PHONE } = process.env;
  const AccessToken = twilio.jwt.AccessToken;
  const VoiceGrant  = AccessToken.VoiceGrant;

  const token = new AccessToken(
        TWILIO_ACCOUNT_SID,
        TWILIO_API_KEY_SID,
        TWILIO_API_KEY_SECRET,
        { identity:'web_user' }
  );

  /* Grant que permite realizar ► client→PSTN y client→client llamadas
     Sólo vamos a marcar nuestro propio DID, así que NO necesitamos
     outgoingApplicationSid – lo dejamos vacío:                       */
  token.addGrant(new VoiceGrant());
  res.json({ token: token.toJwt() });
});

/* ---------- WEBHOOK /voice (Twilio llama aquí) ----------------- */
app.post('/voice', (req,res)=>{
  const twiml = new twilio.twiml.VoiceResponse();

  twiml.say({ voice:'Polly.Conchita-Neural', language:'es-ES' },
            'Bienvenido a Comidas Express. ¿En qué puedo ayudarle hoy? '
            + 'Por favor hable después del tono.' );

  twiml.record({
      timeout:5,
      maxLength:15,
      transcribe: true,
      transcribeCallback: '/transcripcion'
  });

  res.type('text/xml').send(twiml.toString());
});

/* ---------- Callback de transcripción -------------------------- */
app.post('/transcripcion', async (req,res)=>{
  const texto = (req.body.TranscriptionText||'').trim();
  const twiml = new twilio.twiml.VoiceResponse();

  /*  Palabras clave para pasar a humano – ajusta a tu gusto  */
  const manual = ['humano','agente','representante','no entiendo','persona'];
  if (manual.some(k=>texto.toLowerCase().includes(k))){
      twiml.say({voice:'Polly.Conchita-Neural',language:'es-ES'},
        'En un momento le paso con un representante humano.');
      twiml.dial(process.env.FALLBACK_PHONE || '+50689101990');
      return res.type('text/xml').send(twiml.toString());
  }

  try{
     /* Pregunta a GPT-4 */
     const completion = await openai.chat.completions.create({
        model:'gpt-4o-mini', /* o gpt-4-turbo si lo tienes habilitado */
        messages:[
          { role:'system', content:'Eres la agente virtual femenina de Comidas Express. '
                +'Responde de forma cordial, clara, y siempre en español.'},
          { role:'user',   content: texto }
        ],
        max_tokens:120, temperature:0.7
     });

     const respuesta = completion.choices[0].message.content.trim();

     twiml.say({voice:'Polly.Conchita-Neural',language:'es-ES'}, respuesta);
     twiml.pause({length:1});
     twiml.say({voice:'Polly.Conchita-Neural',language:'es-ES'},
               '¿Puedo ayudarle en algo más? Hable después del tono.');
     twiml.record({
        timeout:5, maxLength:15,
        transcribe:true, transcribeCallback:'/transcripcion'
     });
  }catch(err){
     twiml.say({voice:'Polly.Conchita-Neural',language:'es-ES'},
               'Lo siento, hubo un inconveniente procesando su solicitud.');
  }

  res.type('text/xml').send(twiml.toString());
});

/* ---------- Keep-alive ----------------------------------------- */
app.get('/ping',(req,res)=>res.send('pong'));

app.listen(PORT, ()=>console.log('AgentExpress OK en puerto',PORT));
