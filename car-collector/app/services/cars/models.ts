/**
 * Car option
 */
export interface CarOption {
  id: number;
  fi: string;
  en: string;
}

/**
 * Car ad
 */
export interface CarAd {
  status: 'forsale' | 'onhold' | 'sold' | 'expired' | 'removed';
  id: string;
  adUrl: string;
  userId: number;
  userName: string;
  postedBy: string;
  dateCreated: Date;
  dateUpdated: Date;
  lastModified: Date;
  vehicleType: CarOption;
  make: CarOption;
  model: CarOption;
  modelType?: CarOption;
  bodyType: CarOption;
  color: CarOption;
  colorType: CarOption;
  fuelType: CarOption;
  driveType: CarOption;
  gearType: CarOption;
  country: CarOption;
  region: CarOption;
  town: CarOption;
  accessories: CarOption[];
  year: number;
  modelTypeName: string;
  vin?: string;
  firstRegistrationMonth?: number;
  firstRegistrationYear?: number;
  roadWorthy: boolean;
  lastInspectionMonth?: number;
  lastInspectionYear?: number;
  tooNewForInspections: boolean;
  price: number;
  isPriced: boolean;
  taxFree: boolean;
  vatDeduct: boolean;
  registerNumber: string;
  showRegisterNumber: boolean;
  totalOwners?: number;
  description: string;
  showPostingDate: boolean;
  kilometers: number;
  engineSize: number;
  seats: number;
  doors: number;
  steeringWheelLeft: boolean;
  power: number;
  powerUnitIsKw: boolean;
  batteryCapacity?: string;
  electricRange?: string;
  torque?: string;
  co2Emission: number;
  topSpeed: number;
  acceleration: number;
  consumptionUrban?: number;
  consumptionRoad?: number;
  consumptionCombined: number;
}
