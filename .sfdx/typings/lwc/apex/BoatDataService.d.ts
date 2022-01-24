declare module "@salesforce/apex/BoatDataService.getBoats" {
  export default function getBoats(param: {boatTypeId: any}): Promise<any>;
}
declare module "@salesforce/apex/BoatDataService.getSimilarBoats" {
  export default function getSimilarBoats(param: {boatId: any, similarBy: any}): Promise<any>;
}
declare module "@salesforce/apex/BoatDataService.getBoatTypes" {
  export default function getBoatTypes(): Promise<any>;
}
declare module "@salesforce/apex/BoatDataService.getAllReviews" {
  export default function getAllReviews(param: {boatId: any}): Promise<any>;
}
declare module "@salesforce/apex/BoatDataService.getBoatsByLocation" {
  export default function getBoatsByLocation(param: {latitude: any, longitude: any, boatTypeId: any}): Promise<any>;
}
declare module "@salesforce/apex/BoatDataService.updateBoatList" {
  export default function updateBoatList(param: {data: any}): Promise<any>;
}
