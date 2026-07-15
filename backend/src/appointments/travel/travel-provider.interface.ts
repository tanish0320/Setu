export interface Coordinates {
  x: number;
  y: number;
}

export interface TravelProvider {
  calculateTravelTime(origin: Coordinates, destination: Coordinates): Promise<number>;
}
