import mongoose from "mongoose";
import { connectDb } from "../src/common/config";
import {
  DeviceModel,
  DriverModel,
  RoleModel,
  UserModel,
  VehicleModel,
  WalletModel,
} from "../src/users/models";
import { exampleDrivers, exampleUsers, exampleVehicles, exampleWallet, roles, exampleDevices } from "./users"; // Import example devices

const seedDatabase = async () => {
  try {
    await connectDb();
    // Eliminar datos existentes
    await UserModel.deleteMany({});
    await DriverModel.deleteMany({});
    await VehicleModel.deleteMany({});
    await RoleModel.deleteMany({});
    await WalletModel.deleteMany({});
    await DeviceModel.deleteMany({})

    // Crear roles
    const createdRoles = await RoleModel.insertMany(roles);

    // Asignar role_id a los usuarios creados
    const usersWithRoles = exampleUsers.map((user, index) => ({
      ...user,
      role_id: createdRoles[index % createdRoles.length]._id,
    }));
    const createdUsers = await UserModel.insertMany(usersWithRoles);

    // Crear devices y asignar user_id
    const devicesToCreate = createdUsers.map((user, index) => ({
      ...exampleDevices[index % exampleDevices.length],
      user_id: user._id,
    }));

    await DeviceModel.insertMany(devicesToCreate);

    // Crear conductores y asignar user_id
    const driversToCreate = createdUsers.map((user, index) => ({
      ...exampleDrivers[index % exampleDrivers.length],
      user_id: user._id,
    }));

    const createdDrivers = await DriverModel.insertMany(driversToCreate);

    // Crear wallets y asignar driver_id
    const walletsToCreate = createdDrivers.map((driver, index) => ({
      ...exampleWallet[index % exampleWallet.length],
      driver_id: driver._id,
    }));

    await WalletModel.insertMany(walletsToCreate);


    // Actualizar driver_id en los vehículos de ejemplo
    const vehiclesToCreate = exampleVehicles.map((vehicle, index) => ({
      ...vehicle,
      driver_id: createdDrivers[index % createdDrivers.length]._id,
    }));

    // Crear vehículos
    const createdVehicles = await VehicleModel.insertMany(vehiclesToCreate);

    // Actualizar los conductores con el id del vehículo creado
    const driverUpdates = createdVehicles.map((vehicle, index) => ({
      updateOne: {
        filter: { _id: createdDrivers[index % createdDrivers.length]._id },
        update: { vehicle_id: vehicle._id },
      },
    }));

    await DriverModel.bulkWrite(driverUpdates);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.error("Disconnected from MongoDB");
  }
};

seedDatabase();
