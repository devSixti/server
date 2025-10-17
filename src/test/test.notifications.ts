import * as dotenv from 'dotenv';
dotenv.config();
import { NotificationService } from "../users/services/notification.service";

async function testNotification() {
  const token = "fQFEgcyrS2g9HGJefsoyzR:APA91bGEXAMPLE..."; 

  const result = await NotificationService.sendToToken(
    token,
    "🚨 Prueba",
    "Este es un mensaje de prueba",
    { tripId: "123456" }
  );

  console.log("Resultado del envío:", result);
}

testNotification();
