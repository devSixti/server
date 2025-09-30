import express from "express";
import { isAuth, limiter } from "./common/middlewares";
import { discountRoutes, driversRoutes, vehiclesRoutes, walletRoutes, usersRoutes, notificationRoutes } from "./users/routes";
import adminRoutes from "./admin/routes/admin.routes";
import commonRoutes from "./common/routes/health.routes";
import { tripsRoutes } from "./trips/routes";
import { checkDriver } from "./trips/middlewares";
import webhookRoutes from "./common/routes/webhook.routes";

const app = express();
app.use(express.json());

app.set("trust proxy", 1);

// Aquí montamos las rutas
app.use("/users", usersRoutes);            // antes era "access"
app.use("/drivers", isAuth, driversRoutes);
app.use("/discounts", discountRoutes);
app.use("/wallet", isAuth, checkDriver, walletRoutes);
app.use("/vehicles", isAuth, vehiclesRoutes);
app.use("/notifications", isAuth, notificationRoutes);



app.use("/trips", isAuth, tripsRoutes);
app.use("/admin", adminRoutes);
app.use("/webhook", webhookRoutes);



app.use("/health", limiter, commonRoutes);

// app.use('/users', limiter ,userRouter)
// app.use('/driver', limiter ,driverRouter)
// app.use('/validate', limiter ,validationRouter)
// app.use('/travel', limiter ,travelsRouter)

export default app;
