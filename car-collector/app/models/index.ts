import { CarAd } from '../services/cars';

/**
 * Car model
 */
export interface Car {
  id: string;
  adUrl: string;
  userName: string;
  postedBy: string;
  dateCreated: Date;
  dateUpdated: Date;
  vehicleType: string;
  make: string;
  model: string;
  bodyType: string;
  color: string;
  colorType: string;
  fuelType: string;
  driveType: string;
  gearType: string;
  country: string;
  region: string;
  manufacturingYear: number;
  modelTypeName: string;
  vin?: string;
  firstRegistrationMonth?: number;
  firstRegistrationYear?: number;
  price: number;
  registerNumber: string;
  totalOwners?: number;
  description: string;
  kilometers: number;
  engineSize: number;
  seats: number;
  doors: number;
  co2Emission: number;
  topSpeed: number;
  acceleration: number;
  consumptionCombined: number;
}

export const toCar = (carAd: CarAd): Car => {
  const car: Car = {
    id: carAd.id,
    adUrl: carAd.adUrl,
    userName: carAd.userName,
    postedBy: carAd.postedBy,
    dateCreated: carAd.dateCreated,
    dateUpdated: carAd.dateUpdated,
    vehicleType: carAd.vehicleType?.en,
    make: carAd.make?.name,
    model: carAd.model?.name,
    bodyType: carAd.bodyType?.en,
    color: carAd.color?.en,
    colorType: carAd.colorType?.en,
    fuelType: carAd.fuelType?.en,
    driveType: carAd.driveType?.en,
    gearType: carAd.gearType?.en,
    country: carAd.country?.en,
    region: carAd.region?.en,
    manufacturingYear: carAd.year,
    modelTypeName: carAd.modelTypeName,
    vin: carAd.vin,
    firstRegistrationMonth: carAd.firstRegistrationMonth,
    firstRegistrationYear: carAd.firstRegistrationYear,
    price: carAd.price,
    registerNumber: carAd.registerNumber,
    totalOwners: carAd.totalOwners,
    description: carAd.description,
    kilometers: carAd.kilometers,
    engineSize: carAd.engineSize,
    seats: carAd.seats,
    doors: carAd.doors,
    co2Emission: carAd.co2Emission,
    topSpeed: carAd.topSpeed,
    acceleration: carAd.acceleration,
    consumptionCombined: carAd.consumptionCombined,
  };
  return car;
};
